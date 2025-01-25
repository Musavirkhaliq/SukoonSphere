import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaHeadphones, FaPlay, FaCalendarAlt, FaClock } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import MusicPlayer from "@/components/sharedComponents/MusicPlayer";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShortDesc, setIsShortDesc] = useState(true);
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await customFetch.get(
          `/podcasts/playlists/${playlistId}`
        );
        setPlaylist(response.data.playlist);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handlePlayAudio = (podcast) => {
    console.log("Playing podcast:", podcast); // Debug log
    if (podcast && podcast.audioUrl) {
      // Check for audioUrl
      setCurrentAudio(podcast.audioUrl);
      setCurrentPodcast(podcast);
    } else {
      console.error("No audio URL found for podcast:", podcast);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Playlist not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Episode */}
            <div className="bg-[var(--primary)] rounded-2xl p-4 md:p-8 transform hover:scale-[1.02] transition-all duration-300 shadow-md">
              <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-6">
                  <img
                    className="md:w-48 md:h-48 w-32 h-32 rounded-2xl object-cover shadow-2xl ring-4 ring-white/10"
                    src={
                      playlist.imageUrl ||
                      "https://randomuser.me/api/portraits/women/1.jpg"
                    }
                    alt="Featured Episode"
                  />
                  <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          className="w-10 h-10 rounded-full border-2 border-white"
                          src={
                            playlist.userId?.avatar ||
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          }
                          alt="Host"
                        />
                        <span className="text-white/90 font-medium">
                          {playlist.userId?.name  || "Unknown Creator"}
                        </span>
                      </div>
                    <h1 className="text-xl md:text-2xl font-bold text-[var(--white-color)]">
                      {playlist.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-200">
                      <div className="flex items-center space-x-2">
                        <FaHeadphones className="text-indigo-300" />
                        <span>{playlist.episodes?.length || 0} Episodes</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p
                    className={`text-base text-[var(--grey--600)] leading-relaxed ${isShortDesc ? "line-clamp-3" : ""}`}
                  >
                    {playlist.description}
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

            {/* Episodes List */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Episodes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {playlist.episodes && playlist.episodes.length > 0 ? (
                  playlist.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="flex flex-row gap-4 p-4 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-white"
                      onMouseEnter={() => setIsHovered(episode.id)}
                      onMouseLeave={() => setIsHovered(null)}
                    >
                      <div
                        className="w-32 h-32 relative shadow-md rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => handlePlayAudio(episode)}
                      >
                        <img
                          src={episode.imageUrl || playlist.imageUrl}
                          alt={episode.title}
                          className="w-full h-full object-cover "
                        />
                        <div
                          className={`absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg transition-all duration-300 ${currentPodcast?.id === episode.id ? "opacity-100" : "opacity-0 hover:opacity-100"}`}
                        >
                          <FaPlay className="text-white text-4xl" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-base text-gray-800 line-clamp-2">
                          {episode.title}
                        </h4>
                        <div className="flex flex-col items-start  gap-4 mt-3 text-gray-500 text-sm">
                          <span className="flex items-center gap-1">
                            <FaHeadphones /> Episode No: {episode.episodeNo}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt />{" "}
                            {new Date(episode.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-2 text-center">
                    No episodes available
                  </p>
                )}
              </div>
            </div>
          </div>
          <MusicPlayer
            currentAudio={currentAudio}
            currentPodcast={currentPodcast}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetails;
