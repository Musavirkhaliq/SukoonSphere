import React, { useState } from "react";
import { FaTimes, FaCrown, FaUserCog, FaUserMinus } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import DeleteModal from "../shared/DeleteModal";

const RoomMembersModal = ({ room, isAdmin, onClose }) => {
  const { user } = useUser();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [changingRole, setChangingRole] = useState(false);

  // Check if current user is the creator of the room
  const isCreator = user?._id === room?.createdBy?._id;

  // Handle promoting a member to admin
  const handlePromoteToAdmin = async (memberId) => {
    try {
      setChangingRole(true);
      await customFetch.patch(`/rooms/${room._id}/members/${memberId}/role`, {
        role: "admin",
      });
      toast.success("Member promoted to admin");
      onClose();
    } catch (error) {
      console.error("Error promoting member:", error);
      toast.error(error.response?.data?.message || "Failed to promote member");
    } finally {
      setChangingRole(false);
    }
  };

  // Handle demoting an admin to member
  const handleDemoteToMember = async (memberId) => {
    try {
      setChangingRole(true);
      await customFetch.patch(`/rooms/${room._id}/members/${memberId}/role`, {
        role: "member",
      });
      toast.success("Admin demoted to member");
      onClose();
    } catch (error) {
      console.error("Error demoting admin:", error);
      toast.error(error.response?.data?.message || "Failed to demote admin");
    } finally {
      setChangingRole(false);
    }
  };

  // Handle removing a member
  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    try {
      setRemoving(true);
      await customFetch.delete(`/rooms/${room._id}/members/${selectedMember._id}`);
      toast.success("Member removed successfully");
      setShowRemoveModal(false);
      onClose();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error(error.response?.data?.message || "Failed to remove member");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Room Members</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Members List */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {room?.members?.length || 0} Members
          </h3>
          
          <ul className="divide-y">
            {room?.members?.map((member) => {
              const isCurrentUser = member.user._id === user?._id;
              const isMemberAdmin = member.role === "admin";
              const canManageMember = isAdmin && !isCurrentUser && (isCreator || !isMemberAdmin);
              
              return (
                <li key={member.user._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    {member.user.avatar ? (
                      <img
                        src={member.user.avatar}
                        alt={member.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {member.user.name[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium flex items-center">
                        {member.user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                            You
                          </span>
                        )}
                        {member.user._id === room.createdBy._id && (
                          <FaCrown className="ml-2 text-yellow-500" title="Creator" />
                        )}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        {isMemberAdmin ? "Admin" : "Member"} · Joined{" "}
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {canManageMember && (
                    <div className="flex">
                      {isMemberAdmin ? (
                        <button
                          onClick={() => handleDemoteToMember(member.user._id)}
                          disabled={changingRole}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          title="Demote to member"
                        >
                          <FaUserCog />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePromoteToAdmin(member.user._id)}
                          disabled={changingRole}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          title="Promote to admin"
                        >
                          <FaUserCog />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedMember(member.user);
                          setShowRemoveModal(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Remove from room"
                      >
                        <FaUserMinus />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>

      {/* Remove member confirmation modal */}
      {showRemoveModal && (
        <DeleteModal
          title="Remove Member"
          description={`Are you sure you want to remove ${selectedMember?.name} from this room?`}
          onDelete={handleRemoveMember}
          onCancel={() => setShowRemoveModal(false)}
          isDeleting={removing}
        />
      )}
    </div>
  );
};

export default RoomMembersModal;
