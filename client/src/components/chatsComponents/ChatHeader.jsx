import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import DeleteModal from '../shared/DeleteModal';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';

const ChatHeader = ({ activeUser, onMenuClick ,totalMessages,setMessages }) => {
  const {id:chatId} = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting,setDeleting] = useState(false);

  const deleteAllMessages = async() => {
    try {
      setDeleting(true);
      await customFetch.delete(`/messages/delete-all-by-chat-id/${chatId}`);
      toast.success("All messages deleted successfully");
      setMessages([])
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete messages");
    }
    finally{
      setDeleting(false);
    }
  }
  return (
   <> <div className="px-4 py-3 flex items-center justify-between bg-white">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {activeUser?.avatar ? (
            <img
              src={activeUser.avatar || "/placeholder.svg"}
              alt={activeUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                {activeUser?.name?.[0]}
              </span>
            </div>
          )}
          {activeUser?.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <h4>{activeUser?.name}</h4>
    
      </div>
      <div>
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    {totalMessages > 0 &&  <button 
        onClick={() => setShowDeleteModal(true)}
        className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <MdDelete className="w-6 h-6 hover:text-red-600" />
      </button>}
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