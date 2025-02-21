import { useEffect, useRef, useState } from "react";
import MessageContent from "./MessageContent";
import customFetch from "@/utils/customFetch";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import DeleteModal from "../shared/DeleteModal";

const ChatMessages = ({ user, messages, setMessages }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current ) {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const deleteMessageById = async () => {
    if (!selectedMessage) return;
    setDeleting(true);
    try {
      const { _id, chatId } = selectedMessage;
      await customFetch.delete(`/messages/delete-message/${_id}/${chatId}`);
      toast.success("Message deleted successfully");
      setMessages((prev) => prev.filter((m) => m._id !== _id));
      setContextMenu(null); // Close delete menu
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!messages?.length)
    return <div className="text-gray-500 text-center p-4">No Messages</div>;

  return (
    <div ref={chatContainerRef} className="relative flex flex-col p-4 gap-2 overflow-y-scroll h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 text-white rounded-lg">
      {messages?.map((message, index) => {
        const isOwnMessage = user?._id === message?.sender?._id;

        return (
          <div
            key={index}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu(message._id);
              setSelectedMessage(message);
            }}
            className={`relative flex items-end ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            {!isOwnMessage && (
              message?.sender?.avatar ? (
                <img
                  src={message?.sender?.avatar}
                  alt="avatar"
                  className="w-8 h-8 object-cover md:w-9 md:h-9 self-start bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2"
                />
              ) : (
                <div className="w-9 h-9 self-start bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2">
                  {message?.sender?.name?.charAt(0)}
                </div>
              )
            )}

            <MessageContent message={message} isOwnMessage={isOwnMessage} />

            {contextMenu === message._id && (
              <div className="absolute right-0 mt-2 bg-gray-800 text-white p-2 rounded-md shadow-lg z-10">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-red-500 text-sm hover:underline flex items-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div ref={messagesEndRef} />
      
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteMessageById}
        title="Delete Message"
        itemType="message"
        isLoading={deleting}
        message="Are you sure you want to delete this message? This action cannot be undone."
      />
    </div>
  );
};

export default ChatMessages;
