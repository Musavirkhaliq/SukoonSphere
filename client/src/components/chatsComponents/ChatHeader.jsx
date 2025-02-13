import React from 'react';

const ChatHeader = ({ activeUser, onMenuClick }) => {
  return (
    <div className="px-4 py-3 flex items-center justify-between bg-white">
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
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
    
      </div>

    </div>
  );
};

export default ChatHeader;