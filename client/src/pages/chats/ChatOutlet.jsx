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

  // Fetch chat messages (memoized to prevent unnecessary re-creation)
  const fetchChatMessages = useCallback(async () => {
    try {
      const { data } = await customFetch.get(`/messages/${id}`);
      setMessages(data?.messages || []);
      setActiveUser(data?.receiver);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.chatId === id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleMessagesSeen = ({ chatId }) => {
      if (chatId === id) {
        fetchChatMessages();
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [id, fetchChatMessages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none border-b">
        <ChatHeader activeUser={activeUser} onMenuClick={toggleSidebar} />
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50">
        <ChatMessages user={user} messages={messages} />
      </div>

      <div className="flex-none">
        <ChatInput chatId={id} fetchChatMessages={fetchChatMessages} />
      </div>
    </div>
  );
};

export default ChatOutlet;
