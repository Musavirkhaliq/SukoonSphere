import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEllipsisV, FaUsers, FaTrash, FaSignOutAlt, FaCog, FaUserPlus, FaBell } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import DeleteModal from "../shared/DeleteModal";
import RoomDetailsModal from "./RoomDetailsModal";
import RoomMembersModal from "./RoomMembersModal";
import InviteToRoomModal from "./InviteToRoomModal";
import RoomJoinRequestsModal from "./RoomJoinRequestsModal";

const RoomHeader = ({ room, onMenuClick, isAdmin, fetchRoom, pendingRequestsCount = 0 }) => {
  const navigate = useNavigate();
  const { id: roomId } = useParams();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinRequestsModal, setShowJoinRequestsModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingJoinRequests, setPendingJoinRequests] = useState(0);

  // Check for pending join requests
  useEffect(() => {
    if (room && isAdmin) {
      const pendingRequests = room.joinRequests?.filter(
        request => request.status === "pending"
      ) || [];
      setPendingJoinRequests(pendingRequests.length);
    }
  }, [room, isAdmin]);

  // Handle room deletion
  const handleDeleteRoom = async () => {
    try {
      setDeleting(true);
      await customFetch.delete(`/rooms/${roomId}`);
      toast.success("Room deleted successfully");
      navigate("/chats");
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error(error.response?.data?.message || "Failed to delete room");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle leaving room
  const handleLeaveRoom = async () => {
    try {
      await customFetch.post(`/rooms/${roomId}/leave`);
      toast.success("You have left the room");
      navigate("/chats");
    } catch (error) {
      console.error("Error leaving room:", error);
      toast.error(error.response?.data?.message || "Failed to leave room");
    }
  };

  // Go back to chat list
  const goBack = () => {
    navigate("/chats");
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white border-b shadow-md">
      <div className="flex items-center">
        <div className="flex items-center">
          <button
            onClick={goBack}
            className="p-2 text-gray-600 hover:text-gray-800 md:hidden"
            aria-label="Back"
          >
            <FaArrowLeft />
          </button>

          <button
            onClick={onMenuClick}
            className="p-2 ml-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200 flex items-center justify-center relative lg:hidden"
            aria-label="Menu"
          >
            <FaUsers size={16} />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center">
          {room?.image ? (
            <img
              src={room.image}
              alt={room.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="text-blue-600 font-medium text-lg">
                {room?.name?.[0]?.toUpperCase()}
              </span>
            </div>
          )}

          <div>
            <h2 className="font-medium text-gray-900">{room?.name}</h2>
            <div className="flex items-center text-xs text-gray-500">
              <FaUsers className="mr-1" size={10} />
              <span>{room?.members?.length || 0} members</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
          aria-label="More options"
        >
          <FaEllipsisV />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowMembersModal(true);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaUsers className="mr-2" /> View Members
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowInviteModal(true);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaUserPlus className="mr-2" /> Invite People
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowJoinRequestsModal(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <FaBell className="mr-2" /> Join Requests
                    </div>
                    {pendingJoinRequests > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {pendingJoinRequests}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowDetailsModal(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FaCog className="mr-2" /> Room Settings
                  </button>
                </>
              )}

              <hr className="my-1 border-gray-200" />

              {isAdmin ? (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteModal(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <FaTrash className="mr-2" /> Delete Room
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleLeaveRoom();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Leave Room
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteRoom}
        title="Delete Room"
        message="Are you sure you want to delete this room? All messages will be permanently deleted. This action cannot be undone."
        itemType="room"
        isLoading={deleting}
      />

      {/* Room details modal */}
      {showDetailsModal && (
        <RoomDetailsModal
          room={room}
          isAdmin={isAdmin}
          onClose={() => {
            setShowDetailsModal(false);
            fetchRoom();
          }}
        />
      )}

      {/* Room members modal */}
      {showMembersModal && (
        <RoomMembersModal
          room={room}
          isAdmin={isAdmin}
          onClose={() => {
            setShowMembersModal(false);
            fetchRoom();
          }}
        />
      )}

      {/* Invite to room modal */}
      {showInviteModal && (
        <InviteToRoomModal
          roomId={roomId}
          onClose={() => {
            setShowInviteModal(false);
          }}
        />
      )}

      {/* Join requests modal */}
      {showJoinRequestsModal && (
        <RoomJoinRequestsModal
          roomId={roomId}
          onClose={() => {
            setShowJoinRequestsModal(false);
          }}
          onRequestHandled={() => {
            fetchRoom();
          }}
        />
      )}
    </div>
  );
};

export default RoomHeader;
