import timeAgo from "@/utils/convertTime";
import React from "react";
import { Link } from "react-router-dom";

const ChatList = ({ chat, person, isActive, currentUserId, onClose }) => {
  console.log({ person });
  return (
    <Link
      key={chat._id}
      to={`/chats/${chat._id}`}
      onClick={onClose}
      className={`flex items-center px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        isActive ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
      }`}
    >
      <div className="relative flex-shrink-0 mr-3">
        <img
          src={
            person?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              person?.name || "Anonymous"
            )}&background=random`
          }
          alt={person.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex justify-between">
          <span className="font-medium truncate">{person?.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {timeAgo(chat.updatedAt)}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[70%]">
            {chat.lastMessage || "No messages yet"}
          </p>
          {chat.totalUnreadMessages > 0 && !isActive && (
            <span className="ml-auto w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
              {chat.totalUnreadMessages}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ChatList;
