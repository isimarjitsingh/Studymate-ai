const MainContent = ({ onStartChat, uploadedFiles }) => {
  const features = [
    {
      icon: "📚",
      title: "Multi-PDF Support",
      description: "Upload and chat with multiple PDF documents simultaneously"
    },
    {
      icon: "🤖",
      title: "AI Powered",
      description: "Powered by Gemini 2.5 for accurate and intelligent responses"
    },
    {
      icon: "🔍",
      title: "Hybrid Retrieval",
      description: "Advanced search technology for precise information extraction"
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your documents are encrypted and never shared"
    }
  ];

  const pdfCount = uploadedFiles ? uploadedFiles.length : 0;

  const stats = [
    { value: pdfCount.toString(), label: "PDFs Uploaded" },

  ];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto">
      {/* Hero Section */}
      <div className="p-8">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-4">Your AI Study Assistant</h2>
              <p className="text-purple-100 text-lg mb-6 max-w-xl">
                Upload your PDFs and get instant, accurate answers from multiple documents.
              </p>
              
            </div>
            <div className="text-8xl">📚🤖</div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💬</div>
            <div>
              <p className="text-gray-700 italic mb-3">
                "StudyMate AI helped me understand complex topics in minutes!"
              </p>
              <p className="text-sm text-purple-600 font-medium">- Student</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
