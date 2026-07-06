import { useState } from "react";
import FileUpload from "./FileUpload";

const Sidebar = ({ onUploadClick, onTabChange, questionCount, accuracy }) => {
  const [activeTab, setActiveTab] = useState("chat");

  const navItems = [
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "documents", label: "Documents", icon: "📄" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-purple-600">StudyMate AI</h1>
      </div>

      {/* Upload Button */}
      <div className="p-4">
        <button
          onClick={onUploadClick}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span>
          Upload PDF(s)
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${
              activeTab === item.id
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Stats */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Session Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Questions Asked</span>
              <span className="font-semibold text-purple-600">{questionCount || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-semibold text-purple-600">{accuracy || 0}%</span>
            </div>
          </div>
        </div>
      </div>

    

    </div>
  );
};

export default Sidebar;
