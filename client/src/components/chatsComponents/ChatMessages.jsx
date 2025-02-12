// ChatMessages.js
import React from 'react';
import { FaPlay } from 'react-icons/fa';

const ChatMessages = ({ messages }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start ${
              message.isSent ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.type === 'audio' ? (
              <div className="bg-gray-800 text-white rounded-lg p-4 w-48 h-48 flex items-center justify-center">
                <div className="text-center">
                  <FaPlay className="w-8 h-8 mx-auto mb-2" />
                  <span>{message.duration}</span>
                </div>
              </div>
            ) : (
              <div
                className={`${
                  message.isSent
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-black'
                } rounded-lg p-3 max-w-md`}
              >
                <p>{message.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;