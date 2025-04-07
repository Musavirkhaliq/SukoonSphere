import React, { useState, useEffect, useRef } from 'react';
import { FaThumbsUp, FaThumbsDown, FaShare, FaEllipsisH } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';

const VideoReactions = ({ videoId, videoTitle }) => {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Refs for dropdown menus
  const shareMenuRef = useRef(null);
  const moreOptionsMenuRef = useRef(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
      if (moreOptionsMenuRef.current && !moreOptionsMenuRef.current.contains(event.target)) {
        setShowMoreOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle like
  const handleLike = async () => {
    if (!user) {
      toast.info('Please log in to like videos');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      // Store current state before API call
      const wasLiked = isLiked;

      // Optimistically update UI
      setIsLiked(!wasLiked);
      setLikeCount(prevCount => wasLiked ? prevCount - 1 : prevCount + 1);

      // Make API call
      const { data } = await customFetch.patch(`/videos/video/${videoId}/like`);

      // Update with actual server data
      setLikeCount(data.likes.length);

      // Show success message
      toast.success(wasLiked ? 'Video unliked' : 'Video liked');
    } catch (error) {
      console.error('Error liking video:', error);
      toast.error('Failed to like video');

      // Revert optimistic update on error
      setIsLiked(isLiked);
      fetchVideoData(); // Refresh data from server
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
    <div className="py-2">
      {/* YouTube-style reaction bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Like/Dislike group */}
        <div className="flex items-center">
          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center px-3 py-1.5 ${isLiked ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-200 transition-colors relative ${isLoading ? 'opacity-70' : ''}`}
              aria-label="Like video"
              disabled={isLoading}
            >
              <FaThumbsUp className={`${isLiked ? 'text-blue-600 fill-current' : 'text-gray-700'} mr-2 transition-colors`} />
              <span className="text-sm font-medium">{likeCount > 0 ? likeCount : '0'}</span>
              {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-30">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="h-5 w-px bg-gray-300"></div>

            {/* Dislike button (visual only) */}
            <button
              className="flex items-center px-3 py-1.5 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="Dislike video"
              onClick={() => {
                if (!user) {
                  toast.info('Please log in to dislike videos');
                  return;
                }
                toast.info('Dislike feature coming soon!');
              }}
            >
              <FaThumbsDown className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Share Button */}
        <div className="relative" ref={shareMenuRef}>
          <button
            onClick={() => {
              setShowShareOptions(!showShareOptions);
              setShowMoreOptions(false);
            }}
            className="flex items-center px-3 py-1.5 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Share video"
          >
            <FaShare className="mr-2" />
            <span className="text-sm font-medium">Share</span>
          </button>

          {/* Share Options Dropdown */}
          {showShareOptions && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
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

        {/* More options button */}
        <div className="relative" ref={moreOptionsMenuRef}>
          <button
            onClick={() => {
              setShowMoreOptions(!showMoreOptions);
              setShowShareOptions(false);
            }}
            className="flex items-center px-3 py-1.5 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="More options"
          >
            <FaEllipsisH />
          </button>

          {/* More Options Dropdown */}
          {showMoreOptions && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
              <div className="p-2">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center">
                  Save to playlist
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center">
                  Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total Likes - YouTube style */}
      <div className="mt-2 text-xs text-gray-500">
        {likeCount > 0 ? (
          <span>{likeCount.toLocaleString()} {likeCount === 1 ? 'like' : 'likes'}</span>
        ) : (
          <span>Be the first to like this video</span>
        )}
      </div>
    </div>
  );
};

export default VideoReactions;
