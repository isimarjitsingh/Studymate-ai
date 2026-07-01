import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Message from "./Message";

const ChatBox = () => {

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! Upload PDFs and ask me anything."
    }
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const streamResponse = async (text) => {

    const words = text.split(" ");

    let currentText = "";

    const aiMessageIndex = messages.length + 1;

    setMessages(prev => [
      ...prev,
      {
        sender: "ai",
        text: ""
      }
    ]);

    for (let i = 0; i < words.length; i++) {

      currentText += words[i] + " ";

      setMessages(prev => {

        const updated = [...prev];

        updated[aiMessageIndex] = {
          sender: "ai",
          text: currentText
        };

        return updated;
      });

      await new Promise(resolve =>
        setTimeout(resolve, 25)
      );
    }
  };

  const sendMessage = async () => {

    if (!question.trim()) return;

    const currentQuestion = question;

    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: currentQuestion
      }
    ]);

    setQuestion("");
    setLoading(true);

    try {

      const formData = new FormData();

      formData.append(
        "question",
        currentQuestion
      );

      const response = await axios.post(
          `${API_URL}/ask`,
          formData
      );

      await streamResponse(
        response.data.answer
      );

    } catch (error) {

      console.error(error);

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Something went wrong while generating the response."
        }
      ]);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="bg-slate-900 mt-10 p-6 rounded-2xl">

      <h2 className="text-2xl font-semibold mb-4">
        Chat
      </h2>

      <div className="h-[450px] overflow-y-auto space-y-4 pr-2">

        {messages.map((msg, index) => (
          <Message
            key={index}
            sender={msg.sender}
            text={msg.text}
          />
        ))}

        {loading && (
          <div className="max-w-[80%] bg-slate-700 p-4 rounded-xl text-gray-200">
            🤖 Thinking...
          </div>
        )}

        <div ref={messagesEndRef}></div>

      </div>

      <div className="flex gap-3 mt-5">

        <input
          type="text"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {

            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              sendMessage();
            }

          }}
          placeholder="Ask a question..."
          className="flex-1 p-3 rounded-xl bg-slate-800 outline-none border border-slate-700 focus:border-blue-500"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>

      </div>

    </div>
  );
};

export default ChatBox;