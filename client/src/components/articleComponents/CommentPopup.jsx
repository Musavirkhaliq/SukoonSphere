import React from "react";
import { FaTimes } from "react-icons/fa";
import ArticleComments from "./ArticleComments";

const CommentPopup = ({ isOpen, onClose, articleId }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-[90] transition-opacity duration-300 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 animate-modalFadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white z-10 rounded-t-xl">
            <h2 className="text-xl font-bold text-gray-900">Comments</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close comments"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Scrollable Comments Section */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-white">
            <ArticleComments articleId={articleId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentPopup;
