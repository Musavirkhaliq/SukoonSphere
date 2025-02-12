// ChatHeader.js
import React from 'react';
import { FiPhone, FiVideo, FiMoreHorizontal } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';

const ChatHeader = ({ activeUser }) => {
  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div>
          <h2 className="font-semibold">{activeUser.name}</h2>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <FiPhone className="w-5 h-5 text-gray-500 cursor-pointer" />
        <FiVideo className="w-5 h-5 text-gray-500 cursor-pointer" />
        <FiMoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>
    </div>
  );
};
export default ChatHeader;
