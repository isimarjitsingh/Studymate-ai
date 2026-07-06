const Documents = ({ uploadedFiles, uploadStatus }) => {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Documents</h2>
      
      {/* Upload Status Message */}
      {uploadStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <p className="text-green-700 font-medium">PDF uploaded successfully</p>
        </div>
      )}
      
      {uploadStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <span className="text-2xl">❌</span>
          <p className="text-red-700 font-medium">No PDF received</p>
        </div>
      )}
      
      {uploadedFiles && uploadedFiles.length > 0 ? (
        <div className="space-y-3">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-500 text-2xl">
                  📄
                </div>
                <div>
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Uploaded</span>
                <span className="text-green-500 text-xl">✓</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <p className="text-gray-500 text-lg">No documents uploaded yet</p>
          <p className="text-gray-400 text-sm mt-2">Click "Upload PDF(s)" to get started</p>
        </div>
      )}
    </div>
  );
};

export default Documents;
