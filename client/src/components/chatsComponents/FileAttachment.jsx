// components/chat/FileAttachment.jsx
import { useState, useRef, useEffect } from "react";
import { IoDownload, IoPlay, IoPause, IoVolumeMedium, IoVolumeMute } from "react-icons/io5";
import { BsFileEarmarkText, BsImage, BsFileEarmarkMusic } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import "./VoiceMessagePlayer.css";

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
      // Check if this is a voice message (based on filename or content type)
      const isVoiceMessage = attachment.fileName.includes('voice-message') ||
                           attachment.fileName.endsWith('.webm') ||
                           attachment.mimeType?.includes('webm');

      if (isVoiceMessage) {
        return <VoiceMessagePlayer attachment={attachment} baseUrl={baseUrl} />;
      }

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

// Voice Message Player Component
const VoiceMessagePlayer = ({ attachment, baseUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume;

    // Event listeners
    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const setAudioEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', setAudioEnd);

    // Cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', setAudioEnd);
    };
  }, []);

  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }

    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Handle progress bar click
  const handleProgressBarClick = (e) => {
    const progressBar = progressBarRef.current;
    if (!progressBar || !audioRef.current) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
    const newTime = pos * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Format time (seconds to MM:SS)
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-message-container">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={`${baseUrl}${attachment.filePath}`}
        preload="metadata"
        className="hidden"
      />

      {/* Voice message header */}
      <div className="voice-message-header">
        <div className="voice-message-icon">
          <FaMicrophone />
        </div>
        <div className="voice-message-info">
          <div className="voice-message-title">Voice Message</div>
          <div className="voice-message-duration">{formatTime(duration)}</div>
        </div>
      </div>

      {/* Player controls */}
      <div className="voice-player-controls">
        {/* Progress bar */}
        <div
          className="voice-progress-bar"
          ref={progressBarRef}
          onClick={handleProgressBarClick}
        >
          <div
            className="voice-progress-fill"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>

        {/* Time display */}
        <div className="voice-time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="voice-controls">
          <button
            className="voice-play-button"
            onClick={togglePlay}
          >
            {isPlaying ? <IoPause size={18} /> : <IoPlay size={18} className="ml-1" />}
          </button>

          <div className="voice-volume-controls">
            <button
              className="voice-volume-button"
              onClick={toggleMute}
            >
              {isMuted ? <IoVolumeMute size={20} /> : <IoVolumeMedium size={20} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="voice-volume-slider"
            />
          </div>

          <DownloadButton
            filePath={attachment.filePath}
            fileName={attachment.fileName}
            className="voice-download-button"
          />
        </div>
      </div>
    </div>
  );
};

export default FileAttachment;