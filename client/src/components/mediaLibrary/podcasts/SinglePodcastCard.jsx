import PostActions from "@/components/shared/PostActions";
import DeleteModal from "@/components/shared/DeleteModal";
import EditPodcastModel from "@/pages/contributors/models/EditPodcastModel";
import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaUser,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";

const SinglePodcastCard = ({ podcast, fetchData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const audioRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    return "0:00";
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition =
      (e.pageX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(volumeRef.current || 1);
      setIsMuted(false);
    } else {
      volumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const deletePodcast = async () => {
    try {
      await customFetch.delete(`/podcasts/${podcast._id}`);
      toast.success("Podcast deleted successfully");
      await fetchData();
    } catch (error) {
      console.error("Error deleting podcast:", error);
      toast.error(error?.response?.data?.msg || "Failed to delete podcast");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-full mb-4 overflow-hidden border border-gray-100">
      <div className="flex flex-col md:flex-row md:h-[320px]">
        {/* Left side - Image */}
        <div className="w-full md:w-72 h-48 md:h-full relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100 z-10" />
          <div className="absolute inset-0">
            <img
              src={podcast.imageUrl}
              alt={podcast.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 p-4 md:p-5 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 pr-4">
              <Link
                to={`/podcasts/episode/${podcast._id}`}
                className="block group"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {podcast.title}
                </h3>
              </Link>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                {podcast.description}
              </p>

              {/* Episode Info */}
              <div className="flex flex-wrap items-center gap-2">
                {podcast.episodeNo && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-full text-xs font-medium">
                    Episode {podcast.episodeNo}
                  </span>
                )}
                {podcast.duration && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    {podcast.duration}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <PostActions
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          </div>

          {/* Audio Controls */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mt-auto">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div
                className="h-1.5 bg-white rounded-full cursor-pointer relative overflow-hidden group shadow-sm"
                onClick={handleProgressClick}
              >
                <div
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                />
                <div className="absolute h-full w-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex justify-between text-xs text-gray-600 font-medium px-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-3">
                <button
                  onClick={togglePlay}
                  className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-md transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {isPlaying ? (
                    <FaPause className="w-4 h-4" />
                  ) : (
                    <FaPlay className="w-4 h-4 ml-0.5" />
                  )}
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-white/80 transition-all focus:outline-none"
                >
                  {isMuted || volume === 0 ? (
                    <FaVolumeMute className="w-4 h-4" />
                  ) : (
                    <FaVolumeUp className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={podcast.audioUrl}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
        className="hidden"
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deletePodcast}
        title="Delete Podcast"
        message="Are you sure you want to delete this podcast? This action cannot be undone."
      />

      {showEditModal && (
        <EditPodcastModel
          setShowModal={setShowEditModal}
          podcast={podcast}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default SinglePodcastCard;
