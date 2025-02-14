// ChatInput.js
import customFetch from "@/utils/customFetch";
import React, { useState } from "react";
import { BiSend } from "react-icons/bi";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
const ChatInput = ({ chatId,fetchChatMessages }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const handleEmojiClick = (emojiObject) => {
    setContent((prev) => prev + emojiObject.emoji);
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
        fetchChatMessages()
      } catch (error) {
        toast.error("something went wrong");
      }
      setLoading(false);
    }
  };

  return (
    <div className=" bottom-0 bg-white w-full p-4 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2 w-full">
        <textarea
          type="text"
          rows={1}
          resize="none"
          style={{ resize: "none" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="bg-gray-50 flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          EMOJI
        </button>
      </div>
      <button
        onClick={handleSend}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        disabled={loading}
      >
        <BiSend className="w-5 h-5" />
      </button>
      <button onClick={() => setShowPicker((prev) => !prev)}>😊</button>

      {showPicker && (
        <div style={{ position: "absolute", marginTop: "10px", top: "100%", left: "0" }}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default ChatInput;
