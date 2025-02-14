// ChatInput.js
import customFetch from "@/utils/customFetch";
import React, { useState, useRef, useEffect } from "react";
import { BiSend } from "react-icons/bi";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

const ChatInput = ({ chatId, fetchChatMessages }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const emojiRef = useRef(null);
  const inputRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    if (emoji && emoji.emoji) {
      setContent((prev) => prev + emoji.emoji);
      inputRef.current.focus();
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      setLoading(true);
      try {
        await customFetch.post("/messages", {
          content,
          chatId,
        });
        setContent("");
        fetchChatMessages();
      } catch (error) {
        toast.error("Something went wrong");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bottom-0 bg-white w-full p-4 border-t border-gray-200 flex items-center gap-2 sm:gap-4 justify-between relative">
      <button onClick={() => setShowPicker((prev) => !prev)} className="relative" ref={emojiRef}>
        <BsEmojiSmile size={24} />
      </button>

      {showPicker && (
        <div
          ref={emojiRef}
          className="absolute bottom-20 left-0 w-full md:w-96  bg-white shadow-sm rounded-t-lg overflow-hidden"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" height={400} />
        </div>
      )}

      <div className="flex items-center w-full">
        <textarea
          ref={inputRef}
          rows={1}
          style={{ resize: "none" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="bg-gray-50 flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
        />
      </div>
      <button
        onClick={handleSend}
        className="p-1 sm:p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        disabled={loading}
      >
        <BiSend className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatInput;
