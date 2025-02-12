// ChatSidebar.js
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import React, { useEffect, useState } from "react";
import { BiMessageRoundedDots } from "react-icons/bi";
import { Link } from "react-router-dom";

const ChatSidebar = ({ chats }) => {
  const { user } = useUser();
  
  return (
    <div className="w-80 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 bg-gray-200 rounded-full"
          />
          <div className="flex-1">
            <h4 className="font-semibold">{user?.name}</h4>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        {chats?.map((chat) => {
          const person = chat.participants.find(
            (participant) => participant._id !== user._id
          );

          return (
            <Link
              to={`/chats/${chat._id}`}
              key={chat._id}
              
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer `}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {person?.name.charAt(0)}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="font-medium">{person?.name}</div>
                <div className="text-sm text-gray-500 truncate">
                  {chat.lastMessage?chat.lastMessage :'No Messages'}
                </div>
              </div>
            
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default ChatSidebar;
