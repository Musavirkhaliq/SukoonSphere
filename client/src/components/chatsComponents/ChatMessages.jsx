import { useEffect, useRef, useState } from "react";
import timeAgo from "@/utils/convertTime";
import { IoDownload } from "react-icons/io5";
import { BsFileEarmarkText, BsPlayCircle, BsImage, BsFileEarmarkMusic } from "react-icons/bs";

const FileAttachment = ({ attachment }) => {
  const [imageError, setImageError] = useState(false);
  const baseUrl = "http://localhost:5100";

  const DownloadButton = ({ className = "" }) => (
    <a
      href={`${baseUrl}${attachment.filePath}`}
      download={attachment.fileName}
      className={`group flex items-center gap-2 px-2 py-1 bg-gray-800 bg-opacity-70 rounded hover:bg-opacity-90 transition-all ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <IoDownload className="text-white text-sm" />
      <span className="text-white text-xs">Download</span>
    </a>
  );

  const FileInfo = ({ className = "" }) => (
    <div className={`text-xs text-gray-200 ${className}`}>
      <p className="truncate max-w-[200px]">{attachment.fileName}</p>
      <p>{(attachment.fileSize / 1024).toFixed(1)} KB</p>
    </div>
  );

  switch (attachment.fileType) {
    case 'image':
      return (
        <div className="relative group">
          {imageError ? (
            <div className="w-64 h-64 bg-gray-800 rounded flex flex-col items-center justify-center p-4">
              <BsImage className="text-gray-400 text-4xl mb-2" />
              <span className="text-gray-400 text-sm text-center">Failed to load image</span>
              <FileInfo className="mt-2 text-center" />
            </div>
          ) : (
            <>
              <img
                src={`${baseUrl}${attachment.filePath}`}
                alt={attachment.fileName}
                className="max-w-64 max-h-64 rounded-lg object-cover"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <DownloadButton />
              </div>
              <FileInfo className="mt-1" />
            </>
          )}
        </div>
      );
    
    case 'video':
      return (
        <div className="relative max-w-64">
          <div className="relative rounded-lg overflow-hidden bg-gray-900">
            <video
              src={`${baseUrl}${attachment.filePath}`}
              className="w-full max-h-64 rounded-lg"
              controls
            />
            <div className="absolute top-2 right-2">
              <DownloadButton />
            </div>
          </div>
          <FileInfo className="mt-1" />
        </div>
      );
    
    case 'audio':
      return (
        <div className="bg-gray-800 rounded-lg p-3 max-w-64">
          <div className="flex items-center gap-3 mb-2">
            <BsFileEarmarkMusic className="text-gray-400 text-2xl" />
            <FileInfo />
          </div>
          <audio
            src={`${baseUrl}${attachment.filePath}`}
            className="min-w-full w-full"
            controls
          />
          <div className="mt-2 flex justify-end">
            <DownloadButton />
          </div>
        </div>
      );
    
    case 'document':
    default:
      return (
        <div className="bg-gray-800 rounded-lg p-3 max-w-64">
          <div className="flex items-center gap-3 mb-2">
            <BsFileEarmarkText className="text-gray-400 text-2xl" />
            <FileInfo />
          </div>
          <div className="flex justify-end">
            <DownloadButton />
          </div>
        </div>
      );
  }
};

const MessageContent = ({ message, isOwnMessage }) => (
  <div
    className={`relative max-w-[75%] p-3 text-sm rounded-lg shadow-md ${
      isOwnMessage
        ? "bg-blue-600 text-white rounded-br-none"
        : "bg-[var(--grey--900)] text-white rounded-bl-none"
    }`}
  >
    {message.content && (
      <span className="break-words block mb-3">{message.content}</span>
    )}
    
    {message.hasAttachment && (
      <div className="space-y-3">
        {message.attachments.map((attachment, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            <FileAttachment attachment={attachment} />
          </div>
        ))}
      </div>
    )}
    
    <div className="flex items-center justify-end gap-1 mt-2">
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

// Rest of the ChatMessages component remains the same
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
    <div className="flex flex-col p-4 gap-2 overflow-y-scroll h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 text-white rounded-lg">
      {messages?.map((message, index) => {
        const isOwnMessage = user?._id === message?.sender?._id;
        
        return (
          <div
            key={index}
            className={`flex items-end ${
              isOwnMessage ? "justify-end" : "justify-start"
            }`}
          >
            {!isOwnMessage && (
              message?.sender?.avatar ? (
                <img
                  src={message?.sender?.avatar}
                  alt="avatar"
                  className="w-8 h-8 object-cover md:w-9 md:h-9 self-start bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2"
                />
              ) : (
                <div className="w-9 h-9 self-start bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white mr-2">
                  {message?.sender?.name?.charAt(0)}
                </div>
              )
            )}
            
            <MessageContent message={message} isOwnMessage={isOwnMessage} />
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;