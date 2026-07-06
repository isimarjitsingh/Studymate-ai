import { useState } from "react";
import axios from "axios";

const FileUpload = ({ onClose, onUploadSuccess, onUploadError }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select PDFs first");
      onUploadError();
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      console.log(response.data);

      alert("PDFs uploaded successfully!");
      onUploadSuccess(files);
      setFiles([]);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
      onUploadError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition cursor-pointer">
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFiles}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="text-5xl mb-4">📁</div>
          <p className="text-gray-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-400">PDF files only</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <span className="text-green-500">✓</span>
              <span className="text-gray-700 flex-1 truncate">{file.name}</span>
              <span className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={loading || files.length === 0}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload PDFs"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;