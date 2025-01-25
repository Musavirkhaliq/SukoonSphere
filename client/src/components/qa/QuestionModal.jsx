import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaTimes } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import { useNavigate } from "react-router-dom";
const QuestionModal = ({ isOpen, onClose, refetchQuestions }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [context, setContext] = useState("");
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleCancel = (e) => {
    e.preventDefault();
    setTags([]);
    setTagInput("");
    setQuestionText("");
    setContext("");
    onClose();
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!questionText.trim()) {
      toast.error("Please enter your question");
      return;
    }

    try {
      setIsSubmitting(true);
      await customFetch.post("/qa-section/", {
        questionText,
        context,
        tags,
      });

      toast.success("Question posted successfully!");
      navigate("/answer");
      if (refetchQuestions) {
        refetchQuestions();
      }
      handleCancel(e);
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error(error.response?.data?.msg || "Failed to post question");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm px-2 ">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl scale-100 ">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 sticky top-0 bg-white pt-2">
          Ask a Question
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Your Question"
              className="input w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-200  focus:ring-2 focus:ring-[var(--primary)]  transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="More Details"
              rows="3"
              className="textarea w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-200  focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-800"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag"
                className="flex-1 p-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaPlus size={12} />
              </button>
            </div>
            <p className="text-sm text-gray-500 italic mt-1">
              Add relevant tags to help others find your question
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 sticky bottom-0 bg-white pb-2">
            <button type="button" onClick={handleCancel} className="btn-red">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-2 disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Add Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
