import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { RiUserFollowFill } from "react-icons/ri";
import customFetch from "@/utils/customFetch";

const NOTIFICATION_TYPES = {
  FOLLOWED: {
    icon: RiUserFollowFill,
    iconColor: "text-indigo-600",
    message: "has requested to chat",
  },
};

const NotificationItem = ({ item, type, link }) => {
  const config = NOTIFICATION_TYPES[type];
  const Icon = config.icon;
  const navigate = useNavigate();

  const getAvatarUrl = (user) => {
    return (
      user?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name || "Anonymous"
      )}&background=random`
    );
  };

  const enableChat = async (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
    
    try {
      await customFetch.patch(`/chats/accept-chat-request/${item.chatId}`);
      navigate(`/chats/${item.chatId}`);
    } catch (error) {
      console.error("Error enabling chat:", error);
    }
  };

  return (
    <Link
      to={link}
      className={`relative px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 transition-colors rounded-lg ${
        !item.seen ? "bg-blue-50" : ""
      }`}
    >
      {/* Avatar with badge */}
      <div className="flex-shrink-0 relative">
        <Link to={`/about/user/${item.createdBy._id}`} className="block">
          <img
            src={getAvatarUrl(item.createdBy)}
            alt={item.createdBy?.name || "User"}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </Link>
        <div className="absolute -bottom-1 -right-1 z-10 bg-white p-1 rounded-full shadow-sm">
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <Link 
            to={`/about/user/${item.createdBy._id}`}
            className="font-medium text-gray-900 hover:text-indigo-600 hover:underline transition-colors"
          >
            {item.createdBy?.name || "Anonymous"}
          </Link>
          <span className="text-gray-600 text-sm">{config.message}</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <IoCalendarOutline className="w-3.5 h-3.5 mr-1" />
          <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
        </div>
        
        {/* Action button */}
        {item.chatDisabled !== undefined && (
          <button
            onClick={enableChat}
            disabled={!item.chatDisabled}
            className={`mt-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              item.chatDisabled
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-default"
            }`}
          >
            {item.chatDisabled ? "Accept Request" : "Accepted"}
          </button>
        )}
      </div>
      
      {/* Unread indicator */}
      {!item.seen && (
        <div className="absolute right-3 top-3">
          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
        </div>
      )}
    </Link>
  );
};

export const RequestChatNotification = ({ item }) => (
  <NotificationItem
    item={item}
    type="FOLLOWED"
    link={`/about/user/${item.createdBy._id}`}
  />
);