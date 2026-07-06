from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from dotenv import load_dotenv
import vector_store as vs
import os
from langchain_core.messages import HumanMessage,AIMessage
from langchain_core.chat_history import InMemoryChatMessageHistory

load_dotenv()

chat = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
    max_new_tokens=512,
    temperature=0.3,
)

llm = ChatHuggingFace(llm=chat)

history=InMemoryChatMessageHistory()

def ask_question(question,vector_store):

    bm25_docs=vs.bm25_retriever.invoke(
        question
    )

    faiss_docs=vector_store.similarity_search(
        question,
        k=5
    )

    all_docs=bm25_docs+faiss_docs

    unique_docs={}

    for doc in all_docs:
        unique_docs[doc.page_content]=doc

    retreived_docs=list(unique_docs.values())

    parent_ids=set()
   
    for doc in retreived_docs:
        if "parent_id" in doc.metadata:
            parent_ids.add(doc.metadata["parent_id"])

    context="\n\n".join(vs.parent_store[parent_id]for parent_id in parent_ids)

    prompt = f"""
        You are an experienced IT teacher.

        IMPORTANT RULES:
        - Use markdown formatting.
        - Use headings.
        - Use bullet points.
        - Use numbered lists where suitable.
        - Keep answers concise.
        - Use examples whenever possible.
        
        CRITICAL: Answer ONLY using the provided context below.
        - If the answer is NOT available in the context, say "I cannot answer this question based on the provided documents."
        - Do NOT use outside knowledge or make up information.
        - Do NOT guess or hallucinate answers.
        - If the context doesn't contain the information, be honest and say so.
        
        For basic greetings like "hello", "hi", "who are you", respond politely as an AI assistant.

        Context:
        {context}

        Question:
        {question}
    """

    messages=history.messages.copy()
    messages.append(HumanMessage(content=prompt))
    response=llm.invoke(messages)

    answer=response.content
    history.add_message(HumanMessage(content=question))
    history.add_message(AIMessage(content=answer))

    return answer