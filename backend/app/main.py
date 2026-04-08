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
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json
from app.services.chunking_service import ChunkingService
from app.services.pdf_service import PDFProcessor
from app.services.vector_db_service import VectorDBService
from app.services.llm_service import LLMService


class QueryRequest(BaseModel):
    query: str
    vault_name: str
    chat_id: int | None = None
    user_id: int = 1
    sender_name: str | None = None
    receiver_name: str | None = None
    label: str | None = None
    time_frame: str | None = None
 

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

# Lazily initialized to prevent process lock errors during Uvicorn hot-reloads
LLM_SERVICE = None

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

        # Move it to persistent vault storage instead of deleting
        vault_dir = Path("data/vaults") / domain
        vault_dir.mkdir(parents=True, exist_ok=True)
        dest_path = vault_dir / file.filename
        shutil.move(str(temp_path), str(dest_path))

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
            try:
                os.remove(temp_path)
            except:
                pass


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

@app.get("/vaults/{vault_name}/files/{filename}/download")
async def download_vault_file(vault_name: str, filename: str):
    file_path = Path("data/vaults") / vault_name / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)


# ─────────────────────────────────────────────────────────────────────────────
# Chat query endpoint
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/chat/query")
async def chat_query(request: QueryRequest, db: aiosqlite.Connection = Depends(get_db)) -> dict:
    global LLM_SERVICE
    try:
        # Determine chat_id
        chat_id = request.chat_id
        if request.chat_id is None:
            if LLM_SERVICE is None:
                LLM_SERVICE = LLMService()
            title = LLM_SERVICE.generate_chat_title(request.query)
            async with db.execute(
                "INSERT INTO chats (user_id, vault_name, title, created_at, sender_name, receiver_name, label, time_frame) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (request.user_id, request.vault_name, title, datetime.now(timezone.utc).isoformat(), request.sender_name or "User", request.receiver_name or "Vault AI", request.label or "General", request.time_frame or "Recent")
            ) as cursor:
                chat_id = cursor.lastrowid
            await db.commit()

        # Save user message
        await db.execute(
            "INSERT INTO chat_messages (chat_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
            (chat_id, "user", request.query, datetime.now(timezone.utc).isoformat())
        )
        await db.commit()

        results = VECTOR_SERVICE.search_vault(
            vault_name=request.vault_name,
            query_text=request.query
        )

        if not results:
            generated_response = "No relevant documents found in this vault to construct an answer."
            context_block = ""
        else:
            context_block = "\n\n".join([f"[Source: {res['metadata']['source']}, Page: {res['metadata']['page']}]\n{res['content']}" for res in results])
            if LLM_SERVICE is None:
                LLM_SERVICE = LLMService()
                
            generated_response = LLM_SERVICE.generate_answer(
                query=request.query, 
                context=context_block
            )

        # Save assistant message
        sources_json = json.dumps(results) if results else "[]"
        try:
            await db.execute(
                "INSERT INTO chat_messages (chat_id, role, content, timestamp, sources) VALUES (?, ?, ?, ?, ?)",
                (chat_id, "assistant", generated_response, datetime.now(timezone.utc).isoformat(), sources_json)
            )
        except Exception:
            # Fallback if migration hasn't run
            await db.execute(
                "INSERT INTO chat_messages (chat_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
                (chat_id, "assistant", generated_response, datetime.now(timezone.utc).isoformat())
            )
        await db.commit()

        return {
            "status": "success",
            "chat_id": chat_id,
            "query": request.query,
            "vault": request.vault_name,
            "response": generated_response,
            "context": context_block,
            "sources": results
        }
    except Exception as e:
        print(f"Chat query error: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred.")

