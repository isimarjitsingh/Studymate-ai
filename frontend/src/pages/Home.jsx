import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import ChatSidebar from "../components/ChatSidebar";
import Documents from "../components/Documents";
import FileUpload from "../components/FileUpload";

const Home = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const handleUploadSuccess = (files) => {
    setUploadedFiles(prev => [...files, ...prev]);
    setUploadStatus('success');
  };

  const handleUploadError = () => {
    setUploadStatus('error');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleStatsUpdate = (count, acc) => {
    setQuestionCount(count);
    setAccuracy(acc);
  };

  const renderMainContent = () => {
    if (activeTab === "documents") {
      return <Documents uploadedFiles={uploadedFiles} uploadStatus={uploadStatus} />;
    }
    return <MainContent onStartChat={() => {}} uploadedFiles={uploadedFiles} />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        onUploadClick={() => setShowUploadModal(true)} 
        onTabChange={handleTabChange}
        questionCount={questionCount}
        accuracy={accuracy}
      />
      {renderMainContent()}
      <ChatSidebar onStatsUpdate={handleStatsUpdate} />
      
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Upload PDFs</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <FileUpload 
              onClose={() => setShowUploadModal(false)} 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;