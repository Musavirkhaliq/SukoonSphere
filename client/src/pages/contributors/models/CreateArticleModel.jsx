import { useState } from "react";
import { toast } from "react-toastify";
import { FaFilePdf, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import customFetch from "../../../utils/customFetch";

const CreateArticleModel = ({ setShowModal, onArticleCreated }) => {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfPreview({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please enter a title");
      return;
    }
    if (!pdfFile) {
      toast.error("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("pdf", pdfFile);

    try {
      const response = await customFetch.post("/articles/upload-pdf", formData);
      toast.success("Article created successfully!");
      setShowModal(false);
      // Call the callback to refresh articles
      if (onArticleCreated) {
        onArticleCreated();
      }
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error(error?.response?.data?.error || "Error creating article");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-10">
      <div className="bg-[var(--body)] rounded-2xl p-8 w-[500px] shadow-2xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-4xl">
        <h1 className="h2 sm:text-lg md:text-3xl lg:4xl font-bold text-[var(--primary)] text-center flex items-center justify-center gap-2">
          <FaFilePdf className="text-primary" />
          Upload and Publish Your Article
        </h1>
        <p className="text-sm text-[var(--grey--700)] mb-6 text-center ">
          Upload a PDF document to convert it into an interactive flipbook. Once
          published, no further edits can be made. Ensure your content is
          finalized before submission.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Enter article title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300 placeholder-ternary"
          />
          <div className="relative">
            <label className="block mb-2 text-[var(--black)] text-sm font-medium">
              Upload PDF File
            </label>
            <input
              type="file"
              name="pdf"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {pdfPreview && (
              <div className="mt-3 p-3 bg-light border border-primary rounded-lg shadow-sm flex items-center gap-3">
                <FaCheckCircle className="text-primary text-lg" />
                <div>
                  <p className="text-sm text-[var(--primary]">
                    <strong>File:</strong> {pdfPreview.name}
                  </p>
                  <p className="text-sm text-ternary">
                    <strong>Size:</strong> {pdfPreview.size}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="btn-2 flex items-center justify-center gap-2"
            >
              <FaCheckCircle />
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-red flex items-center justify-center gap-2"
            >
              <FaTimesCircle />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticleModel;
