from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os

from pdf_loader import load_pdf
from vector_store import create_vector_store
from rag_chain import ask_question

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Vector Store
vector_store = None


@app.get("/")
def home():
    return {"message": "StudyMate AI Backend Running"}


# Upload PDFs
@app.post("/upload")
async def upload_pdfs(
    files: list[UploadFile] = File(...)
):
    global vector_store

    all_docs = []

    os.makedirs("uploads", exist_ok=True)

    for file in files:

        file_path = f"uploads/{file.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        docs = load_pdf(file_path)

        all_docs.extend(docs)

    vector_store = create_vector_store(
        all_docs
    )

    return {
        "message": "PDFs uploaded successfully",
        "documents_loaded": len(all_docs)
    }


# Ask Question
@app.post("/ask")
async def ask(
    question: str = Form(...)
):
    global vector_store

    if vector_store is None:
        return {
            "error": "Please upload PDFs first"
        }

    answer = ask_question(
        question,
        vector_store
    )

    return {
        "answer": answer
    }