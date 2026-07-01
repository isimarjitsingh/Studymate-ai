from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.retrievers import BM25Retriever
import uuid

load_dotenv()

llm = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

parent_store={}
bm25_retriever=None

def create_vector_store(all_docs):
    global parent_store

    parent_splitter=RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    child_splitter=RecursiveCharacterTextSplitter(
        chunk_size=200,
        chunk_overlap=50
    )


    parent_chunks=parent_splitter.split_documents(all_docs)

    child_chunks=[]
    global bm25_retriever

    for parent_chunk in parent_chunks:
        parent_id=str(uuid.uuid4())
        parent_store[parent_id]=parent_chunk.page_content
        children=child_splitter.create_documents([parent_chunk.page_content])
        
        for child in children:
            child.metadata["parent_id"]=parent_id
            child_chunks.append(child)


    bm25_retriever=BM25Retriever.from_documents(
        child_chunks
    )
    bm25_retriever.k=5


    vector_store=FAISS.from_documents(
        child_chunks,
        llm
    )

    return vector_store