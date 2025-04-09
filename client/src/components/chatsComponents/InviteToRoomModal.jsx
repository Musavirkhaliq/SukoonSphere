import React, { useState, useEffect } from "react";
import { FaTimes, FaSearch, FaUserPlus } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

const InviteToRoomModal = ({ roomId, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState({});
  const [roomMembers, setRoomMembers] = useState([]);
  const [roomPendingMembers, setRoomPendingMembers] = useState([]);

  // Fetch room details to get current members
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const { data } = await customFetch.get(`/rooms/${roomId}`);
        // Extract member IDs
        const memberIds = data.members.map(member => member.user._id);
        setRoomMembers(memberIds);

        // Extract pending member IDs
        const pendingMemberIds = data.pendingMembers?.map(member => member.user._id) || [];
        setRoomPendingMembers(pendingMemberIds);
      } catch (error) {
        console.error("Error fetching room details:", error);
        toast.error("Failed to load room details");
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  // Search for users when search term changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim() || searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await customFetch.get(`/user/search?query=${searchTerm}`);
        // The API returns data in a different format than expected
        // It returns { success: true, users: [...] }
        if (response.data.success && Array.isArray(response.data.users)) {
          // Filter out users who are already members or have pending invitations
          const filteredUsers = response.data.users.filter(user => {
            return !roomMembers.includes(user._id) && !roomPendingMembers.includes(user._id);
          });
          setSearchResults(filteredUsers);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching users:", error);
        console.error("Error response:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to search users");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, roomMembers, roomPendingMembers]);

  // Handle inviting a user
  const handleInvite = async (userId) => {
    try {
      setInviting((prev) => ({ ...prev, [userId]: true }));
      await customFetch.post(`/rooms/${roomId}/invite`, { invitedUserId: userId });
      toast.success("Invitation sent successfully");

      // Remove invited user from search results
      setSearchResults((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error inviting user:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setInviting((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Invite People</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email"
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Search results */}
        <div className="p-4 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="divide-y">
              {searchResults.map((user) => (
                <li key={user._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.name[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInvite(user._id)}
                    disabled={inviting[user._id]}
                    className={`p-2 rounded-full ${
                      inviting[user._id]
                        ? "bg-gray-200 text-gray-500"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                    aria-label="Invite"
                  >
                    {inviting[user._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    ) : (
                      <FaUserPlus />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : searchTerm.length > 0 ? (
            <p className="text-center text-gray-500 py-4">No users found</p>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Search for users to invite to this room
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteToRoomModal;
