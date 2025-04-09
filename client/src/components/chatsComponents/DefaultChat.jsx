import React from 'react';
import logo from '../../assets/images/SukoonSphere_Logo.png';
import { FaComments } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

const DefaultChat = () => {
  // Get the toggleSidebar function from the outlet context
  const { toggleSidebar } = useOutletContext() || {};

  return (
    <div className="flex flex-col items-center justify-center w-full h-full default-chat">
      <div className="flex flex-col items-center justify-center flex-1">
        {/* Logo */}
        <div className="mb-6">
          <div className="w-60">
            <img src={logo} alt="logo" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-medium mb-4">SukoonSphere</h1>

        {/* Description */}
        <div className="text-center max-w-md px-4">
          <p className="mb-2">Send and receive wellness messages without keeping your phone online.</p>
        </div>

        {/* Show Chats Button (visible only on mobile) */}
        <button
          onClick={toggleSidebar}
          className="mt-8 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-md transition-colors duration-200 lg:hidden show-sidebar-btn"
        >
          <FaComments size={20} />
          <span>Show Chats</span>
        </button>
      </div>
    </div>
  );
};

export default DefaultChat;