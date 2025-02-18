import { useEffect, useRef } from "react";
import { format } from "date-fns";
import timeAgo from "@/utils/convertTime";

const ChatMessages = ({ user, messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages?.length)
    return <div className="text-gray-500 text-center p-4">No Messages</div>;

  return (
    <div className="flex flex-col p-4 gap-1.5 overflow-y-scroll h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 text-white rounded-lg">
      {messages?.map((message, index) => {
        const isOwnMessage = user?._id === message?.sender?._id;
        return (
          <div
            key={index}
            className={`flex items-end  ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            {!isOwnMessage &&
              (message?.sender?.avatar ? (
                <img
                  src={message?.sender?.avatar}
                  alt="avatar"
                  className="w-7 h-7 object-cover md:w-8 md:h-8 self-start bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2"
                />
              ) : (
                <div className="w-8 h-8 self-start bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2">
                  {message?.sender?.name?.charAt(0)}
                </div>
              ))}
            <div
              className={`relative max-w-[75%] leading-4 p-2 text-[12px] rounded-lg shadow-md ${
                isOwnMessage
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-[var(--grey--900)] text-white rounded-bl-none"
              }`}
            >
              <span className="break-words ">{message?.content}</span>
              <div className="flex items-center justify-end gap-1">
                {" "}
                <span className="block text-[9px] text-gray-200  text-right">
                  {/* {timeAgo(message?.updatedAt), "h:mm a")} */}
                  {timeAgo(message?.updatedAt)}
                </span>
                {isOwnMessage && (
                  <span className="block text-[9px] text-gray-400  text-right">
                    {message?.seen ? (
                      <span className="text-green-500">✓✓ </span>
                    ) : (
                      <span className="text-[--white-color]">✓</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />{" "}
      {/* Invisible element at the bottom of the messages */}
    </div>
  );
};

export default ChatMessages;
