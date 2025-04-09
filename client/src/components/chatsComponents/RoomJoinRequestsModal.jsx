import React, { useState, useEffect } from "react";
import { FaTimes, FaCheck, FaTimesCircle, FaSpinner } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

const RoomJoinRequestsModal = ({ roomId, onClose, onRequestHandled }) => {
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequests, setProcessingRequests] = useState({});

  // Fetch join requests
  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        setLoading(true);
        const { data } = await customFetch.get(`/rooms/${roomId}`);

        // Filter only pending join requests
        let pendingRequests = data.joinRequests?.filter(
          request => request.status === "pending"
        ) || [];

        // If the user objects are not populated, we need to fetch user details
        if (pendingRequests.length > 0 && typeof pendingRequests[0].user === 'string') {
          // Fetch user details for each request
          const userPromises = pendingRequests.map(async (request) => {
            try {
              const { data: userData } = await customFetch.get(`/user/${request.user}`);
              return { ...request, user: userData };
            } catch (error) {
              console.error("Error fetching user details:", error);
              return request;
            }
          });

          pendingRequests = await Promise.all(userPromises);
        }

        setJoinRequests(pendingRequests);
      } catch (error) {
        console.error("Error fetching join requests:", error);
        toast.error("Failed to load join requests");
      } finally {
        setLoading(false);
      }
    };

    fetchJoinRequests();
  }, [roomId]);

  // Handle approving or rejecting a join request
  const handleJoinRequest = async (userId, action) => {
    try {
      setProcessingRequests(prev => ({ ...prev, [userId]: true }));

      await customFetch.post(`/rooms/${roomId}/join-requests/${userId}`, {
        action // 'approve' or 'reject'
      });

      // Update the local state to remove the processed request
      setJoinRequests(prev => prev.filter(request => {
        const requestUserId = typeof request.user === 'object' ? request.user._id : request.user;
        return requestUserId !== userId;
      }));

      toast.success(`Join request ${action === 'approve' ? 'approved' : 'rejected'} successfully`);

      // Notify parent component that a request was handled
      if (onRequestHandled) {
        onRequestHandled();
      }
    } catch (error) {
      console.error(`Error ${action}ing join request:`, error);
      toast.error(`Failed to ${action} join request`);
    } finally {
      setProcessingRequests(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Join Requests</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-2xl" />
            </div>
          ) : joinRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pending join requests</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {joinRequests.map((request) => (
                <li
                  key={typeof request.user === 'object' ? request.user._id : request.user}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <img
                      src={
                        (typeof request.user === 'object' ? request.user.avatar : null) ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          (typeof request.user === 'object' ? request.user.name : "User")
                        )}&background=random`
                      }
                      alt={typeof request.user === 'object' ? request.user.name : "User"}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {typeof request.user === 'object' ? request.user.name : "User"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Requested {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const userId = typeof request.user === 'object' ? request.user._id : request.user;
                        handleJoinRequest(userId, "approve");
                      }}
                      disabled={processingRequests[typeof request.user === 'object' ? request.user._id : request.user]}
                      className={`p-2 rounded-full ${
                        processingRequests[typeof request.user === 'object' ? request.user._id : request.user]
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                      title="Approve"
                    >
                      {processingRequests[typeof request.user === 'object' ? request.user._id : request.user] ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaCheck />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const userId = typeof request.user === 'object' ? request.user._id : request.user;
                        handleJoinRequest(userId, "reject");
                      }}
                      disabled={processingRequests[typeof request.user === 'object' ? request.user._id : request.user]}
                      className={`p-2 rounded-full ${
                        processingRequests[typeof request.user === 'object' ? request.user._id : request.user]
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                      title="Reject"
                    >
                      {processingRequests[typeof request.user === 'object' ? request.user._id : request.user] ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTimesCircle />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomJoinRequestsModal;
