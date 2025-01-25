import { useUser } from "@/context/UserContext";
import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import { FaReply, FaPaperPlane } from "react-icons/fa";

const ContentEditor = ({
  content,
  setContent,
  onSave,
  onCancel,
  isLoading = false,
  rows = "1",
  buttonSize = "sm",
  type = "comment"
}) => {
  const { user } = useUser();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const handleSubmit = () => {
    if (!user) {
      setShowLoginMessage(true);
      return;
    }
    onSave();
  };

  return (
    <div className="my-2">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 sm:p-3 border-b text-sm bg-[var(--white-color)] focus:outline-none focus:border-blue-500 resize-none pr-12 transition-colors"
          rows={rows}
          placeholder={`Add a ${type}...`}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="absolute right-2 bottom-2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
        >
          {type === "reply" ? (
            <FaReply className="w-5 h-5" />
          ) : (
            <BsSend className="w-5 h-5 rotate-45 hover:text-blue-600 transition-colors" />
          )}
        </button>
      </div>

      {showLoginMessage && !user && (
        <div className="mt-2 text-sm text-red-500">
          Please login to {type}
        </div>
      )}

      {content && (
        <button
          onClick={onCancel}
          className={` mt-2 px-3 py-1 text-${buttonSize} text-[var(--red--700)] hover:text-[var(--red-hover)]`}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default ContentEditor;
