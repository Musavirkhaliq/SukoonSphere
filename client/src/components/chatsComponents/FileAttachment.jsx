// components/chat/FileAttachment.jsx
import { useState } from "react";
import { IoDownload } from "react-icons/io5";
import { BsFileEarmarkText, BsImage, BsFileEarmarkMusic } from "react-icons/bs";

const baseUrl =  "http://localhost:5100";

const DownloadButton = ({ filePath, fileName, className = "" }) => (
  <a
    href={`${baseUrl}${filePath}`}
    download={fileName}
    className={`group flex items-center gap-2 px-2 py-1 bg-gray-800 bg-opacity-70 rounded hover:bg-opacity-90 transition-all ${className}`}
    onClick={(e) => e.stopPropagation()}
  >
    <IoDownload className="text-white text-sm" />
    <span className="text-white text-xs">Download</span>
  </a>
);

const FileInfo = ({ fileName, fileSize, className = "" }) => (
  <div className={`text-xs text-gray-200 ${className}`}>
    <p className="truncate max-w-[200px]">{fileName}</p>
    <p>{(fileSize / 1024).toFixed(1)} KB</p>
  </div>
);

const FileAttachment = ({ attachment }) => {
  const [imageError, setImageError] = useState(false);

  switch (attachment.fileType) {
    case 'image':
      return (
        <div className="relative group">
          {imageError ? (
            <div className="w-64 h-64 bg-gray-800 rounded flex flex-col items-center justify-center p-4">
              <BsImage className="text-gray-400 text-4xl mb-2" />
              <span className="text-gray-400 text-sm text-center">Failed to load image</span>
              <FileInfo fileName={attachment.fileName} fileSize={attachment.fileSize} className="mt-2 text-center" />
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
                <DownloadButton filePath={attachment.filePath} fileName={attachment.fileName} />
              </div>
              <FileInfo fileName={attachment.fileName} fileSize={attachment.fileSize} className="mt-1" />
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
              <DownloadButton filePath={attachment.filePath} fileName={attachment.fileName} />
            </div>
          </div>
          <FileInfo fileName={attachment.fileName} fileSize={attachment.fileSize} className="mt-1" />
        </div>
      );
    
    case 'audio':
      return (
        <div className="bg-gray-800 rounded-lg p-3 max-w-64">
          <div className="flex items-center gap-3 mb-2">
            <BsFileEarmarkMusic className="text-gray-400 text-2xl" />
            <FileInfo fileName={attachment.fileName} fileSize={attachment.fileSize} />
          </div>
          <audio
            src={`${baseUrl}${attachment.filePath}`}
            className="min-w-full w-full"
            controls
          />
          <div className="mt-2 flex justify-end">
            <DownloadButton filePath={attachment.filePath} fileName={attachment.fileName} />
          </div>
        </div>
      );
    
    case 'document':
    default:
      return (
        <div className="bg-gray-800 rounded-lg p-3 max-w-64">
          <div className="flex items-center gap-3 mb-2">
            <BsFileEarmarkText className="text-gray-400 text-2xl" />
            <FileInfo fileName={attachment.fileName} fileSize={attachment.fileSize} />
          </div>
          <div className="flex justify-end">
            <DownloadButton filePath={attachment.filePath} fileName={attachment.fileName} />
          </div>
        </div>
      );
  }
};

export default FileAttachment;