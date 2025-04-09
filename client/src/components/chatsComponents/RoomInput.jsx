import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSmile, FaImage, FaFile } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@/context/UserContext";

const RoomInput = ({ roomId, fetchRoomMessages }) => {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);

  // Handle clicking outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    textareaRef.current.focus();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > 5) {
      toast.error("You can only upload up to 5 files at once");
      return;
    }
    
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      toast.error("Total file size should not exceed 10MB");
      return;
    }
    
    setFiles(selectedFiles);
    
    // Create previews for images
    const previews = selectedFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return {
          type: "image",
          url: URL.createObjectURL(file),
          name: file.name,
        };
      } else {
        return {
          type: "file",
          name: file.name,
          size: file.size,
        };
      }
    });
    
    setFilePreview(previews);
  };

  // Remove a file from the selection
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((!message.trim() && files.length === 0) || sending) {
      return;
    }
    
    setSending(true);
    
    try {
      const formData = new FormData();
      formData.append("content", message.trim());
      
      files.forEach((file) => {
        formData.append("files", file);
      });
      
      await customFetch.post(`/room-messages/${roomId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setMessage("");
      setFiles([]);
      setFilePreview([]);
      fetchRoomMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-3 border-t">
      {/* File previews */}
      {filePreview.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
          {filePreview.map((file, index) => (
            <div
              key={index}
              className="relative bg-white p-2 rounded border flex items-center"
            >
              {file.type === "image" ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded mr-2"
                />
              ) : (
                <FaFile className="w-10 h-10 text-gray-400 mr-2" />
              )}
              <div className="max-w-[100px] overflow-hidden">
                <p className="text-xs truncate">{file.name}</p>
                {file.type === "file" && (
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              <button
                onClick={() => removeFile(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end">
        {/* Emoji picker */}
        <div className="relative mr-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <FaSmile />
          </button>
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-12 left-0 z-10"
            >
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        {/* File upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 mr-2"
        >
          <FaImage />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          />
        </button>

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full py-2 px-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={(!message.trim() && files.length === 0) || sending}
          className={`ml-2 p-2 rounded-full ${
            (!message.trim() && files.length === 0) || sending
              ? "bg-gray-200 text-gray-400"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {sending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </form>
    </div>
  );
};

export default RoomInput;
