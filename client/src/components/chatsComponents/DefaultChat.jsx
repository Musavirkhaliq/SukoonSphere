import React from 'react';
import logo from '../../assets/images/SukoonSphere_Logo.png';
import { FaComments, FaLock } from 'react-icons/fa';
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


        {/* Description */}
        <div className="text-center max-w-md mx-auto px-4 py-6 bg-white rounded-lg ">
          <div className="flex justify-center mb-4">
            <FaLock className="text-[var(--primary)] text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Secure & Connected
          </h3>
          <p className="text-gray-600 mb-2">
            Your personal messages are end-to-end encrypted, ensuring privacy and security.
          </p>
          <p className="text-gray-600">
            Join your personal community to connect, share, and collaborate seamlessly.
          </p>
        </div>

        {/* Show Chats Button (visible only on mobile) */}
        <button
          onClick={toggleSidebar}
          className="btn-2 mt-8  lg:hidden flex gap-2 !py-4 !px-8 "
        >
          <FaComments size={20} />
          <span className='text-base'>Show Chats</span>
        </button>
      </div>
    </div>
  );
};

export default DefaultChat;