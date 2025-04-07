import VideoCard from "@/components/mediaLibrary/videos/VideoCard";
import React, { useState, useEffect } from "react";
import { useLoaderData, Link } from "react-router-dom";
import { FaFilm, FaPlay, FaChevronRight } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";

const PlaylistVideos = () => {
  const { videos } = useLoaderData();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [watchHistory, setWatchHistory] = useState({});

  // Group videos by playlist
  useEffect(() => {
    if (videos) {
      // Find all unique playlist videos (type: "playlist")
      const playlistVideos = videos.filter(video => video.type === "playlist");

      // Create a map of playlists
      const playlistsMap = {};

      // Add each playlist video as a playlist
      playlistVideos.forEach(video => {
        playlistsMap[video._id] = {
          _id: video._id,
          title: video.title,
          description: video.description,
          coverImage: video.coverImage,
          author: video.author,
          videos: []
        };
      });

      // Find all videos that belong to playlists
      const childVideos = videos.filter(video => video.playlistId);

      // Add child videos to their respective playlists
      childVideos.forEach(video => {
        if (playlistsMap[video.playlistId]) {
          playlistsMap[video.playlistId].videos.push(video);
        }
      });

      // Convert map to array
      const playlistsArray = Object.values(playlistsMap);
      setPlaylists(playlistsArray);
      setIsLoading(false);
    }
  }, [videos]);

  // Fetch watch history for logged-in users
  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!user) return;

      try {
        const { data } = await customFetch.get('/videos/watch-history');

        // Create a map of videoId -> watchPercentage
        const historyMap = {};
        data.watchHistory.forEach(item => {
          historyMap[item.videoId._id] = item.watchPercentage;
        });

        setWatchHistory(historyMap);
      } catch (error) {
        console.error('Error fetching watch history:', error);
      }
    };

    fetchWatchHistory();
  }, [user]);

  const hasPlaylists = playlists && playlists.length > 0;

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="col-span-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : hasPlaylists ? (
        <div className="space-y-8">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Playlist Header */}
              <div className="relative">
                <img
                  src={playlist.coverImage}
                  alt={playlist.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <h2 className="text-2xl font-bold text-white">{playlist.title}</h2>
                  <p className="text-white/80 line-clamp-2">{playlist.description}</p>
                </div>
              </div>

              {/* Playlist Videos */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Videos in this playlist</h3>

                <div className="space-y-3">
                  {playlist.videos.map((video, index) => (
                    <Link
                      key={video._id}
                      to={`/all-videos/video/${video._id}`}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Video Number */}
                      <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center mr-3">
                        {index + 1}
                      </div>

                      {/* Thumbnail */}
                      <div className="relative w-24 h-16 flex-shrink-0 mr-3">
                        <img
                          src={video.coverImage}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                          <FaPlay className="text-white" />
                        </div>

                        {/* Watch Progress Indicator (if user is logged in) */}
                        {user && watchHistory[video._id] > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                            <div
                              className="h-full bg-[var(--primary)]"
                              style={{ width: `${watchHistory[video._id]}%` }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{video.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1">{video.description}</p>

                        {/* Watch Progress Text (if user is logged in) */}
                        {user && watchHistory[video._id] > 0 && (
                          <p className="text-xs text-[var(--primary)] mt-1">
                            {watchHistory[video._id] >= 90 ? 'Watched' : `${Math.round(watchHistory[video._id])}% watched`}
                          </p>
                        )}
                      </div>

                      <FaChevronRight className="text-gray-400 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl p-8 space-y-4 text-center">
          <div className="bg-blue-100 p-6 rounded-full">
            <FaFilm className="w-16 h-16 text-[var(--primary)] animate-pulse" />
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-[var(--grey--900)] mb-3">
              Empty Playlist
            </h2>
            <p className="text-[var(--grey--800)] mb-6">
              No playlists found. This collection is currently empty.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistVideos;
