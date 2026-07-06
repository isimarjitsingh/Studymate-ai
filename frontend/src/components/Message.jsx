import ReactMarkdown from "react-markdown";
import { useState } from "react";

const Message = ({ sender, text, onFeedback }) => {
  const isUser = sender === "user";
  const [feedback, setFeedback] = useState(null);

  const handleThumbsUp = () => {
    setFeedback("up");
    if (onFeedback) onFeedback("up");
  };

  const handleThumbsDown = () => {
    setFeedback("down");
    if (onFeedback) onFeedback("down");
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-2 flex-shrink-0">
          🤖
        </div>
      )}
      <div className="flex flex-col">
        <div
          className={`max-w-[80%] p-4 rounded-xl ${
            isUser
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
        {!isUser && !feedback && (
          <div className="flex gap-2 mt-1 ml-2">
            <button
              onClick={handleThumbsUp}
              className="text-gray-400 hover:text-green-500 transition text-sm"
              title="Helpful"
            >
              👍
            </button>
            <button
              onClick={handleThumbsDown}
              className="text-gray-400 hover:text-red-500 transition text-sm"
              title="Not helpful"
            >
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;