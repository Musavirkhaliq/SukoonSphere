import React from "react";
import { FaTimes } from "react-icons/fa";
import ArticleComments from "./ArticleComments";

const CommentPopup = ({ isOpen, onClose, articleId }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300 custom-scrollbar  ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 left-0 w-full sm:w-[450px] h-screen bg-white z-[80] transform transition-transform duration-300 ease-in-out custom-scrollbar ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Comments</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close comments"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Comments content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-4">
              <ArticleComments articleId={articleId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentPopup;
