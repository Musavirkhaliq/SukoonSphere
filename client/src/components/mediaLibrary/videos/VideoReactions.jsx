import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaHeart, FaLightbulb, FaHandsHelping, FaShare } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';

const VideoReactions = ({ videoId, videoTitle }) => {
  const { user } = useUser();
  const [reactions, setReactions] = useState({
    like: 0,
    love: 0,
    helpful: 0,
    insightful: 0,
    total: 0
  });
  const [userReaction, setUserReaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Fetch reactions
  const fetchReactions = async () => {
    try {
      setIsLoading(true);
      const { data } = await customFetch.get(`/video-reactions/${videoId}`);
      setReactions(data.reactionCounts);
      setUserReaction(data.userReaction);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchReactions();
    }
  }, [videoId]);

  // Handle reaction
  const handleReaction = async (type) => {
    if (!user) {
      toast.info('Please log in to react to videos');
      return;
    }
    
    try {
      const { data } = await customFetch.post(`/video-reactions/${videoId}`, { type });
      setReactions(data.reactionCounts);
      setUserReaction(data.userReaction);
      
      if (data.userReaction) {
        toast.success(`You ${data.userReaction}d this video!`);
      }
    } catch (error) {
      console.error('Error reacting to video:', error);
      toast.error('Failed to react to video');
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

  // Reaction button component
  const ReactionButton = ({ type, icon, label, count }) => {
    const isActive = userReaction === type;
    
    return (
      <button
        onClick={() => handleReaction(type)}
        className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-100 text-blue-600' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {icon}
        <span className="text-xs mt-1">{count > 0 ? count : ''} {label}</span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex space-x-2">
          <ReactionButton
            type="like"
            icon={<FaThumbsUp className="text-xl" />}
            label="Like"
            count={reactions.like}
          />
          
          <ReactionButton
            type="love"
            icon={<FaHeart className="text-xl" />}
            label="Love"
            count={reactions.love}
          />
          
          <ReactionButton
            type="helpful"
            icon={<FaHandsHelping className="text-xl" />}
            label="Helpful"
            count={reactions.helpful}
          />
          
          <ReactionButton
            type="insightful"
            icon={<FaLightbulb className="text-xl" />}
            label="Insightful"
            count={reactions.insightful}
          />
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
      
      {/* Total Reactions */}
      {reactions.total > 0 && (
        <div className="mt-3 text-sm text-gray-500 border-t pt-2">
          {reactions.total} {reactions.total === 1 ? 'person has' : 'people have'} reacted to this video
        </div>
      )}
    </div>
  );
};

export default VideoReactions;
