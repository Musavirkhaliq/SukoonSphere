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
        const { data } = await customFetch.patch(
          `/messages/mark-as-seen/${id}`
        );
        return data;
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  }, [id, messages, user?.userId]);

  // Initial fetch of messages
  useEffect(() => {
    fetchChatMessages();
  }, [id]);

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
            seen: true,
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
  }, [id]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none border-b">
        <ChatHeader
          activeUser={activeUser}
          onMenuClick={toggleSidebar}
          totalMessages={messages?.length}
          setMessages={setMessages}
        />
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50 mb-14 md:mb-0">
        <ChatMessages
          user={user}
          messages={messages}
          setMessages={setMessages}
        />
      </div>

      <div className="flex-none">
        <ChatInput chatId={id} fetchChatMessages={fetchChatMessages} />
      </div>
    </div>
  );
};

export default React.memo(ChatOutlet);
