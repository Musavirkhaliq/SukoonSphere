import React, { useEffect, useState, useCallback } from "react";
import { ChatHeader, ChatInput, ChatMessages } from "@/components";
import { useUser } from "@/context/UserContext";
import { useOutletContext, useParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import socket from "@/utils/socket/socket";

const ChatOutlet = () => {
  const { user } = useUser();
  const { id } = useParams();
  const { toggleSidebar } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState({});
  const [chat, setChat] = useState({});
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  // Fetch chat messages
  const fetchChatMessages = useCallback(async () => {
    try {
      const { data } = await customFetch.get(`/messages/${id}`);
      console.log({ data });
        setMessages(data?.messages || []);
      setActiveUser(data?.receiver);
      setChat(data?.chat);
      setIsInitialFetch(false);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  }, [id]);
  // Mark messages as seen
  const seenMessages = useCallback(async () => {
    try {
      const unseenMessages = messages.some(
        (msg) => !msg.seen && msg.sender._id !== user?.userId
      );
      
      if (unseenMessages) {
        const { data } = await customFetch.patch(`/messages/mark-as-seen/${id}`);
        return data;
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  }, [id, messages, user?.userId]);

  // Initial fetch of messages
  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  // Handle real-time updates and seen status
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message?.chatId === id) {
        setMessages((prev) => {
          // Prevent duplicate messages
          const messageExists = prev.some((msg) => msg?._id === message?._id);
          if (messageExists) return prev;
          return [...prev, message];
        });
        
        // Mark messages as seen only if the user is active in this chat
        if (message?.sender?._id !== user?.userId) {
          seenMessages();
        }
      }
    };

    const handleMessagesSeen = ({ chatId }) => {
      if (chatId === id) {
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            seen: true
          }))
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [id, user?.userId, seenMessages]);

  // Mark messages as seen when viewing chat
  useEffect(() => {
    if (!isInitialFetch) {
      seenMessages();
    }
  }, [seenMessages, isInitialFetch]);

  const enableChat = async () => {
    try {
      await customFetch.patch(`/chats/accept-chat-request/${chat._id}`);
      fetchChatMessages();
    } catch (error) {
      console.error("Error enabling chat:", error);
    }
  };

  if (chat?.disabled && chat?.createdBy.toString() === user?._id.toString()) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-gray-100 p-4 rounded-lg">
        <p className="text-lg font-medium text-gray-800">
          Waiting for the other person to accept your chat request
        </p>
        <div className="mt-4">
          <svg
            className="animate-spin h-5 w-5 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C4 0 3.73 0.04 3.5 0.15 3.27 0.26 2.79 0.5 2.5 0.75l-1.5 1.5c-0.62 0.62-0.62 1.62 0 2.24 0.26 0.26 0.5 0.5 0.75 0.5h10.5c0.25 0 0.5-0.24 0.5-0.5 0-0.62-0.38-1.17-1-1.5zM11 6.5a5.5 5.5 0 11.5 0 5.5 5.5 0 01-11 0z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (chat?.disabled) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center">
        <button onClick={enableChat}>Enable Chat</button>
      </div>
    );
  }

 

  console.log({user:user?._id})
  if (!chat?.disabled) return (
    <div className="flex flex-col h-full">
      <div className="flex-none border-b">
        <ChatHeader activeUser={activeUser} onMenuClick={toggleSidebar} totalMessages={messages?.length} setMessages={setMessages} />
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50 mb-14 md:mb-0">
        <ChatMessages user={user} messages={messages} setMessages={setMessages} />
      </div>

      <div className="flex-none">
        <ChatInput chatId={id} fetchChatMessages={fetchChatMessages} />
      </div>
    </div>
  );
};

export default ChatOutlet;