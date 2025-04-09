import timeAgo from "@/utils/convertTime";
import React from "react";
import { Link } from "react-router-dom";
import { FaMicrophone, FaPaperclip, FaImage } from "react-icons/fa";
import { format } from 'date-fns';

const ChatList = ({ chat, person, isActive, user, onClose }) => {
  // Determine if the last message is from the current user
  const isLastMessageFromMe = chat.lastMessageSender === user?._id;

  // Check if the last message is a voice message or attachment
  const isVoiceMessage = chat.lastMessage?.includes('🎤 Voice message');
  const isAttachment = chat.lastMessage === 'Attachment';
  const isImage = chat.lastMessage?.includes('image') || chat.lastMessage?.includes('photo');

  // Format date for today's messages vs older messages
  const getFormattedTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'h:mm a'); // Today: show time only
    } else if (messageDate.getFullYear() === today.getFullYear()) {
      return format(messageDate, 'MMM d'); // This year: show month and day
    } else {
      return format(messageDate, 'MM/dd/yy'); // Different year: show date with year
    }
  };

  return (
    <Link
      key={chat._id}
      to={`/chats/${chat._id}`}
      onClick={onClose}
      className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
        isActive ? "bg-blue-50" : ""
      }`}
    >
      <div className="relative flex-shrink-0 mr-3">
        {person?.avatar ? (
          <img
            src={person.avatar}
            alt={person.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
            <span className="text-blue-600 font-medium text-lg">
              {person?.name?.[0]?.toUpperCase()}
            </span>
          </div>
        )}
        {/* Don't show online indicator for other users since we don't have real-time status */}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900 truncate">{person?.name}</span>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {getFormattedTime(chat.updatedAt)}
          </span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center text-sm text-gray-600 truncate max-w-[80%] group">
            {isLastMessageFromMe && (
              <span className="text-xs text-gray-400 mr-1 font-medium">You: </span>
            )}

            {isVoiceMessage ? (
              <span className="flex items-center text-gray-600">
                <FaMicrophone className="mr-1 text-blue-500 flex-shrink-0" size={12} />
                <span className="truncate">Voice message</span>
              </span>
            ) : isImage ? (
              <span className="flex items-center text-gray-600">
                <FaImage className="mr-1 text-green-500 flex-shrink-0" size={12} />
                <span className="truncate">Photo</span>
              </span>
            ) : isAttachment ? (
              <span className="flex items-center text-gray-600">
                <FaPaperclip className="mr-1 text-gray-500 flex-shrink-0" size={12} />
                <span className="truncate">Attachment</span>
              </span>
            ) : (
              <span className="truncate text-gray-500">{chat.lastMessage || "No messages yet"}</span>
            )}
          </div>

          {chat.hasUnreadMessages && !isLastMessageFromMe && !isActive && (
            <span className="ml-auto flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
              {chat.totalUnreadMessages > 0 ? (chat.totalUnreadMessages > 99 ? '99+' : chat.totalUnreadMessages) : '1'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ChatList;
