import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaSpinner, FaList } from 'react-icons/fa';
import VideoTracker from '../../../utils/videoTracker';

const VideoRecommendations = ({ videoId, currentVideo }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!videoId) return;

      try {
        setLoading(true);
        const data = await VideoTracker.getRecommendations(videoId);
        setRecommendations(data);
      } catch (err) {
        console.error('Error fetching video recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [videoId]);

  // Group recommendations by type
  const playlistVideos = recommendations.filter(video => video.recommendationType === 'playlist');
  const similarVideos = recommendations.filter(video => video.recommendationType === 'similar');
  const popularVideos = recommendations.filter(video => video.recommendationType === 'popular');

  // Check if this video is part of a playlist
  const isInPlaylist = playlistVideos.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner className="animate-spin text-[var(--primary)] text-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No recommendations available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Playlist Videos */}
      {playlistVideos.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">More in this playlist</h3>
            {/* Find the playlist ID from the first video */}
            {playlistVideos[0]?.playlistId && (
              <Link
                to={`/all-videos/playlist/${playlistVideos[0].playlistId}`}
                className="text-[var(--primary)] hover:underline flex items-center text-sm"
              >
                <FaList className="mr-1" />
                View full playlist
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {playlistVideos.map(video => (
              <RecommendationCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Similar Videos */}
      {similarVideos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Similar Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {similarVideos.map(video => (
              <RecommendationCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Popular Videos */}
      {popularVideos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Popular Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularVideos.map(video => (
              <RecommendationCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Recommendation Card Component
const RecommendationCard = ({ video }) => {
  return (
    <Link
      to={`/all-videos/video/${video._id}`}
      className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative w-24 h-16 flex-shrink-0">
        <img
          src={video.coverImage}
          alt={video.title}
          className="w-full h-full object-cover rounded-md"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
          <FaPlay className="text-white text-sm" />
        </div>
      </div>

      {/* Video Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{video.title}</h4>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{video.description}</p>
      </div>
    </Link>
  );
};

export default VideoRecommendations;
