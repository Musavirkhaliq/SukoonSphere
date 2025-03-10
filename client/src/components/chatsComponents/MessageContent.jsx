import FileAttachment from "./FileAttachment";
import timeAgo from "@/utils/convertTime";

const MessageContent = ({ message, isOwnMessage }) => (
  <div
    className={`relative max-w-[75%] p-2 text-sm rounded-lg shadow-md ${
      isOwnMessage
        ? "bg-blue-600 text-white rounded-br-none"
        : "bg-[var(--grey--900)] text-white rounded-bl-none"
    }`}
  >
    {message.content && (
      <span className="break-words block">{message.content}</span>
    )}
    
    {message.hasAttachment && (
      <div className="space-y-2">
        {message.attachments.map((attachment, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            <FileAttachment attachment={attachment} />
          </div>
        ))}
      </div>
    )}
    
    <div className="flex items-center justify-end gap-1">
      <span className="block text-[10px] text-gray-200 text-right">
        {timeAgo(message?.updatedAt)}
      </span>
      {isOwnMessage && (
        <span className="block text-[10px] text-gray-400 text-right">
          {message?.seen ? (
            <span className="text-green-500">✓✓</span>
          ) : (
            <span className="text-white opacity-70">✓</span>
          )}
        </span>
      )}
    </div>
  </div>
);

export default MessageContent;