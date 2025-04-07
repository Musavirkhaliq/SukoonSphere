import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaPlay, FaPlus, FaTrash, FaArrowLeft, FaCheck, FaClock, FaFilm, FaTrophy } from "react-icons/fa";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import AddVideoToPlaylistModel from "@/pages/contributors/models/AddVideoToPlaylistModel";
import PlaylistCompletionModal from "@/components/mediaLibrary/videos/PlaylistCompletionModal";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchHistory, setWatchHistory] = useState({});
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortOption, setSortOption] = useState('default'); // default, completed, inProgress
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Fetch playlist details
  const fetchPlaylist = async () => {
    try {
      setIsLoading(true);
      const { data } = await customFetch.get(`/video-playlists/details/${playlistId}`);
      setPlaylist(data.playlist);

      // If user is logged in, fetch watch history
      if (user) {
        try {
          const historyResponse = await customFetch.get("/videos/watch-history");
          const historyMap = {};

          // Add debug logging
          console.log('Raw watch history data:', historyResponse.data.watchHistory);

          historyResponse.data.watchHistory.forEach(item => {
            // Skip items with null or undefined videoId
            if (!item || !item.videoId) {
              console.warn('Skipping watch history item with missing videoId:', item);
              return;
            }

            try {
              // Check if videoId is an object (populated) or a string
              const videoId = typeof item.videoId === 'object' ?
                (item.videoId._id || null) : // Handle potential null _id
                item.videoId;

              // Skip if we couldn't extract a valid videoId
              if (!videoId) {
                console.warn('Skipping watch history item with invalid videoId:', item);
                return;
              }

              // Ensure percentage is a valid number
              const percentage = parseFloat(item.watchPercentage) || 0;

              // Store both percentage and completion status
              historyMap[videoId] = {
                percentage: percentage,
                completed: item.completedWatching || false,
                status: item.status || (
                  percentage >= 90 ? 'completed' :
                  percentage > 0 ? 'in-progress' : 'not-started'
                )
              };

              // Log for debugging
              if (isNaN(percentage)) {
                console.warn('Invalid percentage value:', item.watchPercentage, 'for video:', videoId);
              }
            } catch (err) {
              console.error('Error processing watch history item:', err, item);
            }
          });

          console.log('Processed watch history map:', historyMap);
          setWatchHistory(historyMap);


        } catch (error) {
          console.error("Error fetching watch history:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching playlist:", error);
      toast.error("Failed to load playlist");
      navigate("/all-videos/playlists");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId, user]);

  // Handle video removal
  const handleRemoveVideo = async (videoId) => {
    if (!confirm("Are you sure you want to remove this video from the playlist?")) {
      return;
    }

    try {
      await customFetch.delete(`/video-playlists/${playlistId}/remove-video/${videoId}`);
      toast.success("Video removed from playlist");
      fetchPlaylist(); // Refresh playlist data
    } catch (error) {
      console.error("Error removing video:", error);
      toast.error("Failed to remove video");
    }
  };

  // Handle playlist deletion
  const handleDeletePlaylist = async () => {
    if (!confirm("Are you sure you want to delete this playlist? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);
      await customFetch.delete(`/video-playlists/delete/${playlistId}`);
      toast.success("Playlist deleted successfully");
      navigate("/all-videos/playlists");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Failed to delete playlist");
      setIsDeleting(false);
    }
  };

  // Calculate playlist progress and stats
  const calculateProgress = () => {
    if (!playlist || !playlist.videos || playlist.videos.length === 0) {
      return {
        progress: 0,
        completedCount: 0,
        inProgressCount: 0,
        notStartedCount: 0
      };
    }

    const completedVideos = playlist.videos.filter(video => {
      // Skip videos with no ID
      if (!video || !video._id) return false;

      // Get watch history for this video (with fallback)
      const videoProgress = watchHistory[video._id] || { percentage: 0, completed: false, status: 'not-started' };

      // Check if completed
      return videoProgress.completed || videoProgress.percentage >= 90;
    });

    const inProgressVideos = playlist.videos.filter(video => {
      // Skip videos with no ID
      if (!video || !video._id) return false;

      // Get watch history for this video (with fallback)
      const videoProgress = watchHistory[video._id] || { percentage: 0, completed: false, status: 'not-started' };

      // Check if in progress
      return !videoProgress.completed &&
             videoProgress.percentage > 0 &&
             videoProgress.percentage < 90;
    });

    const notStartedVideos = playlist.videos.filter(video => {
      // Skip videos with no ID
      if (!video || !video._id) return false;

      // Check if not started
      return !watchHistory[video._id] ||
             (!watchHistory[video._id].completed && watchHistory[video._id].percentage === 0);
    });

    return {
      progress: Math.round((completedVideos.length / playlist.videos.length) * 100),
      completedCount: completedVideos.length,
      inProgressCount: inProgressVideos.length,
      notStartedCount: notStartedVideos.length
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Playlist not found</h2>
        <Link to="/all-videos/playlists" className="btn-2">
          <FaArrowLeft className="mr-2" />
          Back to Playlists
        </Link>
      </div>
    );
  }

  const isAuthor = user && playlist.author && user._id === playlist.author._id;
  const { progress, completedCount, inProgressCount, notStartedCount } = calculateProgress();

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/all-videos/playlists"
          className="inline-flex items-center text-[var(--primary)] hover:underline"
        >
          <FaArrowLeft className="mr-2" />
          Back to Playlists
        </Link>
      </div>

      {/* Playlist Header */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
        <div className="flex flex-col lg:flex-row">
          {/* Cover Image (Left Side) */}
          <div className="relative lg:w-2/5">
            <div className="aspect-video lg:aspect-auto lg:h-full">
              <img
                src={playlist.coverImage}
                alt={playlist.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent lg:hidden"></div>
          </div>

          {/* Playlist Info (Right Side) */}
          <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-between relative">
            {/* Title and Description */}
            <div>
              <div className="flex items-center mb-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mr-3">{playlist.title}</h1>
                {playlist.tags && playlist.tags.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {playlist.tags[0]}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6">{playlist.description}</p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaFilm className="mr-2 text-gray-400" />
                  <span>{playlist.videos.length} {playlist.videos.length === 1 ? "video" : "videos"}</span>
                </div>

                {user && (
                  <div className="flex items-center">
                    <FaCheck className="mr-2 text-green-500" />
                    <span>
                      {playlist.videos.filter(video => watchHistory[video._id] && watchHistory[video._id] >= 90).length} completed
                    </span>
                  </div>
                )}

                {/* Author info */}
                {playlist.author && (
                  <div className="flex items-center ml-auto">
                    <img
                      src={playlist.author.avatar || "https://via.placeholder.com/40"}
                      alt={playlist.author.name}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                    <span>Created by {playlist.author.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar (for logged in users) */}
            {user && playlist.videos.length > 0 && (
              <div className="mb-6">
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Your progress
                    </span>
                    <span className="text-sm text-gray-500">
                      {progress}% complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[var(--primary)] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Completion Summary */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div
                    className={`p-2 rounded-lg ${completedCount > 0 ? 'bg-green-50 cursor-pointer hover:bg-green-100' : 'bg-green-50'}`}
                    onClick={() => completedCount > 0 && setSortOption('completed')}
                  >
                    <div className="text-lg font-bold text-green-600">{completedCount}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div
                    className={`p-2 rounded-lg ${inProgressCount > 0 ? 'bg-yellow-50 cursor-pointer hover:bg-yellow-100' : 'bg-yellow-50'}`}
                    onClick={() => inProgressCount > 0 && setSortOption('inProgress')}
                  >
                    <div className="text-lg font-bold text-yellow-600">{inProgressCount}</div>
                    <div className="text-xs text-gray-600">In Progress</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-gray-600">{notStartedCount}</div>
                    <div className="text-xs text-gray-600">Not Started</div>
                  </div>
                </div>

                {/* Completion Badge */}
                {progress === 100 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <FaTrophy className="text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Playlist Completed!</h4>
                      <p className="text-sm text-gray-600">You've watched all videos in this playlist.</p>
                    </div>
                    <button
                      onClick={() => setShowCompletionModal(true)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                    >
                      Celebrate
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              {playlist.videos.length > 0 && (
                <Link
                  to={`/all-videos/video/${playlist.videos[0]._id}`}
                  className="btn-2 flex items-center"
                >
                  <FaPlay className="mr-2" />
                  Start Learning
                </Link>
              )}

              {/* Admin controls */}
              {isAuthor && (
                <>
                  <button
                    onClick={() => setShowAddVideoModal(true)}
                    className="btn-outline flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Add Video
                  </button>
                  <button
                    onClick={handleDeletePlaylist}
                    disabled={isDeleting}
                    className="btn-red flex items-center"
                  >
                    <FaTrash className="mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="border-b px-6 py-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-800">
              Course Content
            </h2>
            <div className="text-sm text-gray-500">
              {playlist.videos.length} {playlist.videos.length === 1 ? "lesson" : "lessons"}
            </div>
          </div>

          {/* Filter/Sort Options */}
          {user && playlist.videos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortOption('default')}
                className={`text-xs px-3 py-1.5 rounded-full border ${sortOption === 'default' ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                All Videos
              </button>
              <button
                onClick={() => setSortOption('completed')}
                className={`text-xs px-3 py-1.5 rounded-full border flex items-center ${sortOption === 'completed' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                <FaCheck className="mr-1" /> Completed
              </button>
              <button
                onClick={() => setSortOption('inProgress')}
                className={`text-xs px-3 py-1.5 rounded-full border flex items-center ${sortOption === 'inProgress' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                <FaClock className="mr-1" /> In Progress
              </button>
            </div>
          )}
        </div>

        {playlist.videos.length === 0 ? (
          <div className="text-center p-12 text-gray-500">
            <div className="mb-4">
              <FaFilm className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-lg">This playlist doesn't have any videos yet.</p>
            </div>
            {isAuthor && (
              <button
                onClick={() => setShowAddVideoModal(true)}
                className="btn-2 flex items-center mx-auto"
              >
                <FaPlus className="mr-2" />
                Add Video
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {playlist.videos
              .filter(video => {
                // Skip videos with no ID
                if (!video || !video._id) return false;

                // Apply filters based on sort option
                const videoProgress = watchHistory[video._id] || { percentage: 0, completed: false, status: 'not-started' };

                if (sortOption === 'completed') {
                  return user && (videoProgress.completed || videoProgress.percentage >= 90);
                } else if (sortOption === 'inProgress') {
                  return user && !videoProgress.completed && videoProgress.percentage > 0 && videoProgress.percentage < 90;
                }
                return true; // Default: show all
              })
              .map((video, index) => {
              // Calculate completion status
              const videoProgress = watchHistory[video._id] || { percentage: 0, completed: false, status: 'not-started' };
              const isCompleted = user && (videoProgress.completed || videoProgress.percentage >= 90);
              const isInProgress = user && !videoProgress.completed && videoProgress.percentage > 0 && videoProgress.percentage < 90;

              return (
                <div
                  key={video._id}
                  className={`p-4 transition-colors ${isCompleted ? 'bg-green-50 hover:bg-green-100' : isInProgress ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-start sm:items-center">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mr-4">
                      {isCompleted ? (
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md animate-pulse-once">
                          <FaCheck />
                        </div>
                      ) : isInProgress ? (
                        <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                          <FaClock />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-medium text-gray-800 mb-1 sm:mb-0">{video.title}</h3>

                        <div className="flex items-center space-x-3">
                          {/* Progress Badge */}
                          {isCompleted && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium flex items-center">
                              <FaCheck className="mr-1" /> Completed
                            </span>
                          )}
                          {isInProgress && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              In Progress ({Math.round(videoProgress.percentage)}%)
                            </span>
                          )}

                          {/* Watch Button */}
                          <Link
                            to={`/all-videos/video/${video._id}`}
                            className="btn-2 btn-sm flex items-center"
                          >
                            <FaPlay className="mr-1" />
                            {isCompleted ? "Rewatch" : isInProgress ? "Continue" : "Start"}
                          </Link>

                          {/* Admin Controls */}
                          {isAuthor && (
                            <button
                              onClick={() => handleRemoveVideo(video._id)}
                              className="btn-red btn-sm flex items-center"
                            >
                              <FaTrash className="mr-1" />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>

                      {/* Progress Bar */}
                      {user && videoProgress.percentage > 0 && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                          <div
                            className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-[var(--primary)]'} transition-all duration-500`}
                            style={{ width: `${videoProgress.percentage}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Video Modal */}
      {showAddVideoModal && (
        <AddVideoToPlaylistModel
          setShowModal={setShowAddVideoModal}
          playlistId={playlistId}
          onSuccess={fetchPlaylist}
        />
      )}

      {/* Completion Celebration Modal */}
      {showCompletionModal && (
        <PlaylistCompletionModal
          playlist={playlist}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </div>
  );
};

export default PlaylistDetails;
