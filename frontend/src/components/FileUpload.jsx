import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select PDFs first");
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
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 mt-10 p-6 rounded-2xl">
      <h2 className="text-2xl font-semibold">
        Upload PDFs
      </h2>

      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFiles}
        className="mt-4"
      />

      <div className="mt-5">
        {files.map((file, index) => (
          <p
            key={index}
            className="text-green-400"
          >
            ✓ {file.name}
          </p>
        ))}
      </div>

      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
      >
        {loading ? "Uploading..." : "Upload PDFs"}
      </button>
    </div>
  );
};

export default FileUpload;