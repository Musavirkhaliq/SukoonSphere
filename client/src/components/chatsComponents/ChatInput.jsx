import React, { useState, useRef, useEffect } from "react";
import { BiSend } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { IoAttach } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

const FilePreview = ({ file, onRemove }) => (
  <div className="relative inline-block">
    <div className="relative group border rounded-lg p-2 m-1">
      <button
        onClick={() => onRemove(file)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
      >
        <IoClose className="w-3 h-3" />
      </button>
      {file.type.startsWith('image/') ? (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="h-16 w-16 object-cover rounded"
        />
      ) : (
        <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-xs text-gray-500 text-center break-all">
            {file.name.slice(0, 20)}
          </span>
        </div>
      )}
    </div>
  </div>
);

const ChatInput = ({ chatId, fetchChatMessages }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [files, setFiles] = useState([]);
  const emojiRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    if (emoji && emoji.emoji) {
      setContent((prev) => prev + emoji.emoji);
      inputRef.current.focus();
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }
    setFiles(prev => [...prev, ...selectedFiles]);
    fileInputRef.current.value = ''; // Reset file input
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content.trim() || "Attachment");
      formData.append("chatId", chatId);
      
      files.forEach(file => {
        formData.append("files", file);
      });

      await customFetch.post("/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setFiles([]);
      fetchChatMessages();
    } catch (error) {
      toast.error("Failed to send message");
    }
    setLoading(false);
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
    <div className="fixed md:relative bottom-0 bg-white w-full border-t border-gray-200">
      {files.length > 0 && (
        <div className="p-2 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
          {files.map((file, index) => (
            <FilePreview key={index} file={file} onRemove={removeFile} />
          ))}
        </div>
      )}
      
      <div className="p-4 flex items-center gap-2 sm:gap-4 justify-between">
        <button 
          onClick={() => setShowPicker((prev) => !prev)} 
          className="relative" 
          ref={emojiRef}
        >
          <BsEmojiSmile size={24} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />
        
        <button 
          onClick={() => fileInputRef.current.click()}
          className="text-gray-600 hover:text-gray-800"
        >
          <IoAttach size={24} />
        </button>

        {showPicker && (
          <div
            ref={emojiRef}
            className="absolute bottom-20 left-0 w-full md:w-96 bg-white shadow-sm rounded-t-lg overflow-hidden"
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
          className="p-2 bg-blue-600 text-white rounded-full"
          disabled={loading}
        >
          <BiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;