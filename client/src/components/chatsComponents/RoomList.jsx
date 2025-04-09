import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FaUsers, FaUserPlus, FaSpinner } from "react-icons/fa";

const RoomList = ({ room, isActive, isPublic, onJoin, onClose }) => {
  const [isJoining, setIsJoining] = useState(false);
  // Format the last message time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a");
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else if (now.getFullYear() === date.getFullYear()) {
      return format(date, "MMM d");
    } else {
      return format(date, "MM/dd/yy");
    }
  };

  // Handle joining a room
  const handleJoin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsJoining(true);
    try {
      await onJoin(room._id);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Link
      to={isPublic ? "#" : `/chats/room/${room._id}`}
      onClick={(e) => {
        if (isPublic) {
          e.preventDefault();
        } else {
          onClose?.();
        }
      }}
      className={`flex items-center p-3 hover:bg-gray-50 transition-colors duration-200 border-b ${
        isActive ? "bg-blue-50" : ""
      }`}
    >
      {/* Room Image */}
      <div className="relative mr-3 flex-shrink-0">
        {room?.image ? (
          <img
            src={room.image}
            alt={room.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-medium text-lg">
              {room?.name?.[0]?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Room Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 truncate">{room?.name}</h3>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatTime(room?.lastMessageTime || room?.updatedAt)}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <div className="flex-1 text-gray-500 truncate">
            {room?.lastMessage ? (
              <span>
                <span className="font-medium mr-1">
                  {room?.lastMessageSender?.name === room?.createdBy?.name
                    ? "Admin"
                    : room?.lastMessageSender?.name}:
                </span>
                {room?.lastMessage}
              </span>
            ) : (
              <span className="italic">No messages yet</span>
            )}
          </div>
        </div>

        <div className="flex items-center mt-1">
          <div className="flex items-center text-xs text-gray-500">
            <FaUsers className="mr-1" size={10} />
            <span>{room?.members?.length || 0} members</span>
          </div>

          {isPublic && (
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className={`ml-auto text-xs flex items-center px-2 py-1 rounded ${isJoining
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {isJoining ? (
                <>
                  <FaSpinner className="mr-1 animate-spin" size={10} />
                  Requesting...
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-1" size={10} />
                  Request to Join
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RoomList;
