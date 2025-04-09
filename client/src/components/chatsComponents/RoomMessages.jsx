import React, { useEffect, useRef, useState } from "react";
import { format } from 'date-fns';
import { FaTrash } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import DeleteModal from "../shared/DeleteModal";
import MessageContent from "./MessageContent";

const RoomMessages = ({ user, messages, setMessages, roomId, isAdmin }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = {
          date,
          displayDate: formatDisplayDate(message.createdAt),
          messages: [],
        };
      }
      groups[date].messages.push(message);
    });

    return Object.values(groups);
  };

  // Format date for display
  const formatDisplayDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;

    try {
      setDeleting(true);
      await customFetch.delete(`/room-messages/${roomId}/messages/${selectedMessage._id}`);

      // Remove message from state
      setMessages((prev) => prev.filter((msg) => msg._id !== selectedMessage._id));

      toast.success("Message deleted successfully");
      setShowDeleteModal(false);
      setContextMenu(null);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(error.response?.data?.message || "Failed to delete message");
    } finally {
      setDeleting(false);
    }
  };

  // Check if a message should show sender info
  const shouldShowSenderInfo = (messages, index) => {
    if (index === 0) return true;

    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];

    // Show sender info if sender changed or if messages are more than 5 minutes apart
    return (
      currentMessage.sender._id !== previousMessage.sender._id ||
      new Date(currentMessage.createdAt) - new Date(previousMessage.createdAt) > 5 * 60 * 1000
    );
  };

  // If no messages, show empty state
  if (!messages?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 text-center p-6 bg-white rounded-lg shadow-sm">
          <p className="text-lg">No messages yet</p>
          <p className="text-sm mt-2">Start the conversation by sending a message</p>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div
      ref={chatContainerRef}
      className="relative flex flex-col p-2 sm:p-4 gap-2 overflow-y-auto h-full pb-20 lg:pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 text-black"
    >
      {groupedMessages.map(({ date, messages: dateMessages, displayDate }) => (
        <div key={date} className="flex flex-col gap-2">
          <div className="sticky top-0 flex justify-center my-2">
            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
              {displayDate}
            </div>
          </div>

          {dateMessages.map((message, index) => {
            const isOwnMessage = user?._id === message?.sender?._id;
            const showSenderInfo = shouldShowSenderInfo(dateMessages, index);

            return (
              <div
                key={message._id || index}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setContextMenu(message._id);
                  setSelectedMessage(message);
                }}
                className={`relative flex ${showSenderInfo ? 'mt-3' : 'mt-1'} ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                {!isOwnMessage && showSenderInfo && (
                  message?.sender?.avatar ? (
                    <img
                      src={message?.sender?.avatar}
                      alt="avatar"
                      className="w-8 h-8 object-cover md:w-9 md:h-9 self-start bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2 mt-1"
                    />
                  ) : (
                    <div className="w-8 h-8 md:w-9 md:h-9 self-start bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2 mt-1">
                      {message?.sender?.name?.charAt(0)}
                    </div>
                  )
                )}

                {!isOwnMessage && !showSenderInfo && (
                  <div className="w-8 h-8 md:w-9 md:h-9 mr-2 flex-shrink-0"></div>
                )}

                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  {showSenderInfo && !isOwnMessage && (
                    <span className="text-xs text-gray-500 ml-2 mb-1">
                      {message?.sender?.name}
                    </span>
                  )}

                  <MessageContent message={message} isOwnMessage={isOwnMessage} />
                </div>

                {contextMenu === message._id && (
                  <div
                    className="absolute right-0 top-0 mt-2 bg-white border border-gray-200 text-black p-2 rounded-md shadow-lg z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="text-red-500 text-sm hover:bg-gray-100 py-1 px-2 rounded flex items-center gap-2 w-full"
                    >
                      <FaTrash size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Invisible element for auto-scrolling */}
      <div ref={messagesEndRef} />

      {/* Delete confirmation modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setContextMenu(null);
        }}
        onDelete={handleDeleteMessage}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        itemType="message"
        isLoading={deleting}
      />
    </div>
  );
};

export default RoomMessages;
