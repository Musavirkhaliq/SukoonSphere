import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import defaultImg from "@/assets/images/Podcast/defaultImage.jpg";

const SingleEpisode = () => {
  const { episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Audio player states
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [episodeUser, setEpisodeUser] = useState(null);
  const [isShortDesc, setIsShortDesc] = useState(true);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await customFetch.get(`/podcasts/${episodeId}`);
        setEpisode(response.data.podcast);
        setEpisodeUser(response.data.user);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchEpisode();
  }, [episodeId]);

  // Audio player functions
  const togglePlayPause = async () => {
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

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
  };

  const handleDownload = async () => {
    if (episode.audioUrl) {
      try {
        const response = await fetch(episode.audioUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${episode.title || 'audio'}.mp3`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading audio:', error);
      }
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!episode) return null;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Description Card */}
      <div className=" lg:col-span-2 bg-[var(--primary)] rounded-2xl p-4 md:p-8 shadow-md ">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-6">
            <img
              className="md:w-48 md:h-48 w-32 h-32 rounded-2xl object-cover shadow-2xl ring-4 ring-white/10"
              src={episode.imageUrl || defaultImg}
              alt="Episode"
            />
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src={
                    episodeUser?.avatar ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  alt="Host"
                />
                <span className="text-white/90 font-medium">
                  {episodeUser?.name || "Unknown Creator"}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-[var(--white-color)]">
                {episode.title}
              </h1>
            </div>
          </div>
          <div className="space-y-1">
            <p
              className={`text-base text-[var(--grey--600)] leading-relaxed ${isShortDesc ? "line-clamp-3" : ""}`}
            >
              {episode.description}
            </p>
            <button
              onClick={() => setIsShortDesc(!isShortDesc)}
              className="text-sm text-indigo-300 hover:text-indigo-400 transition-colors duration-200"
            >
              {isShortDesc ? "Show More" : "Show Less"}
            </button>
          </div>
        </div>
      </div>
      <div className="fixed bottom-16 left-0 right-0 lg:sticky lg:top-24 lg:h-[500px] w-full lg:w-96 mx-auto">
        <div
          className="relative h-20 lg:h-full p-2 lg:p-6 bg-white/10 backdrop-blur-lg lg:rounded-xl text-white font-sans overflow-hidden"
          style={{
            backgroundImage: `url(${episode.imageUrl || defaultImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay with backdrop blur */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md lg:rounded-xl"></div>

          {/* Mobile/Tablet View */}
          <div className="lg:hidden relative z-10 h-full flex items-center gap-4">
            <img
              src={episode.imageUrl || defaultImg}
              alt={episode.title || "Album art"}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-sm line-clamp-1">
                {episode.title || "Select a podcast"}
              </h2>
              <p className="text-xs text-gray-300 line-clamp-1">
                {episodeUser?.name || "Artist"}
              </p>
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
                onClick={() => {
                  audioRef.current.currentTime = Math.max(0, currentTime - 10);
                }}
                disabled={!episode.audioUrl}
              >
                <FaBackward />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white"
                disabled={!episode.audioUrl}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className="text-white/80 hover:text-white"
                onClick={() => {
                  audioRef.current.currentTime = Math.min(
                    duration,
                    currentTime + 10
                  );
                }}
                disabled={!episode.audioUrl}
              >
                <FaForward />
              </button>
            </div>
          </div>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            src={episode.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            loop={isLooping}
            className="hidden"
          />

          {/* Desktop View */}
          <div className="hidden lg:block relative z-10">
            {/* Album Art */}
            <div className="relative group w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
              <img
                src={episode.imageUrl || defaultImg}
                alt={episode.title || "Album art"}
                className="absolute z-20 top-0 left-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Song Info */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold mb-1">
                {episode.title || "Select a podcast"}
              </h2>
              <p className="text-sm text-gray-300">
                {episodeUser?.name || "Artist"}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
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
            <div className="flex justify-between items-center mb-4">
              <button 
                className={`bg-transparent border-0 ${episode.audioUrl ? 'text-white hover:text-gray-200' : 'text-gray-400'} cursor-pointer p-1`}
                onClick={handleDownload}
                disabled={!episode.audioUrl}
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
              </button>
              <button
                className="bg-transparent border-0 text-gray-400 cursor-pointer p-1 hover:text-white transition-colors"
                onClick={() => {
                  audioRef.current.currentTime = Math.max(0, currentTime - 10);
                }}
                disabled={!episode.audioUrl}
              >
                <FaBackward />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 flex items-center justify-center bg-white border-0 rounded-full text-[#1a2433] cursor-pointer hover:bg-gray-100 transition-colors"
                disabled={!episode.audioUrl}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className="bg-transparent border-0 text-gray-400 cursor-pointer p-1 hover:text-white transition-colors"
                onClick={() => {
                  audioRef.current.currentTime = Math.min(
                    duration,
                    currentTime + 10
                  );
                }}
                disabled={!episode.audioUrl}
              >
                <FaForward />
              </button>
              <button 
                className={`bg-transparent border-0 ${isLooping ? 'text-white' : 'text-gray-400'} cursor-pointer p-1 hover:text-white transition-colors`}
                onClick={toggleLoop}
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                </svg>
              </button>
            </div>
            {/* Play Mode Indicator */}
            <div className="text-center text-sm text-gray-300 ">
              {isLooping ? "Loop" : "Normal"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEpisode;
