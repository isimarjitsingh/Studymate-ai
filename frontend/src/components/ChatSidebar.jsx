import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Message from "./Message";

const ChatSidebar = ({ onStatsUpdate }) => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! I'm StudyMate AI. Upload your PDFs and ask me anything about them. I'm here to help you study smarter!"
    }
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [thumbsUp, setThumbsUp] = useState(0);
  const [thumbsDown, setThumbsDown] = useState(0);

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
      await new Promise(resolve => setTimeout(resolve, 25));
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
    setQuestionCount(prev => prev + 1);

    try {
      const response = await axios.post(
        `${API_URL}/ask`,
        { question: currentQuestion },
        { headers: { "Content-Type": "application/json" } }
      );

      await streamResponse(response.data.answer);

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

  const handleNewChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "👋 Hello! I'm StudyMate AI. Upload your PDFs and ask me anything about them. I'm here to help you study smarter!"
      }
    ]);
    setQuestionCount(0);
    setThumbsUp(0);
    setThumbsDown(0);
  };

  const handleFeedback = (feedback) => {
    if (feedback === "up") {
      setThumbsUp(prev => prev + 1);
    } else {
      setThumbsDown(prev => prev + 1);
    }
  };

  const accuracy = thumbsUp + thumbsDown > 0 
    ? Math.round((thumbsUp / (thumbsUp + thumbsDown)) * 100) 
    : 0;

  // Update parent component with stats
  useEffect(() => {
    if (onStatsUpdate) {
      onStatsUpdate(questionCount, accuracy);
    }
  }, [questionCount, accuracy, onStatsUpdate]);

  return (
    <div className="w-[500px] bg-white border-l border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">AI Chat</h2>
          <div className="flex gap-4 text-xs text-gray-500 mt-1">
            <span>Questions: {questionCount}</span>
            <span>Accuracy: {accuracy}%</span>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
        >
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {messages.map((msg, index) => (
          <Message
            key={index}
            sender={msg.sender}
            text={msg.text}
            onFeedback={msg.sender === "ai" ? handleFeedback : null}
          />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-gray-100 p-4 rounded-xl text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything about your PDFs..."
            className="flex-1 p-3 rounded-xl bg-gray-100 outline-none border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !question.trim()}
            className="bg-purple-600 hover:bg-purple-700 transition px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          StudyMate AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatSidebar;
