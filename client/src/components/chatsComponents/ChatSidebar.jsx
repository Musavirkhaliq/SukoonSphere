import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import socket from "@/utils/socket/socket";
import { debounce } from "lodash"; // Import debounce
import timeAgo from "@/utils/convertTime";

const ChatSidebar = ({ onClose }) => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Store search input
  const { id } = useParams();
  const [morepeople, setMorePeople] = useState([]);
  const navigate = useNavigate();

  // Function to fetch chats
  const fetchChats = async (search = "") => {
    try {
      const { data } = await customFetch.get("/chats", {
        params: { search }, // Send search query
      });
      setChats(data.chats);
      setMorePeople(data.users);
      console.log({ data });
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };
  const handlePersonClick = async (personId) => {
    try {
      const { data } = await customFetch.post(`chats`,{_userId:personId});
      navigate(`/chats/${data._id}`);
      setSearchTerm("");
      fetchChats();

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.msg || "Failed to send message");
    }
  };
  // Debounced search function
  const debouncedFetchChats = useCallback(debounce(fetchChats, 500), []);

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch chats when new message is received
  useEffect(() => {
    const handleNewMessage = () => fetchChats(searchTerm);
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [searchTerm]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchChats(value); // Call debounced function
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-3 bg-emerald-50 dark:bg-gray-800 border-b">
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
                <span className="text-white font-medium">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
            )}
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">{user?.name}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">Online</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-600 dark:text-gray-400 lg:hidden">
            ✖
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={handleSearchChange} // Handle input change
            className="w-full py-2 px-4 pl-10 bg-gray-100 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-center text-gray-500 p-4">No chats found</p>
        ) : (
          chats.map((chat) => {
            const person = chat.participants.find((p) => p._id !== user._id);
            const isActive = chat._id === id;
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
                  {person?.avatar ? (
                    <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">{person?.name?.[0]?.toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex justify-between">
                    <span className="font-medium truncate">{person?.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(chat.updatedAt)}</span>
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
          })
        )}
        {morepeople.length > 0 && (
          <div className="p-3">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">More People</h2>
            {morepeople.map((person) => (
              <Link
                key={person._id}
                onClick={() => handlePersonClick(person._id)}
                className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="relative flex-shrink-0 mr-3">
                  {person?.avatar ? (
                    <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">{person?.name?.[0]?.toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <span className="font-medium truncate">{person?.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        
      </div>
      <div>
      </div>
    </div>
  );
};

export default ChatSidebar;