# ─────────────────────────────────────────────────────────────────────────────
# User and Chat History Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/users/{user_id}")
async def get_user_profile(user_id: int, db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute("SELECT username, first_name, last_name, email, role FROM users WHERE id = ?", (user_id,)) as cursor:
        row = await cursor.fetchone()
    
    if row:
        return {"id": user_id, "username": row[0], "first_name": row[1], "last_name": row[2], "email": row[3], "role": row[4] or "Software Engineer"}
    else:
        # Default person description fallback
        return {"id": user_id, "username": "sapnish", "first_name": "Sapnish", "last_name": "", "email": "sapnish@example.com", "title": "System Administrator"}

@app.get("/chats")
async def list_chats(
    user_id: int = Query(...), 
    search_query: str | None = Query(None),
    db: aiosqlite.Connection = Depends(get_db)
):
    query = "SELECT id, title, created_at, sender_name, receiver_name, label, time_frame, vault_name FROM chats WHERE user_id = ?"
    params = [user_id]
    
    if search_query:
        query += " AND (title LIKE ? OR label LIKE ? OR EXISTS (SELECT 1 FROM chat_messages cm WHERE cm.chat_id = chats.id AND cm.content LIKE ?))"
        term = f"%{search_query}%"
        params.extend([term, term, term])
        
    query += " ORDER BY created_at DESC"
    
    async with db.execute(query, tuple(params)) as cursor:
        rows = await cursor.fetchall()
        
    if search_query:
        import re
        pattern = re.compile(rf'\b{re.escape(search_query)}\b', re.IGNORECASE)
        filtered_rows = []
        for r in rows:
            chat_id, title, _, _, _, label, _, vault_name = r
            if (title and pattern.search(title)) or (label and pattern.search(label)):
                filtered_rows.append(r)
                continue
            
            async with db.execute("SELECT content FROM chat_messages WHERE chat_id = ?", (chat_id,)) as msg_cursor:
                msg_rows = await msg_cursor.fetchall()
                if any(pattern.search(m[0]) for m in msg_rows):
                    filtered_rows.append(r)
        rows = filtered_rows
        
    return {"chats": [{
        "id": str(r[0]), 
        "title": r[1], 
        "timestamp": r[2],
        "sender_name": r[3],
        "receiver_name": r[4],
        "label": r[5],
        "time_frame": r[6],
        "vault_name": r[7]
    } for r in rows]}

@app.get("/chats/{chat_id}/messages")
async def list_chat_messages(chat_id: int, db: aiosqlite.Connection = Depends(get_db)):
    try:
        async with db.execute(
            "SELECT id, role, content, timestamp, sources FROM chat_messages WHERE chat_id = ? ORDER BY id ASC", 
            (chat_id,)
        ) as cursor:
            rows = await cursor.fetchall()
        return {"messages": [{"id": str(r[0]), "role": r[1], "content": r[2], "timestamp": r[3], "sources": json.loads(r[4]) if r[4] else []} for r in rows]}
    except Exception:
        # Fallback if sources column missing
        async with db.execute(
            "SELECT id, role, content, timestamp FROM chat_messages WHERE chat_id = ? ORDER BY id ASC", 
            (chat_id,)
        ) as cursor:
            rows = await cursor.fetchall()
        return {"messages": [{"id": str(r[0]), "role": r[1], "content": r[2], "timestamp": r[3]} for r in rows]}


# ─────────────────────────────────────────────────────────────────────────────
# Vault deletion endpoint
# ─────────────────────────────────────────────────────────────────────────────

@app.delete("/vaults/{vault_name}/files/{filename}")
async def delete_vault_file(vault_name: str, filename: str, user_id: int = Query(...), db: aiosqlite.Connection = Depends(get_db)):
    """Delete a specific file from a vault."""
    try:
        # Delete from DB
        await db.execute("DELETE FROM vault_files WHERE user_id=? AND vault_name=? AND filename=?", (user_id, vault_name, filename))
        await db.commit()
        
        # Delete from Vector DB
        try:
            collection = VECTOR_SERVICE.get_or_create_vault(vault_name)
            collection.delete(where={"source": filename})
        except Exception as e:
            print(f"Error removing from vector DB: {e}")
            
        # Delete practically
        file_path = Path("data/vaults") / vault_name / filename
        if file_path.exists():
            os.remove(file_path)
            
        return {"status": "success", "message": f"Deleted {filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/vaults/{vault_name}")
async def delete_vault(vault_name: str, user_id: int = Query(...), db: aiosqlite.Connection = Depends(get_db)):
    try:
        # 1. Delete physical PDFs
        vault_dir = Path("data/vaults") / vault_name
        if vault_dir.exists():
            shutil.rmtree(vault_dir, ignore_errors=True)
            
        # 2. Delete ChromaDB collection
        global VECTOR_SERVICE
        if VECTOR_SERVICE is None:
            VECTOR_SERVICE = VectorDBService()
        VECTOR_SERVICE.delete_vault(vault_name)
        
        # 3. Clean SQLite data
        await db.execute(
            "DELETE FROM chat_messages WHERE chat_id IN (SELECT id FROM chats WHERE vault_name = ? AND user_id = ?)",
            (vault_name, user_id)
        )
        await db.execute("DELETE FROM chats WHERE vault_name = ? AND user_id = ?", (vault_name, user_id))
        await db.execute("DELETE FROM vault_files WHERE vault_name = ? AND user_id = ?", (vault_name, user_id))
        await db.execute("DELETE FROM user_vaults WHERE vault_name = ? AND user_id = ?", (vault_name, user_id))
        
        await db.commit()
        return {"status": "success", "message": f"Vault '{vault_name}' successfully deleted."}
    except Exception as e:
        print(f"Delete vault error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ─────────────────────────────────────────────────────────────────────────────
# Health check
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "Vault AI Backend is running"}
