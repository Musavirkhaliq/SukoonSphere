import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import socket from "@/utils/socket/socket";
import { format } from "date-fns";
import timeAgo from "@/utils/convertTime";

const ChatSidebar = ({ onClose }) => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const { id } = useParams();

  const fetchChats = async () => {
    try {
      const { data } = await customFetch.get("/chats");
      setChats(data.chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleChatClick = (chat) => () => {
    onClose?.();
    if (chat.totalUnreadMessages > 0) {
      setChats(
        chats.map((c) =>
          c._id === chat._id ? { ...c, totalUnreadMessages: 0 } : c
        )
      );
    }
  };

  const handleNewMessage = () => {
    fetchChats();
  };

  useEffect(() => {
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  // Helper function to format the timestamp
  const getLastMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return format(date, "HH:mm");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-3 bg-emerald-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-white">
                {user?.name}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                Online
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              aria-label="New chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="p-3 bg-white dark:bg-gray-900">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full py-2 px-4 pl-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="space-y-0.5">
          {chats?.map((chat) => {
            const person = chat.participants.find(
              (participant) => participant._id !== user._id
            );
            const isActive = chat._id === id;

            return (
              <Link
                key={chat._id}
                to={`/chats/${chat._id}`}
                onClick={handleChatClick(chat)}
                className={`flex items-center px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  isActive ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
                }`}
              >
                <div className="relative flex-shrink-0 mr-3">
                  {person?.avatar ? (
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {person?.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-gray-900 dark:text-white truncate">
                      {person?.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {timeAgo(chat.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[70%]">
                      {chat.lastMessage || "No messages yet"}
                    </p>
                    {chat.totalUnreadMessages > 0 && !isActive && (
                      <span className="ml-auto flex-shrink-0 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                        {chat.totalUnreadMessages}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
