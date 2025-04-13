import React, { useState, useEffect, useRef } from 'react';
import { FaThumbsDown, FaShare, FaEllipsisH } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';
import ReactionButton from '../../shared/Reactions/ReactionButton';

const VideoReactions = ({ videoId, videoTitle }) => {
  const { user } = useUser();
  const [initialReactions, setInitialReactions] = useState({ like: 0 });
  const [initialUserReaction, setInitialUserReaction] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Refs for dropdown menus
  const shareMenuRef = useRef(null);
  const moreOptionsMenuRef = useRef(null);

  // Fetch video data including reactions
  const fetchVideoData = async () => {
    try {
      // Get reactions from the API
      const { data } = await customFetch.get(`/reactions/video/${videoId}`);
      console.log('Fetched video reactions:', data);
      setInitialReactions(data.reactionCounts || { like: 0 });
      setInitialUserReaction(data.userReaction);
    } catch (error) {
      console.error('Error fetching video reactions:', error);
      // If the reaction API fails, try to get likes from the video API
      try {
        const { data } = await customFetch.get(`/videos/video/${videoId}`);
        if (data.video) {
          console.log('Fetched video data:', data.video);
          setInitialReactions({ like: data.video.likes?.length || 0 });
          setInitialUserReaction(user && data.video.likes?.includes(user._id) ? 'like' : null);
        }
      } catch (videoError) {
        console.error('Error fetching video data:', videoError);
      }
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

  // Handle reaction change
  const handleReactionChange = (reactionCounts, userReaction) => {
    console.log('Video reaction updated:', { reactionCounts, userReaction });
    // Update the state with the new reaction data
    setInitialReactions(reactionCounts || { like: 0 });
    setInitialUserReaction(userReaction);
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
        {/* Reactions */}
        <div className="flex items-center gap-2">
          {/* Reaction button */}
          <ReactionButton
            contentId={videoId}
            contentType="video"
            initialReactions={initialReactions}
            initialUserReaction={initialUserReaction}
            onReactionChange={handleReactionChange}
          />

          {/* Dislike button (visual only) */}
          <button
            className="flex items-center px-3 py-1.5 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
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

      {/* Total Reactions - YouTube style */}
      <div className="mt-2 text-xs text-gray-500">
        {(() => {
          // Calculate total reactions only once (excluding the 'total' property if it exists)
          const totalCount = Object.entries(initialReactions)
            .filter(([key]) => key !== 'total')
            .reduce((sum, [_, count]) => sum + count, 0);

          return totalCount > 0 ? (
            <span>
              {totalCount.toLocaleString()} {totalCount === 1 ? 'reaction' : 'reactions'}
            </span>
          ) : (
            <span>Be the first to react to this video</span>
          );
        })()}
      </div>
    </div>
  );
};

export default VideoReactions;
