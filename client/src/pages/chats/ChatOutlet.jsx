import React, { useEffect, useState } from 'react';
import { ChatHeader, ChatInput, ChatMessages } from "@/components";
import { useUser } from "@/context/UserContext";
import { useOutletContext, useParams } from "react-router-dom";
import customFetch from '@/utils/customFetch';
import socket from '@/utils/socket/socket';

const ChatOutlet = () => {
  const { user } = useUser();
  const { id } = useParams();
  const {  toggleSidebar } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState({});



  const fetchChatMessages = async () => {
    try {
      const { data } = await customFetch.get(`/messages/${id}`);
      setMessages(data?.messages || []);
      setActiveUser(data?.receiver);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [id]);

  useEffect(() => {
    socket.emit("join", user._id);
    socket.on("newMessage", (item) => {
      setMessages((prevItems) => [...prevItems, item]);
    });
    return () => {
      socket.off("newMessage");
    };
  }, [user]);



  return (
    <div className="flex flex-col h-full">
      <div className="flex-none border-b">
        <ChatHeader 
          activeUser={activeUser} 
          onMenuClick={toggleSidebar}
        />
      </div>
      
      <div className="flex-1 overflow-hidden bg-gray-50">
        <ChatMessages user={user} messages={messages} />
      </div>
      
      <div className="flex-none ">
        <ChatInput chatId={id} fetchChatMessages={fetchChatMessages} />
      </div>
    </div>
  );
};

export default ChatOutlet;