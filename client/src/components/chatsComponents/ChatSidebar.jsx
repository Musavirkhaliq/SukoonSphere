// ChatSidebar.js
import React from 'react';
import { BiMessageRoundedDots } from 'react-icons/bi';

const ChatSidebar = ({ conversations, activeId, onSelectConversation }) => {
  return (
    <div className="w-80 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <h2 className="font-semibold">Messages</h2>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <BiMessageRoundedDots className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectConversation(chat.id)}
            className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
              chat.id === activeId ? 'bg-blue-50' : ''
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {chat.name.charAt(0)}
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="font-medium">{chat.name}</div>
              <div className="text-sm text-gray-500 truncate">{chat.message}</div>
            </div>
            {chat.unread && (
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ChatSidebar;