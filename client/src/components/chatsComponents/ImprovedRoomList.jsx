import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format, isToday, isYesterday } from "date-fns";
import {
  FaUsers, FaMicrophone, FaPaperclip, FaImage,
  FaLock, FaGlobe, FaUserPlus, FaSpinner, FaEllipsisH,
  FaInfoCircle, FaSignOutAlt, FaUserCog
} from "react-icons/fa";

const ImprovedRoomList = ({ room, isActive, onClose, isPublic = false, onJoin }) => {
  // Return null if room is undefined
  if (!room || !room._id) {
    return null;
  }
  const [isJoining, setIsJoining] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Format time for last message
  const getFormattedTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };

  // Get appropriate icon for message type
  const getMessageIcon = (message) => {
    if (!message) return null;

    if (message.includes('🎤') || message.includes('voice message')) {
      return <FaMicrophone className="mr-1 text-blue-500 flex-shrink-0" size={12} />;
    } else if (message.includes('image') || message.includes('photo')) {
      return <FaImage className="mr-1 text-green-500 flex-shrink-0" size={12} />;
    } else if (message === 'Attachment' || message.includes('file')) {
      return <FaPaperclip className="mr-1 text-gray-500 flex-shrink-0" size={12} />;
    }

    return null;
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

  // For public rooms that the user hasn't joined yet
  if (isPublic) {
    return (
      <div className="flex items-center p-3 hover:bg-gray-50 transition-colors duration-200 border-b">
        {/* Room Image */}
        <div className="relative mr-3 flex-shrink-0">
          {room?.image ? (
            <img
              src={room.image}
              alt={room?.name || "Room"}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {room?.name?.[0]?.toUpperCase() || "R"}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full">
            <FaGlobe className="text-green-500" size={10} />
          </div>
        </div>

        {/* Room Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900 truncate">{room?.name || "Unnamed Room"}</h3>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {getFormattedTime(room?.updatedAt)}
            </span>
          </div>

          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center text-sm text-gray-600 truncate max-w-[80%]">
              <FaUsers className="mr-1 text-gray-500" size={12} />
              <span className="text-gray-500 truncate">
                {room?.members?.length || 0} members
              </span>
            </div>

            <button
              onClick={handleJoin}
              disabled={isJoining}
              className={`px-2 py-1 text-xs rounded-full flex items-center ${
                isJoining
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isJoining ? (
                <>
                  <FaSpinner className="mr-1 animate-spin" size={10} />
                  <span>Requesting...</span>
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-1" size={10} />
                  <span>Request to Join</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Link
        to={`/chats/room/${room._id}`}
        onClick={onClose}
        className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b ${
          isActive ? "bg-blue-50" : ""
        }`}
      >
        <div className="relative flex-shrink-0 mr-3">
          {room?.image ? (
            <img
              src={room.image}
              alt={room?.name || "Room"}
              className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-medium text-lg">
                {room?.name?.[0]?.toUpperCase() || "R"}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full">
            {room?.isPublic ? (
              <FaGlobe className="text-green-500" size={10} />
            ) : (
              <FaLock className="text-gray-500" size={10} />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900 truncate">{room?.name || "Unnamed Room"}</h3>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {getFormattedTime(room?.lastMessageTime || room?.updatedAt)}
              </span>
              <button
                className="ml-2 text-gray-400 hover:text-gray-600 p-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                <FaEllipsisH size={12} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center text-sm text-gray-600 truncate max-w-[80%]">
              {getMessageIcon(room?.lastMessage)}
              {room?.lastMessageSender ? (
                <span className="truncate">
                  <span className="font-medium mr-1">
                    {room?.lastMessageSender?._id === room?.createdBy?._id
                      ? `${room?.lastMessageSender?.name || 'User'} (Admin):`
                      : `${room?.lastMessageSender?.name || 'User'}:`}
                  </span>
                  <span className="text-gray-500">{room?.lastMessage || ""}</span>
                </span>
              ) : (
                <span className="truncate text-gray-500 italic">{room?.lastMessage || "No messages yet"}</span>
              )}
            </div>

            <div className="flex items-center">
              <FaUsers className="text-gray-400 mr-1" size={12} />
              <span className="text-xs text-gray-500">{room?.members?.length || 0}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-2 top-12 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                // Implement room info view
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FaInfoCircle className="mr-2 text-blue-500" /> Room Info
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                // Implement member management
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FaUserCog className="mr-2 text-blue-500" /> Manage Members
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                // Implement leave room functionality
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Leave Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedRoomList;
