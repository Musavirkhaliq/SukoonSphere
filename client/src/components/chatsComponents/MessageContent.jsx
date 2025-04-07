import FileAttachment from "./FileAttachment";
import timeAgo from "@/utils/convertTime";
import { format } from 'date-fns';

const MessageContent = ({ message, isOwnMessage }) => {
  // Format time for tooltip
  const formattedTime = message?.createdAt
    ? format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')
    : '';

  return (
    <div
      className={`relative max-w-[85%] sm:max-w-[75%] p-3 text-sm rounded-lg ${isOwnMessage
        ? "bg-blue-600 text-white rounded-br-none shadow-md"
        : "bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm"
      }`}
      title={formattedTime}
    >
      {message.content && (
        <div className="break-words mb-1 leading-relaxed">{message.content}</div>
      )}

      {message.hasAttachment && (
        <div className="space-y-2 mt-2">
          {message.attachments.map((attachment, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <FileAttachment attachment={attachment} />
            </div>
          ))}
        </div>
      )}

      <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <span className={`block text-[10px] ${isOwnMessage ? 'text-gray-200' : 'text-gray-500'}`}>
          {timeAgo(message?.updatedAt)}
        </span>
        {isOwnMessage && (
          <span className="block text-[10px] ml-1">
            {message?.seen ? (
              <span className="text-green-300">✓✓</span>
            ) : (
              <span className="text-gray-200">✓</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageContent;