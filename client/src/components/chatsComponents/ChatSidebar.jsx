import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import socket from "@/utils/socket/socket";
import { debounce } from "lodash"; // Import debounce
import { FaEye, FaEyeSlash, FaFilter, FaUsers, FaComments, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import ChatList from "./ChatList";
import RoomList from "./RoomList";
import SearchChatPersons from "./SearchChatPersons";
import CreateRoomModal from "./CreateRoomModal";

const ChatSidebar = ({ onClose }) => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [publicRooms, setPublicRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const [searchChatResults, setSearchChatResults] = useState([]);
  const [showAllChats, setShowAllChats] = useState(true); // Toggle for showing all chats
  const [filteredChats, setFilteredChats] = useState([]); // Filtered chats based on toggle
  const [activeTab, setActiveTab] = useState("chats"); // "chats" or "rooms"
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const navigate = useNavigate();

  // Function to fetch chats
  const fetchChats = async (search = "") => {
    try {
      const { data } = await customFetch.get("/chats", {
        params: { search },
      });
      setChats(data.chats);

      // Apply filtering based on showAllChats toggle
      updateFilteredChats(data.chats);

      setSearchChatResults(data.users);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // Function to fetch rooms
  const fetchRooms = async () => {
    try {
      const { data } = await customFetch.get("/rooms");
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Function to fetch public rooms
  const fetchPublicRooms = async () => {
    try {
      const { data } = await customFetch.get("/rooms/public");
      setPublicRooms(data);
    } catch (error) {
      console.error("Error fetching public rooms:", error);
    }
  };

  // Handle joining a public room (send join request)
  const handleJoinRoom = async (roomId) => {
    try {
      const response = await customFetch.post(`/rooms/${roomId}/join`);
      fetchRooms();
      fetchPublicRooms();

      // Show success message
      toast.success(response.data.message || "Join request sent successfully");

      // Don't navigate to the room until the request is approved
      // navigate(`/chats/room/${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error(error.response?.data?.message || "Failed to send join request");
      throw error; // Re-throw to handle in the component
    }
  };

  // Update filtered chats when toggle changes
  const updateFilteredChats = useCallback((chatsList = chats) => {
    if (showAllChats) {
      setFilteredChats(chatsList);
    } else {
      // Only show chats with unread messages
      const unreadChats = chatsList.filter(chat => {
        // Check if the last message is unread and not from the current user
        const lastMessage = chat.lastMessage;
        const otherParticipant = chat.participants.find(p => p._id !== user?._id);
        return chat.hasUnreadMessages && lastMessage?.sender !== user?._id;
      });
      setFilteredChats(unreadChats);
    }
  }, [showAllChats, user?._id]);
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

  // Fetch data on mount
  useEffect(() => {
    fetchChats();
    fetchRooms();
    fetchPublicRooms();
  }, []);

  // Set active tab based on URL
  useEffect(() => {
    if (location.pathname.includes('/room/')) {
      setActiveTab('rooms');
    } else {
      setActiveTab('chats');
    }
  }, [location.pathname]);

  // Update filtered chats when toggle or chats change
  useEffect(() => {
    updateFilteredChats();
  }, [showAllChats, chats, updateFilteredChats]);

  // Fetch chats when new message is received or sent
  useEffect(() => {
    const handleMessageUpdate = () => fetchChats(searchTerm);

    // Listen for both new messages and sent messages
    socket.on("newMessage", handleMessageUpdate);
    socket.on("messageSent", handleMessageUpdate);

    return () => {
      socket.off("newMessage", handleMessageUpdate);
      socket.off("messageSent", handleMessageUpdate);
    };
  }, [searchTerm]);

  // Listen for room updates
  useEffect(() => {
    const handleRoomUpdate = () => {
      fetchRooms();
      fetchPublicRooms();
    };

    socket.on("roomUpdated", handleRoomUpdate);
    socket.on("roomMemberJoined", handleRoomUpdate);
    socket.on("roomMemberLeft", handleRoomUpdate);
    socket.on("roomDeleted", handleRoomUpdate);

    return () => {
      socket.off("roomUpdated", handleRoomUpdate);
      socket.off("roomMemberJoined", handleRoomUpdate);
      socket.off("roomMemberLeft", handleRoomUpdate);
      socket.off("roomDeleted", handleRoomUpdate);
    };
  }, []);

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
    <div className="flex flex-col h-full bg-white">
      {/* Header with close button for mobile */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-3 text-center font-medium text-sm ${activeTab === "chats" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <FaComments className="inline-block mr-2" />
          Chats
        </button>
        <button
          onClick={() => setActiveTab("rooms")}
          className={`flex-1 py-3 text-center font-medium text-sm ${activeTab === "rooms" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <FaUsers className="inline-block mr-2" />
          Rooms
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "Anonymous"
                  )}&background=random`
                }
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
              />
              {/* Always show online indicator for the current user */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500">
                Online
              </span>
            </div>
          </div>

          {/* Toggle button for showing all chats */}
          <button
            onClick={() => setShowAllChats(!showAllChats)}
            className={`p-2 rounded-full transition-colors ${showAllChats ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            title={showAllChats ? "Show only unread chats" : "Show all chats"}
          >
            {showAllChats ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="p-3 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats or users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-2 px-4 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
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

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {activeTab === "chats" ? (
          <>
            {/* Search Results for Users */}
            {searchTerm && searchChatResults?.length > 0 && (
              <div className="p-3 border-b">
                <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Users</h3>
                <SearchChatPersons
                  searchResults={searchChatResults}
                  onPersonClick={handlePersonClick}
                />
              </div>
            )}

            {/* Chats Section */}
            <div>
              {searchTerm && <h3 className="text-xs font-medium text-gray-500 uppercase p-3">Chats</h3>}

              {filteredChats?.length === 0 ? (
                <div className="text-center text-gray-500 p-6 bg-gray-50 m-3 rounded-lg">
                  {chats?.length === 0 ? (
                    <div>
                      <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="font-medium">No conversations yet</p>
                      <p className="text-sm mt-1">Search for users to start chatting</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">No {!showAllChats ? "unread" : ""} chats found</p>
                      {!showAllChats && (
                        <button
                          onClick={() => setShowAllChats(true)}
                          className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                          Show all chats
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                filteredChats?.map((chat) => {
                  const person = chat?.participants?.find(
                    (p) => p?._id !== user?._id
                  );
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
            </div>
          </>
        ) : (
          <>
            {/* Rooms Section */}
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="text-xs font-medium text-gray-500 uppercase">Your Rooms</h3>
              <button
                onClick={() => setShowCreateRoomModal(true)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                title="Create new room"
              >
                <FaPlus size={14} />
              </button>
            </div>

            {/* User's Rooms */}
            <div>
              {rooms.length === 0 ? (
                <div className="text-center text-gray-500 p-6 bg-gray-50 m-3 rounded-lg">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="font-medium">No rooms yet</p>
                  <p className="text-sm mt-1">Create a room or join a public room below</p>
                </div>
              ) : (
                rooms.map((room) => (
                  <RoomList
                    key={room._id}
                    room={room}
                    isActive={`room/${room._id}` === id}
                    onClose={onClose}
                  />
                ))
              )}
            </div>

            {/* Public Rooms */}
            {publicRooms.length > 0 && (
              <>
                <div className="p-3 border-b border-t mt-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase">Public Rooms</h3>
                </div>
                <div>
                  {publicRooms.map((room) => (
                    <RoomList
                      key={room._id}
                      room={room}
                      isPublic={true}
                      onJoin={handleJoinRoom}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateRoomModal && (
        <CreateRoomModal onClose={() => setShowCreateRoomModal(false)} onRoomCreated={fetchRooms} />
      )}
    </div>
  );
};

export default ChatSidebar;
