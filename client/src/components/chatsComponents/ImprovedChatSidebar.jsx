import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import socket from "@/utils/socket/socket";
import { debounce } from "lodash";
import {
  FaEye, FaEyeSlash, FaUsers, FaComments, FaPlus,
  FaSearch, FaTimes, FaGlobe, FaBell,
  FaChevronDown, FaChevronUp, FaSortAmountDown, FaSortAmountUp
} from "react-icons/fa";
import { toast } from "react-toastify";

import ChatList from "./ChatList";
import ImprovedRoomList from "./ImprovedRoomList";
import SearchChatPersons from "./SearchChatPersons";
import CreateRoomModal from "./CreateRoomModal";

const ImprovedChatSidebar = ({ onClose, setPreventSidebarClose, keepSidebarOpen }) => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [publicRooms, setPublicRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const [searchChatResults, setSearchChatResults] = useState([]);
  const [showAllChats, setShowAllChats] = useState(true);
  const [filteredChats, setFilteredChats] = useState([]);
  const [activeTab, setActiveTab] = useState("chats");
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest", "oldest", "unread"
  const [expandedSections, setExpandedSections] = useState({
    yourRooms: true,
    publicRooms: true,
    joinRequests: true
  });
  const [pendingJoinRequests, setPendingJoinRequests] = useState([]);
  const [isLoading, setIsLoading] = useState({
    chats: false,
    rooms: false,
    publicRooms: false,
    joinRequests: false
  });
  const navigate = useNavigate();

  // Function to fetch chats
  const fetchChats = async (search = "") => {
    try {
      setIsLoading(prev => ({ ...prev, chats: true }));
      const { data } = await customFetch.get("/chats", {
        params: { search },
      });

      // Ensure we have valid data before updating state
      const chatsArray = Array.isArray(data?.chats) ? data.chats : [];
      const usersArray = Array.isArray(data?.users) ? data.users : [];

      setChats(chatsArray);
      updateFilteredChats(chatsArray);
      setSearchChatResults(usersArray);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chats");
    } finally {
      setIsLoading(prev => ({ ...prev, chats: false }));
    }
  };

  // Function to fetch rooms
  const fetchRooms = async () => {
    try {
      setIsLoading(prev => ({ ...prev, rooms: true }));
      const { data } = await customFetch.get("/rooms");
      // Ensure we have valid data
      const roomsArray = Array.isArray(data) ? data : [];
      setRooms(roomsArray);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setIsLoading(prev => ({ ...prev, rooms: false }));
    }
  };

  // Function to fetch public rooms
  const fetchPublicRooms = async () => {
    try {
      setIsLoading(prev => ({ ...prev, publicRooms: true }));
      const { data } = await customFetch.get("/rooms/public");
      // Ensure we have valid data
      const publicRoomsArray = Array.isArray(data) ? data : [];
      setPublicRooms(publicRoomsArray);
    } catch (error) {
      console.error("Error fetching public rooms:", error);
      toast.error("Failed to load public rooms");
    } finally {
      setIsLoading(prev => ({ ...prev, publicRooms: false }));
    }
  };

  // Function to search rooms
  const searchRooms = async (searchQuery) => {
    try {
      setIsLoading(prev => ({ ...prev, rooms: true, publicRooms: true }));

      // Search user's rooms
      const userRoomsResponse = await customFetch.get("/rooms", {
        params: { search: searchQuery }
      });

      // Ensure we have valid data
      const userRoomsArray = Array.isArray(userRoomsResponse?.data) ? userRoomsResponse.data : [];
      setRooms(userRoomsArray);

      // Search public rooms
      const publicRoomsResponse = await customFetch.get("/rooms/public", {
        params: { search: searchQuery }
      });

      // Ensure we have valid data
      const publicRoomsArray = Array.isArray(publicRoomsResponse?.data) ? publicRoomsResponse.data : [];
      setPublicRooms(publicRoomsArray);
    } catch (error) {
      console.error("Error searching rooms:", error);
      toast.error("Failed to search rooms");
    } finally {
      setIsLoading(prev => ({ ...prev, rooms: false, publicRooms: false }));
    }
  };

  // Function to fetch pending join requests
  const fetchPendingJoinRequests = async () => {
    try {
      setIsLoading(prev => ({ ...prev, joinRequests: true }));
      // This endpoint would need to be implemented in the backend
      const { data } = await customFetch.get("/rooms/join-requests/pending");
      // Ensure we have valid data
      const pendingRequestsArray = Array.isArray(data) ? data : [];
      setPendingJoinRequests(pendingRequestsArray);
    } catch (error) {
      console.error("Error fetching pending join requests:", error);
      // Don't show error toast as this might not be implemented yet
      setPendingJoinRequests([]);
    } finally {
      setIsLoading(prev => ({ ...prev, joinRequests: false }));
    }
  };

  // Update filtered chats based on toggle and sort order
  const updateFilteredChats = useCallback((chatList = chats) => {
    let filtered = chatList;

    // Filter based on showAllChats toggle
    if (!showAllChats) {
      filtered = chatList.filter(
        (chat) => chat.hasUnreadMessages || chat.lastMessageSender !== user?._id
      );
    }

    // Sort based on sortOrder
    if (sortOrder === "newest") {
      filtered = [...filtered].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortOrder === "oldest") {
      filtered = [...filtered].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    } else if (sortOrder === "unread") {
      filtered = [...filtered].sort((a, b) => {
        // Sort by unread first, then by date
        if (a.hasUnreadMessages && !b.hasUnreadMessages) return -1;
        if (!a.hasUnreadMessages && b.hasUnreadMessages) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    }

    setFilteredChats(filtered);
  }, [chats, showAllChats, sortOrder, user?._id]);

  // Handle joining a public room (send join request)
  const handleJoinRoom = async (roomId) => {
    try {
      const response = await customFetch.post(`/rooms/${roomId}/join`);
      fetchRooms();
      fetchPublicRooms();
      fetchPendingJoinRequests();
      toast.success(response.data.message || "Join request sent successfully");
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error(error.response?.data?.message || "Failed to send join request");
      throw error;
    }
  };

  // Handle starting a chat with a person
  const handlePersonClick = async (personId) => {
    try {
      const { data } = await customFetch.post(`chats`, { _userId: personId });
      navigate(`/chats/${data._id}`);
      setSearchTerm("");
      fetchChats();
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error(error.response?.data?.msg || "Failed to start chat");
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Debounced search function
  const debouncedFetchChats = useCallback(debounce(fetchChats, 500), []);

  // Fetch data on mount
  useEffect(() => {
    fetchChats();
    fetchRooms();
    fetchPublicRooms();
    fetchPendingJoinRequests();
  }, []);

  // Set active tab based on URL
  useEffect(() => {
    if (location.pathname.includes('/room/')) {
      setActiveTab('rooms');
    } else {
      setActiveTab('chats');
    }
  }, [location.pathname]);

  // Update filtered chats when toggle, sort order, or chats change
  useEffect(() => {
    updateFilteredChats();
  }, [showAllChats, sortOrder, chats, updateFilteredChats]);

  // Fetch chats when new message is received or sent
  useEffect(() => {
    const handleMessageUpdate = () => fetchChats(searchTerm);
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
      fetchPendingJoinRequests();
    };

    socket.on("roomUpdated", handleRoomUpdate);
    socket.on("roomMemberJoined", handleRoomUpdate);
    socket.on("roomMemberLeft", handleRoomUpdate);
    socket.on("roomDeleted", handleRoomUpdate);
    socket.on("roomJoinRequestApproved", handleRoomUpdate);
    socket.on("roomJoinRequestRejected", handleRoomUpdate);

    return () => {
      socket.off("roomUpdated", handleRoomUpdate);
      socket.off("roomMemberJoined", handleRoomUpdate);
      socket.off("roomMemberLeft", handleRoomUpdate);
      socket.off("roomDeleted", handleRoomUpdate);
      socket.off("roomJoinRequestApproved", handleRoomUpdate);
      socket.off("roomJoinRequestRejected", handleRoomUpdate);
    };
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (activeTab === "chats") {
      debouncedFetchChats(value);
    } else if (activeTab === "rooms") {
      // If in rooms tab, search rooms
      if (value.trim().length > 0) {
        // Search both user rooms and public rooms
        searchRooms(value);
      } else {
        // If search is cleared, fetch all rooms again
        fetchRooms();
        fetchPublicRooms();
      }
    }
  };

  // Calculate unread counts
  const unreadChatCount = useMemo(() => {
    return chats.filter(chat => chat.hasUnreadMessages).length;
  }, [chats]);

  // Calculate pending join request count
  const pendingJoinRequestCount = useMemo(() => {
    return pendingJoinRequests.length;
  }, [pendingJoinRequests]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* User Profile */}
      <div className="p-4 bg-[var(--primary)]  text-white">
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
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-white">
                {user?.name}
              </span>
              <span className="text-xs text-blue-100">
                Online
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
              className="p-2 rounded-full hover:bg-blue-600 transition-colors"
              title={sortOrder === "newest" ? "Newest first" : "Oldest first"}
            >
              {sortOrder === "newest" ? <FaSortAmountDown size={14} /> : <FaSortAmountUp size={14} />}
            </button>
            {/* Only show in desktop view */}
            <div className="hidden lg:block">
              <button
                onClick={() => setShowAllChats(!showAllChats)}
                className="p-2 rounded-full hover:bg-blue-600 transition-colors"
                title={showAllChats ? "Show all chats" : "Show active chats"}
              >
                {showAllChats ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-1 ${activeTab === "chats"
            ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          <FaComments size={14} />
          <span>Chats</span>
          {unreadChatCount > 0 && (
            <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadChatCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("rooms")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-1 ${activeTab === "rooms"
            ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          <FaUsers size={14} />
          <span>Rooms</span>
          {pendingJoinRequestCount > 0 && (
            <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingJoinRequestCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              // Prevent sidebar from closing when search is focused
              if (setPreventSidebarClose) {
                setPreventSidebarClose(true);
                // Make sure sidebar is open when search is focused
                if (keepSidebarOpen) keepSidebarOpen();
                // Add class for CSS selector compatibility
                document.querySelector('.chat-sidebar')?.classList.add('sidebar-search-focused');
              }
            }}
            onBlur={() => {
              // Allow sidebar to close again when search loses focus
              if (setPreventSidebarClose) setPreventSidebarClose(false);
              // Remove the class when focus is lost
              document.querySelector('.chat-sidebar')?.classList.remove('sidebar-search-focused');
            }}
            placeholder={activeTab === "chats" ? "Search chats or users..." : "Search rooms..."}
            className="w-full bg-[var(--white-color)] py-2 px-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                fetchChats();
                // Keep focus on the search input after clearing
                document.querySelector('.chat-search-input')?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <FaTimes size={14} />
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

            {/* No Results Message */}
            {searchTerm && chats.length === 0 && searchChatResults?.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p className="mb-2">No results found for "{searchTerm}"</p>
                <p className="text-sm">Try a different search term or check your spelling</p>
              </div>
            )}

            {/* Chats List */}
            <div className="divide-y divide-gray-100">
              {isLoading.chats ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="text-center text-gray-500 p-6">
                  {searchTerm ? (
                    <p>No chats found matching "{searchTerm}"</p>
                  ) : (
                    <div>
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="font-medium">No chats yet</p>
                      <p className="text-sm mt-1">Search for users to start chatting</p>
                      {!showAllChats && (
                        <button
                          onClick={() => setShowAllChats(true)}
                          className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                          Show all chats
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                filteredChats.map((chat) => {
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
            {/* No Results Message for Rooms */}
            {searchTerm && rooms.length === 0 && publicRooms.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p className="mb-2">No rooms found for "{searchTerm}"</p>
                <p className="text-sm">Try a different search term or check your spelling</p>
              </div>
            )}

            {/* Rooms Section */}
            <div className="bg-gray-50 border-b">
              <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => toggleSection("yourRooms")}>
                <div className="flex items-center">
                  <FaUsers className="text-blue-500 mr-2" size={14} />
                  <h3 className="text-sm font-medium text-gray-700">Your Rooms</h3>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCreateRoomModal(true);
                    }}
                    className="p-1 mr-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Create new room"
                  >
                    <FaPlus size={14} />
                  </button>
                  {expandedSections.yourRooms ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </div>
              </div>

              {/* User's Rooms */}
              {expandedSections.yourRooms && (
                <div className="divide-y divide-gray-100">
                  {isLoading.rooms ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : rooms.length === 0 ? (
                    <div className="text-center text-gray-500 p-4">
                      <p className="font-medium">No rooms yet</p>
                      <p className="text-sm mt-1">Create a room or join a public room</p>
                      <button
                        onClick={() => setShowCreateRoomModal(true)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaPlus className="inline mr-1" size={12} /> Create Room
                      </button>
                    </div>
                  ) : (
                    rooms.map((room) => (
                      <ImprovedRoomList
                        key={room._id}
                        room={room}
                        isActive={`room/${room._id}` === id}
                        onClose={onClose}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Pending Join Requests Section */}
            {pendingJoinRequests.length > 0 && (
              <div className="bg-gray-50 border-b mt-2">
                <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => toggleSection("joinRequests")}>
                  <div className="flex items-center">
                    <FaBell className="text-yellow-500 mr-2" size={14} />
                    <h3 className="text-sm font-medium text-gray-700">Pending Requests</h3>
                    <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingJoinRequests.length}
                    </span>
                  </div>
                  {expandedSections.joinRequests ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </div>

                {expandedSections.joinRequests && (
                  <div className="divide-y divide-gray-100">
                    {isLoading.joinRequests ? (
                      <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      pendingJoinRequests.map((request) => (
                        <div key={request._id} className="p-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-medium">
                                {request.room.name[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{request.room.name}</p>
                              <p className="text-xs text-gray-500">Waiting for approval</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Public Rooms Section */}
            {publicRooms.length > 0 && (
              <div className="bg-gray-50 border-b mt-2">
                <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => toggleSection("publicRooms")}>
                  <div className="flex items-center">
                    <FaGlobe className="text-green-500 mr-2" size={14} />
                    <h3 className="text-sm font-medium text-gray-700">Public Rooms</h3>
                  </div>
                  {expandedSections.publicRooms ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </div>

                {expandedSections.publicRooms && (
                  <div className="divide-y divide-gray-100">
                    {isLoading.publicRooms ? (
                      <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      publicRooms.map((room) => (
                        <ImprovedRoomList
                          key={room._id}
                          room={room}
                          isPublic={true}
                          onJoin={handleJoinRoom}
                          onClose={onClose}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
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

export default ImprovedChatSidebar;
