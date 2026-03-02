import os
import shutil

from fastapi import FastAPI, requests
from fastapi.middleware.cors import CORSMiddleware
from app.auth import router as auth_router
from app.database import init_db
import contextlib
from pathlib import Path
from fastapi import UploadFile, File, Form, HTTPException
from playwright.sync_api import expect
from pydantic import BaseModel
from app.services.chunking_service import ChunkingService
from app.services.pdf_service import PDFProcessor
from app.services.vector_db_service import VectorDBService

class QueryRequest(BaseModel):
    query:str
    vault_name:str



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

# We will initilize once at startup to keep the AI model in memory
CHUNK_SERVICE= ChunkingService(chunk_size=800, chunk_overlap=150)
PDF_PROCESSOR= PDFProcessor(chunking_service=CHUNK_SERVICE)
VECTOR_SERVICE= VectorDBService()

# "Temp" Safeguard
TEMP_DIR= Path("temp")
TEMP_DIR.mkdir(exist_ok=True)

@app.post("/upload")
async def upload_document(
        file: UploadFile= File(...),
        domain:str= Form(...)
):
    temp_path= TEMP_DIR/ file.filename

    try:
        ''' "wb" means write-binary. Shutill handles the stram efficiently.'''
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Convert PDF to structured chunks
        processed_chunks= PDF_PROCESSOR.process_pdf(str(temp_path), domain)
        if not processed_chunks:
            raise HTTPException(status_code=400, detail="PDF contained no extractable text.")

        # Ingest into ChromaDB(using 'domain' as our vault/collection name)
        VECTOR_SERVICE.add_to_vault(vault_name=domain, processed_chunks=processed_chunks)
        return{
            "status": "success",
            "filename": file.filename,
            "chunks_count": len(processed_chunks),
            "vault": domain
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    finally:
        if temp_path.exists():
            os.remove(temp_path)
            print(f"Temp file cleaned:{temp_path}")

@app.post("/chat/query")
async def chat_query(request:QueryRequest)->dict:
    try:
        results= VECTOR_SERVICE.search_vault(
            vault_name= request.vault_name,
            query_text=request.query
        )

        if not results:
            return{
                "status":"success",
                "message":"No relevant documents found.",
                "results":[]
            }
        context_block= "\n\n".join([res["content"] for res in results])
        return{
            "status":"success",
            "query":request.query,
            "vault":request.vault_name,
            "response":f"Found {len(results)} relevant sections.",
            "context": context_block,
            "sources":results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="An internal error occurred.")

    


@app.get("/")
def read_root():
    return {"message": "Vault AI Backend is running"}
