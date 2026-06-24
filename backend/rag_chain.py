from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import vector_store as vs
import os
from langchain_core.messages import HumanMessage,AIMessage
from langchain_core.chat_history import InMemoryChatMessageHistory


load_dotenv()

llm=ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

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

        IMPORTANT:
        - Use markdown formatting.
        - Use headings.
        - Use bullet points.
        - Use numbered lists where suitable.
        - Keep answers concise.
        - Use examples whenever possible.

        Answer the question  only using the provided context,give the answer in a proper manner so taht student able to easily understand do make points of the context if needed and give the output in a interactive way so that student able to easily interact with that .and also handle some basic prompts by urself like "hlo", "who u are " and all the basic daily stuff.try to wrapup the output as much as in less words.

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