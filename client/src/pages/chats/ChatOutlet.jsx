import React from 'react';
import { ChatHeader, ChatInput, ChatMessages } from "@/components";
import { useUser } from "@/context/UserContext";
import { useOutletContext, useParams } from "react-router-dom";

const ChatOutlet = () => {
  const { user } = useUser();
  const { id } = useParams();
  const { activeUser, toggleSidebar } = useOutletContext();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none border-b">
        <ChatHeader 
          activeUser={activeUser} 
          onMenuClick={toggleSidebar}
        />
      </div>
      
      <div className="flex-1 overflow-hidden bg-gray-50">
        <ChatMessages chatId={id} user={user} />
      </div>
      
      <div className="flex-none p-4 bg-gray-100">
        <ChatInput chatId={id} />
      </div>
    </div>
  );
};

export default ChatOutlet;