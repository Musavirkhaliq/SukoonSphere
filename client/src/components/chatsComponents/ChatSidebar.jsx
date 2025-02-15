import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';
import socket from '@/utils/socket/socket';

const ChatSidebar = ({ onClose }) => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const { id } = useParams();
  console.log({id})
  const fetchChats = async () => {
    try {
      const { data } = await customFetch.get('/chats');
      setChats(data.chats);

    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };
  
  useEffect(() => {
    fetchChats();
  }, []);

  const handleChatClick = (chat) => () => {
    onClose?.();
    if (chat.totalUnreadMessages > 0) {
      setChats(chats.map(c => c._id === chat._id ? { ...c, totalUnreadMessages: 0 } : c))
    }
  }
  const handleNewMessage = (message) => {
  fetchChats();
 
  };
  useEffect(() => {
    
    socket.on("newMessage", handleNewMessage);
  
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);
  

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {user?.avatar ? (
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-medium">
                  {user?.name?.[0]}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{user?.name}</span>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-3">
          {chats?.map((chat) => {
            const person = chat.participants.find(
              (participant) => participant._id !== user._id
            );

            return (
              <Link
                key={chat._id}
                to={`/chats/${chat._id}`}
                onClick={handleChatClick(chat)}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="relative flex-shrink-0">
                  {person?.avatar ? (
                    <img
                      src={person.avatar || "/placeholder.svg"}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-medium">
                        {person?.name?.[0]}
                      </span>
                    </div>
                  )}
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{person?.name}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {chat.lastMessage || 'No messages'}
                  </div>
                  {chat._id !== id && <div className="text-sm text-gray-500 truncate">
                    {`unread ${chat.totalUnreadMessages}`}
                  </div>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;