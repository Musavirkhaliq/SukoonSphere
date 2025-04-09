import React, { useState, useEffect, useCallback } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import socket from "@/utils/socket/socket";
import RoomHeader from "@/components/chatsComponents/RoomHeader";
import RoomMessages from "@/components/chatsComponents/RoomMessages";
import RoomInput from "@/components/chatsComponents/RoomInput";

const RoomOutlet = () => {
  const { id } = useParams();
  const { user } = useUser();
  const { toggleSidebar } = useOutletContext();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // Fetch room details
  const fetchRoom = useCallback(async () => {
    try {
      const response = await customFetch.get(`/rooms/${id}`);
      setRoom(response.data);

      // Check if user is an admin
      const userMember = response.data.members.find(
        (member) => member.user._id === user?._id
      );

      // Check if user is a member
      const isMember = !!userMember;

      // Set admin status
      const isUserAdmin = userMember?.role === "admin" || response.data.createdBy._id === user?._id;
      setIsAdmin(isUserAdmin);

      // Count pending join requests if user is admin
      if (isUserAdmin) {
        const pendingRequests = response.data.joinRequests?.filter(
          request => request.status === "pending"
        ) || [];
        setPendingRequestsCount(pendingRequests.length);
      }

      // If user is not a member, check if they have a pending join request
      if (!isMember) {
        const hasPendingRequest = response.data.joinRequests?.some(
          request => request.user._id === user?._id && request.status === "pending"
        );

        if (hasPendingRequest) {
          toast.info("Your request to join this room is pending approval");
        }
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      toast.error("Failed to load room details");
    }
  }, [id, user?._id]);

  // Fetch room messages
  const fetchRoomMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customFetch.get(`/room-messages/${id}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Mark messages as seen
  const markMessagesAsSeen = useCallback(async () => {
    try {
      await customFetch.patch(`/room-messages/${id}/seen`);
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  }, [id]);

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      await fetchRoom();
      await fetchRoomMessages();
      await markMessagesAsSeen();
    };

    loadData();
  }, [fetchRoom, fetchRoomMessages, markMessagesAsSeen]);

  // Socket event handlers
  useEffect(() => {
    if (!user?._id) return;

    // Notify server that user has opened this room
    socket.emit("roomOpen", { roomId: id, userId: user._id });

    // Listen for new messages
    const handleNewMessage = (data) => {
      if (data.roomId === id) {
        setMessages((prev) => [...prev, data.message]);
        markMessagesAsSeen();
      }
    };

    // Listen for message deletions
    const handleMessageDeleted = (data) => {
      if (data.roomId === id) {
        setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
      }
    };

    // Listen for room updates
    const handleRoomUpdated = () => {
      fetchRoom();
    };

    // Listen for member changes
    const handleMemberJoined = () => {
      fetchRoom();
    };

    const handleMemberLeft = () => {
      fetchRoom();
    };

    // Listen for join request responses
    const handleJoinRequestApproved = () => {
      fetchRoom();
      fetchRoomMessages();
      toast.success("Your request to join this room has been approved");
    };

    const handleJoinRequestRejected = () => {
      fetchRoom();
      toast.info("Your request to join this room has been rejected");
    };

    const handleMemberRemoved = (data) => {
      if (data.roomId === id && data.userId === user._id) {
        toast.info(`You have been removed from ${data.roomName}`);
        // Navigate to chat list
        window.location.href = "/chats";
      } else {
        fetchRoom();
      }
    };

    // Register event listeners
    socket.on("newRoomMessage", handleNewMessage);
    socket.on("roomMessageDeleted", handleMessageDeleted);
    socket.on("roomUpdated", handleRoomUpdated);
    socket.on("roomMemberJoined", handleMemberJoined);
    socket.on("roomMemberLeft", handleMemberLeft);
    socket.on("roomMemberRemoved", handleMemberRemoved);
    socket.on("roomJoinRequestApproved", handleJoinRequestApproved);
    socket.on("roomJoinRequestRejected", handleJoinRequestRejected);

    // Clean up event listeners
    return () => {
      socket.off("newRoomMessage", handleNewMessage);
      socket.off("roomMessageDeleted", handleMessageDeleted);
      socket.off("roomUpdated", handleRoomUpdated);
      socket.off("roomMemberJoined", handleMemberJoined);
      socket.off("roomMemberLeft", handleMemberLeft);
      socket.off("roomMemberRemoved", handleMemberRemoved);
      socket.off("roomJoinRequestApproved", handleJoinRequestApproved);
      socket.off("roomJoinRequestRejected", handleJoinRequestRejected);

      // Notify server that user has closed this room
      socket.emit("roomClosed", { roomId: id, userId: user._id });
    };
  }, [id, user?._id, markMessagesAsSeen, fetchRoom]);

  if (loading && !room) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-none border-b sticky top-0 z-10 bg-white shadow-sm">
        <RoomHeader
          room={room}
          onMenuClick={toggleSidebar}
          isAdmin={isAdmin}
          fetchRoom={fetchRoom}
          pendingRequestsCount={pendingRequestsCount}
        />
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50">
        <RoomMessages
          user={user}
          messages={messages}
          setMessages={setMessages}
          roomId={id}
          isAdmin={isAdmin}
        />
      </div>

      <div className="flex-none fixed bottom-0 left-0 right-0 lg:relative bg-white shadow-lg lg:shadow-none z-10">
        <RoomInput roomId={id} fetchRoomMessages={fetchRoomMessages} />
      </div>
    </div>
  );
};

export default React.memo(RoomOutlet);
