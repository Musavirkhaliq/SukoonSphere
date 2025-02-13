import customFetch from "@/utils/customFetch";
import socket from "@/utils/socket/socket";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

const ChatMessages = ({ chatId, user }) => {
  const [messages, setMessages] = useState([]);

  const fetchChatMessages = async () => {
    try {
      const { data } = await customFetch.get(`/messages/${chatId}`);
      setMessages(data?.messages || []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [chatId]);

  useEffect(() => {
    socket.emit("join", user._id);
    socket.on("newMessage", (item) => {
      setMessages((prevItems) => [...prevItems, item]);
    });
    return () => {
      socket.off("newMessage");
    };
  }, [user]);

  if (!messages.length) return <div className="text-gray-500 text-center p-4">No Messages</div>;

  return (
    <div className="flex flex-col p-4 gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100  text-white rounded-lg">
      {messages.map((message, index) => {
        const isOwnMessage = user._id === message.sender._id;
        return (
          <div
            key={index}
            className={`flex items-end  ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            {!isOwnMessage && (
              <div className="w-8 h-8 self-start bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2">
                {/* {message.sender.name} */}
              </div>
            )}
            <div
              className={`relative max-w-[75%] p-3 text-sm rounded-lg shadow-md ${
                isOwnMessage
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-800 text-white rounded-bl-none"
              }`}
            >
              {!isOwnMessage && (
                <p className="text-blue-400 font-semibold mb-1">{message.sender.name}</p>
              )}
              <p className="break-words leading-tight">{message.content}</p>
              <span className="block text-xs text-gray-400 mt-1 text-right">
                {format(new Date(message.updatedAt), "h:mm a")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
