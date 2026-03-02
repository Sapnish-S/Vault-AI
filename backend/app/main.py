import os
import shutil
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from app.auth import router as auth_router
from app.database import init_db, get_db
import contextlib
import aiosqlite
from pathlib import Path
from fastapi import UploadFile, File, Form
from pydantic import BaseModel
from app.services.chunking_service import ChunkingService
from app.services.pdf_service import PDFProcessor
from app.services.vector_db_service import VectorDBService


class QueryRequest(BaseModel):
    query: str
    vault_name: str


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/auth", tags=["auth"])

# Initialize services once at startup to keep the AI model in memory
CHUNK_SERVICE = ChunkingService(chunk_size=800, chunk_overlap=150)
PDF_PROCESSOR = PDFProcessor(chunking_service=CHUNK_SERVICE)
VECTOR_SERVICE = VectorDBService()

# Temp upload dir
TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)


# ─────────────────────────────────────────────────────────────────────────────
# Vault file tracking helpers
# ─────────────────────────────────────────────────────────────────────────────

async def file_exists_in_vault(db: aiosqlite.Connection, user_id: int, vault_name: str, filename: str) -> bool:
    async with db.execute(
        "SELECT 1 FROM vault_files WHERE user_id=? AND vault_name=? AND filename=?",
        (user_id, vault_name, filename)
    ) as cursor:
        return await cursor.fetchone() is not None


async def record_vault_file(db: aiosqlite.Connection, user_id: int, vault_name: str, filename: str):
    await db.execute(
        "INSERT OR IGNORE INTO vault_files (user_id, vault_name, filename, uploaded_at) VALUES (?, ?, ?, ?)",
        (user_id, vault_name, filename, datetime.now(timezone.utc).isoformat())
    )
    await db.commit()


# ─────────────────────────────────────────────────────────────────────────────
# Upload endpoint (extended with file tracking)
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/upload")
async def upload_document(
        file: UploadFile = File(...),
        domain: str = Form(...),
        user_id: int = Form(...),
        db: aiosqlite.Connection = Depends(get_db)
):
    temp_path = TEMP_DIR / file.filename

    # Check for duplicate BEFORE doing expensive PDF processing
    if await file_exists_in_vault(db, user_id, domain, file.filename):
        raise HTTPException(
            status_code=409,
            detail=f"'{file.filename}' has already been added to this vault."
        )

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        processed_chunks = PDF_PROCESSOR.process_pdf(str(temp_path), domain)
        if not processed_chunks:
            raise HTTPException(status_code=400, detail="PDF contained no extractable text.")

        VECTOR_SERVICE.add_to_vault(vault_name=domain, processed_chunks=processed_chunks)

        # Record the file so we can track it and prevent re-uploads
        await record_vault_file(db, user_id, domain, file.filename)

        return {
            "status": "success",
            "filename": file.filename,
            "chunks_count": len(processed_chunks),
            "vault": domain
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    finally:
        if temp_path.exists():
            os.remove(temp_path)


# ─────────────────────────────────────────────────────────────────────────────
# Vault listing endpoints
# ─────────────────────────────────────────────────────────────────────────────

class CreateVaultRequest(BaseModel):
    vault_name: str
    user_id: int

@app.post("/vaults")
async def create_vault(request: CreateVaultRequest, db: aiosqlite.Connection = Depends(get_db)):
    """Create a new empty vault for a user."""
    try:
        await db.execute(
            "INSERT INTO user_vaults (user_id, vault_name, created_at) VALUES (?, ?, ?)",
            (request.user_id, request.vault_name, datetime.now(timezone.utc).isoformat())
        )
        await db.commit()
        return {"status": "success", "vault_name": request.vault_name}
    except aiosqlite.IntegrityError:
        raise HTTPException(status_code=409, detail="A vault with this name already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/vaults")
async def list_vaults(user_id: int = Query(...), db: aiosqlite.Connection = Depends(get_db)):
    """Return all vaults for a user with their file counts, including empty vaults."""
    async with db.execute(
        """
        SELECT uv.vault_name, COUNT(vf.id) as file_count
        FROM user_vaults uv
        LEFT JOIN vault_files vf ON uv.user_id = vf.user_id AND uv.vault_name = vf.vault_name
        WHERE uv.user_id = ?
        GROUP BY uv.vault_name
        ORDER BY uv.vault_name
        """,
        (user_id,)
    ) as cursor:
        rows = await cursor.fetchall()

    return {
        "vaults": [{"name": row[0], "file_count": row[1]} for row in rows]
    }


@app.get("/vaults/{vault_name}/files")
async def list_vault_files(vault_name: str, user_id: int = Query(...), db: aiosqlite.Connection = Depends(get_db)):
    """Return all files in a specific vault for a user."""
    async with db.execute(
        """
        SELECT filename, uploaded_at
        FROM vault_files
        WHERE user_id = ? AND vault_name = ?
        ORDER BY uploaded_at DESC
        """,
        (user_id, vault_name)
    ) as cursor:
        rows = await cursor.fetchall()

    return {
        "vault": vault_name,
        "files": [{"filename": row[0], "uploaded_at": row[1]} for row in rows]
    }


# ─────────────────────────────────────────────────────────────────────────────
# Chat query endpoint
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/chat/query")
async def chat_query(request: QueryRequest) -> dict:
    try:
        results = VECTOR_SERVICE.search_vault(
            vault_name=request.vault_name,
            query_text=request.query
        )

        if not results:
            return {
                "status": "success",
                "message": "No relevant documents found.",
                "results": []
            }
        context_block = "\n\n".join([res["content"] for res in results])
        return {
            "status": "success",
            "query": request.query,
            "vault": request.vault_name,
            "response": f"Found {len(results)} relevant sections.",
            "context": context_block,
            "sources": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="An internal error occurred.")


# ─────────────────────────────────────────────────────────────────────────────
# Health check
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "Vault AI Backend is running"}
