import ReactMarkdown from "react-markdown";

const Message = ({ sender, text }) => {

  const isUser = sender === "user";

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`max-w-[80%] p-4 rounded-xl ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-slate-700 text-gray-100"
        }`}
      >

        <ReactMarkdown>
          {text}
        </ReactMarkdown>

      </div>

    </div>
  );
};

export default Message;