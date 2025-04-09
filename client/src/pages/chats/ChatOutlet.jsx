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
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await customFetch.get('/messages/total-unseen');
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Fetch chat messages
  const fetchChatMessages = useCallback(async () => {
  try {
    const { data } = await customFetch.get(`/messages/${id}`);
    console.log({ data });
    setMessages(data?.messages || []);
    setActiveUser(data?.receiver);
    setChat(data?.chat);
    setIsInitialFetch(false);

    // Mark messages as seen immediately after fetching them
    const unseenMessages = data?.messages?.some(
      (msg) => !msg.seen && msg.sender._id !== user?.userId
    );

    if (unseenMessages) {
      await customFetch.patch(`/messages/mark-as-seen/${id}`);
    }
  } catch (error) {
    console.error("Error fetching chat messages:", error);
  }
}, [id, user?.userId]);
  // Mark messages as seen
const seenMessages = useCallback(async () => {
  try {
    // Just make the API call directly without checking messages
    await customFetch.patch(`/messages/mark-as-seen/${id}`);
  } catch (error) {
    console.error("Error marking messages as seen:", error);
  }
}, [id, user?.userId]);
  // Initial fetch of messages and unread count
  useEffect(() => {
    fetchChatMessages();
    fetchUnreadCount();
  }, [id, fetchChatMessages, fetchUnreadCount]);

  // Handle real-time updates and seen status
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message?.chatId === id) {
        setMessages((prev) => {
          // Prevent duplicate messages
          return [...prev, message];
        });

        // Mark messages as seen only if the user is active in this chat
        if (message?.sender?._id !== user?.userId) {
          seenMessages();
        }
      }
    };

    // Handle messages sent by the current user (no notification)
    const handleMessageSent = (message) => {
      if (message?.chatId === id) {
        setMessages((prev) => {
          // Prevent duplicate messages
          return [...prev, message];
        });
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

    // Inform the server that this chat is currently open
    // This will prevent sending notifications for this chat
    const informChatIsOpen = () => {
      socket.emit('chatOpen', { chatId: id, userId: user?.userId });
    };

    // Call immediately and set up interval
    informChatIsOpen();
    const interval = setInterval(informChatIsOpen, 30000); // Every 30 seconds

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSent", handleMessageSent); // Listen for messages sent by current user
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSent", handleMessageSent);
      socket.off("messagesSeen", handleMessagesSeen);

      // Update unread count when leaving the chat
      fetchUnreadCount();

      // Inform server that chat is no longer open
      socket.emit('chatClosed', { chatId: id, userId: user?.userId });
      clearInterval(interval);
    };
  }, [id, user?.userId, seenMessages]);

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-none border-b sticky top-0 z-10 bg-white shadow-sm">
        <ChatHeader
          activeUser={activeUser}
          onMenuClick={toggleSidebar}
          totalMessages={messages?.length}
          setMessages={setMessages}
          unreadCount={unreadCount}
        />
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50">
        <ChatMessages
          user={user}
          messages={messages}
          setMessages={setMessages}
        />
      </div>

      <div className="flex-none fixed bottom-0 left-0 right-0 lg:relative bg-white shadow-lg lg:shadow-none z-10">
        <ChatInput chatId={id} fetchChatMessages={fetchChatMessages} />
      </div>
    </div>
  );
};

export default React.memo(ChatOutlet);
