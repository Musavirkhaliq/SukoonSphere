import React, { useState, useEffect, useRef } from "react";
import defaultImg from '@/assets/images/Podcast/defaultImage.jpg';

const MusicPlayer = ({ currentAudio, currentPodcast, onNext, onPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentAudio) {
      audioRef.current.src = currentAudio;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    } else {
      setIsPlaying(false);
    }
  }, [currentAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const togglePlay = async () => {
    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error toggling play:", error);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
    }
  };

  const handleBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const toggleRandom = () => {
    setIsRandom(!isRandom);
  };

  const handleDownload = async () => {
    if (currentAudio) {
      try {
        const response = await fetch(currentAudio);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentPodcast?.title || 'audio'}.mp3`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading audio:', error);
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const CustomIcon = ({ name }) => {
    switch (name) {
      case 'play':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        );
      case 'pause':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        );
      case 'skip-back':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        );
      case 'skip-forward':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        );
      case 'shuffle':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
          </svg>
        );
      case 'repeat':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
          </svg>
        );
      case 'download':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 lg:sticky lg:top-24 lg:h-[500px] w-full lg:w-96 mx-auto ">
      <div 
        className="relative h-20 lg:h-full p-2 lg:p-6 bg-white/10 backdrop-blur-lg lg:rounded-xl text-white font-sans overflow-hidden"
        style={{
          backgroundImage: `url(${currentPodcast?.imageUrl || currentPodcast?.image || defaultImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay with backdrop blur */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md lg:rounded-xl"></div>

        {/* Mobile/Tablet View */}
        <div className="lg:hidden relative z-10 h-full flex items-center gap-4">
          <img
            src={currentPodcast?.imageUrl || currentPodcast?.image || defaultImg}
            alt={currentPodcast?.title || "Album art"}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm line-clamp-1">{currentPodcast?.title || "Select a podcast"}</h2>
            <p className="text-xs text-gray-300 line-clamp-1">{currentPodcast?.author || "Artist"}</p>
            <div className="mt-1 w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-white h-full rounded-full" 
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="text-white/80 hover:text-white"
              onClick={handleBackward}
              disabled={!currentAudio}
            >
              <CustomIcon name="skip-back" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white"
              disabled={!currentAudio}
            >
              <CustomIcon name={isPlaying ? 'pause' : 'play'} />
            </button>
            <button 
              className="text-white/80 hover:text-white"
              onClick={handleForward}
              disabled={!currentAudio}
            >
              <CustomIcon name="skip-forward" />
            </button>
          </div>
        </div>

        {/* Audio Element */}
        <audio 
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            if (isLooping) {
              audioRef.current.play().catch(console.error);
            } else if (onNext) {
              onNext();
            }
          }}
          onError={(e) => {
            console.error("Error playing audio:", e);
            setIsPlaying(false);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Desktop View */}
        <div className="hidden lg:block relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button 
              className={`bg-transparent border-0 ${currentAudio ? 'text-white hover:text-gray-200' : 'text-gray-400'} cursor-pointer p-1`}
              onClick={handleDownload}
              disabled={!currentAudio}
            >
              <CustomIcon name="download" />
            </button>
          </div>

          {/* Album Art */}
          <div className="relative group w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
            <img
              src={currentPodcast?.imageUrl || currentPodcast?.image || defaultImg}
              alt={currentPodcast?.title || "Album art"}
              className="absolute z-20 top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Song Info */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold mb-1">{currentPodcast?.title || "Select a podcast"}</h2>
            <p className="text-sm text-gray-300">{currentPodcast?.author || "Artist"}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <input
              type="range"
              value={currentTime}
              max={duration || 0}
              onChange={handleSeek}
              className="w-full h-1 mb-2 appearance-none bg-gray-600 rounded cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-300">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-6">
            <button 
              className={`bg-transparent border-0 ${isRandom ? 'text-white' : 'text-gray-400'} cursor-pointer p-1 hover:text-white transition-colors`}
              onClick={toggleRandom}
            >
              <CustomIcon name="shuffle" />
            </button>
            <button 
              className="bg-transparent border-0 text-gray-400 cursor-pointer p-1 hover:text-white transition-colors"
              onClick={handleBackward}
              disabled={!currentAudio}
            >
              <CustomIcon name="skip-back" />
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-white border-0 rounded-full text-[#1a2433] cursor-pointer hover:bg-gray-100 transition-colors"
              disabled={!currentAudio}
            >
              <CustomIcon name={isPlaying ? 'pause' : 'play'} />
            </button>
            <button 
              className="bg-transparent border-0 text-gray-400 cursor-pointer p-1 hover:text-white transition-colors"
              onClick={handleForward}
              disabled={!currentAudio}
            >
              <CustomIcon name="skip-forward" />
            </button>
            <button 
              className={`bg-transparent border-0 ${isLooping ? 'text-white' : 'text-gray-400'} cursor-pointer p-1 hover:text-white transition-colors`}
              onClick={toggleLoop}
            >
              <CustomIcon name="repeat" />
            </button>
          </div>

          {/* Bottom Text */}
          <div className="text-center">
            <p className="text-sm text-gray-300">
              {isLooping ? 'Loop: On' : isRandom ? 'Random: On' : 'Normal Play'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;