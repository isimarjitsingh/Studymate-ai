import FileUpload from "../components/FileUpload";
import ChatBox from "../components/ChatBox";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-5xl font-bold text-center">
          StudyMate AI
        </h1>

        <p className="text-center text-gray-400 mt-3">
          Chat with Multiple PDFs
        </p>

        <FileUpload />

        <ChatBox />

      </div>

    </div>
  );
};

export default Home;