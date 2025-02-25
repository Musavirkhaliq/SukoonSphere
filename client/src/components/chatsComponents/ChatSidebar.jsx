import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import socket from "@/utils/socket/socket";
import { debounce } from "lodash"; // Import debounce

import ChatList from "./ChatList";
import SearchChatPersons from "./SearchChatPersons";

const ChatSidebar = ({ onClose }) => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const [searchChatResults, setSearchChatResults] = useState([]);
  const navigate = useNavigate();

  // Function to fetch chats
  const fetchChats = async (search = "") => {
    try {
      const { data } = await customFetch.get("/chats", {
        params: { search },
      });
      setChats(data.chats);
      setSearchChatResults(data.users);
      console.log({ data });
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };
  const handlePersonClick = async (personId) => {
    try {
      const { data } = await customFetch.post(`chats`, { _userId: personId });
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
    debouncedFetchChats(value);
  };

  const handleClear = () => {
    // Create a synthetic event object similar to what onChange would receive
    const event = { target: { value: "" } };
    handleSearchChange(event);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-3 bg-emerald-50 dark:bg-gray-800 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "Anonymous"
                )}&background=random`
              }
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
            />
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-2 px-4 pl-10 bg-gray-100 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2"
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
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4"
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
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-center text-gray-500 p-4">No chats found</p>
        ) : (
          chats?.map((chat) => {
            const person = chat?.participants?.find(
              (p) => p?._id !== user?._id
            );
            // const isActive = chat._id === id;
            return (
              <ChatList
                user={user}
                person={person}
                key={chat?._id}
                chat={chat}
                isActive={chat?._id === id}
                onClose={onClose}
              />
            );
          })
        )}
        {searchChatResults?.length > 0 && (
          <div className="p-3">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Chats
            </h2>
            {searchChatResults?.map((person) => (
              <SearchChatPersons
                key={person?._id}
                person={person}
                handlePersonClick={handlePersonClick}
              />
            ))}
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default ChatSidebar;
