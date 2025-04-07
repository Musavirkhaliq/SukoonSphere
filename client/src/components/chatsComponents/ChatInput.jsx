import React, { useState, useRef, useEffect } from "react";
import { BiSend } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { IoAttach } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import VoiceRecorder from "./VoiceRecorder";
import "./VoiceRecorder.css";

const FilePreview = ({ file, onRemove }) => (
  <div className="relative inline-block">
    <div className="relative group border rounded-lg p-2 m-1 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        onClick={() => onRemove(file)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors duration-200"
        aria-label="Remove file"
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
          <span className="text-xs text-gray-500 text-center break-all px-1">
            {file.name.length > 15 ? `${file.name.slice(0, 15)}...` : file.name}
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
  const [isRecording, setIsRecording] = useState(false);
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
    if (e) e.preventDefault();
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
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
    setLoading(false);
  };

  // Handle sending voice message
  const handleSendVoice = async (audioFile) => {
    if (!audioFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", "Voice message");
      formData.append("chatId", chatId);
      formData.append("files", audioFile);

      await customFetch.post("/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsRecording(false);
      fetchChatMessages();
      return true;
    } catch (error) {
      console.error("Error sending voice message:", error);
      toast.error("Failed to send voice message");
      return false;
    } finally {
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

  // Auto-resize textarea as user types
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  return (
    <div className="fixed md:relative bottom-0 left-0 right-0 bg-white w-full border-t border-gray-200 shadow-lg md:shadow-none">
      {files.length > 0 && (
        <div className="p-2 border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {files.map((file, index) => (
            <FilePreview key={index} file={file} onRemove={removeFile} />
          ))}
        </div>
      )}

      {isRecording ? (
        <div className="p-4">
          <VoiceRecorder
            onSendVoice={handleSendVoice}
            onCancel={() => setIsRecording(false)}
          />
        </div>
      ) : (
        <div className="p-3 flex items-center gap-2 sm:gap-3 justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setShowPicker((prev) => !prev)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Add emoji"
              ref={emojiRef}
            >
              <BsEmojiSmile size={20} />
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
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Attach files"
            >
              <IoAttach size={20} />
            </button>

            <button
              onClick={() => setIsRecording(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Record voice message"
            >
              <FaMicrophone size={18} />
            </button>
          </div>

          {showPicker && (
            <div
              className="absolute bottom-20 left-0 w-full sm:w-96 bg-white shadow-lg rounded-t-lg overflow-hidden z-10 border border-gray-200"
            >
              <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium">Emojis</span>
                <button
                  onClick={() => setShowPicker(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={20} />
                </button>
              </div>
              <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" height={300} />
            </div>
          )}

          <div className="flex-1 mx-2">
            <textarea
              ref={inputRef}
              rows={1}
              style={{ resize: "none", maxHeight: "120px" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message..."
              className="bg-gray-50 w-full p-3 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          <button
            onClick={handleSend}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center min-w-[40px] min-h-[40px]"
            disabled={loading}
            title="Send message"
          >
            {loading ? <FaSpinner className="w-5 h-5 animate-spin" /> : <BiSend className="w-5 h-5" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;