// ChatInput.js
import React, { useState } from 'react';
import { BiSend } from 'react-icons/bi';
import { MdIceSkating } from 'react-icons/md';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <MdIceSkating className="w-5 h-5" />
        </button>
        <button
          onClick={handleSend}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <BiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;