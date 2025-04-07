import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaShare } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';

const VideoReactions = ({ videoId, videoTitle }) => {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Fetch video data including likes
  const fetchVideoData = async () => {
    try {
      const { data } = await customFetch.get(`/videos/video/${videoId}`);
      if (data.video) {
        setLikeCount(data.video.likes?.length || 0);
        setIsLiked(user && data.video.likes?.includes(user._id));
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchVideoData();
    }
  }, [videoId, user]);

  // Handle like
  const handleLike = async () => {
    if (!user) {
      toast.info('Please log in to like videos');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const { data } = await customFetch.patch(`/videos/video/${videoId}/like`);
      setIsLiked(!isLiked);
      setLikeCount(data.likes.length);

      toast.success(isLiked ? 'Video unliked' : 'Video liked');
    } catch (error) {
      console.error('Error liking video:', error);
      toast.error('Failed to like video');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle share
  const handleShare = async (platform) => {
    const videoUrl = `${window.location.origin}/all-videos/video/${videoId}`;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(`Check out this video: ${videoTitle}`)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this video: ${videoTitle} ${videoUrl}`)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(videoUrl);
          toast.success('Link copied to clipboard!');
          setShowShareOptions(false);
          return;
        } catch (err) {
          toast.error('Failed to copy link');
          return;
        }
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaThumbsUp className="text-xl" />
            <span>{likeCount > 0 ? likeCount : ''} Like{likeCount !== 1 ? 's' : ''}</span>
          </button>
        </div>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaShare className="mr-2" />
            Share
          </button>

          {/* Share Options Dropdown */}
          {showShareOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
              <div className="p-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                >
                  <span className="w-6 h-6 mr-2 flex items-center justify-center text-blue-600">
                    <i className="fab fa-facebook-f"></i>
                  </span>
                  Facebook
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                >
                  <span className="w-6 h-6 mr-2 flex items-center justify-center text-blue-400">
                    <i className="fab fa-twitter"></i>
                  </span>
                  Twitter
                </button>

                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                >
                  <span className="w-6 h-6 mr-2 flex items-center justify-center text-green-500">
                    <i className="fab fa-whatsapp"></i>
                  </span>
                  WhatsApp
                </button>

                <button
                  onClick={() => handleShare('copy')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                >
                  <span className="w-6 h-6 mr-2 flex items-center justify-center text-gray-600">
                    <i className="fas fa-link"></i>
                  </span>
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total Likes */}
      {likeCount > 0 && (
        <div className="mt-3 text-sm text-gray-500 border-t pt-2">
          {likeCount} {likeCount === 1 ? 'person has' : 'people have'} liked this video
        </div>
      )}
    </div>
  );
};

export default VideoReactions;
