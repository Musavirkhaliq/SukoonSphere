import React from 'react';
import logo from '../../assets/images/SukoonSphere_Logo.png';

const DefaultChat = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full ">
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
      </div>
    </div>
  );
};

export default DefaultChat;