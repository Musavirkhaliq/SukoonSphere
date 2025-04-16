import React, { useState } from 'react';
import { MdDelete, MdArrowBack, MdMoreVert } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteModal from '../shared/DeleteModal';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';

const ChatHeader = ({ activeUser, onMenuClick, totalMessages, setMessages, unreadCount = 0 }) => {
  const { id: chatId } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteAllMessages = async () => {
    try {
      setDeleting(true);
      await customFetch.delete(`/messages/delete-all-by-chat-id/${chatId}`);
      toast.success("All messages deleted successfully");
      setMessages([])
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete messages");
    }
    finally {
      setDeleting(false);
    }
  }


  return (
    <>
      <div className="px-4 py-3 flex items-center justify-between bg-white shadow-md">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Go back"
            >
            </button>

            <button
              onClick={onMenuClick}
              className=" text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center justify-center relative lg:hidden"
              aria-label="Open sidebar"
            >

              <MdArrowBack className="w-7 h-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative">
            {activeUser?.avatar ? (
              <img
                src={activeUser.avatar || "/placeholder.svg"}
                alt={activeUser.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                <span className="text-blue-600 font-medium">
                  {activeUser?.name?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
            {/* Don't show online indicator since we don't have real-time status tracking */}
          </div>

          <div className="flex flex-col">
            <h4 className="font-medium text-gray-800">{activeUser?.name}</h4>
            <span className="text-xs text-gray-500">
              {/* Show a generic status since we don't have real-time status tracking */}
              Active now
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="More options"
          >
            <MdMoreVert className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1">
              {totalMessages > 0 && (
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <MdDelete className="w-5 h-5" />
                  Delete all messages
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteAllMessages}
        title="Delete Chat"
        itemType="chat"
        isLoading={deleting}
        message="Are you sure you want to delete this chat? This action cannot be undone."
      />
    </>
  );
};

export default ChatHeader;