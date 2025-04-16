import React, { useState, useRef, useEffect } from 'react';
import {
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaHandsHelping,
  FaCheck,
  FaSadTear,
  FaAngry,
  FaLightbulb
} from 'react-icons/fa';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';
import ReactionUsersList from './ReactionUsersList';

const reactionIcons = {
  like: <FaThumbsUp className="text-blue-500" />,
  heart: <FaHeart className="text-red-500" />,
  haha: <FaLaugh className="text-yellow-500" />,
  wow: <FaSurprise className="text-yellow-500" />,
  support: <FaHandsHelping className="text-purple-500" />,
  relate: <MdOutlinePeopleAlt className="text-green-500" />,
  agree: <FaCheck className="text-green-500" />,
  sad: <FaSadTear className="text-blue-700" />,
  angry: <FaAngry className="text-red-700" />,
  insightful: <FaLightbulb className="text-yellow-400" />
};

const reactionLabels = {
  like: 'Like',
  heart: 'Heart',
  haha: 'Haha',
  wow: 'Wow',
  support: 'Support',
  relate: 'I relate to it',
  agree: 'Agree',
  sad: 'Sad',
  angry: 'Angry',
  insightful: 'Insightful'
};

const ReactionSelector = ({
  contentId,
  contentType,
  initialReactions = {},
  initialUserReaction = null,
  onReactionChange
}) => {
  const { user } = useUser();
  const [showReactionSelector, setShowReactionSelector] = useState(false);
  const [showReactionUsers, setShowReactionUsers] = useState(false);
  const [selectedReactionType, setSelectedReactionType] = useState(null);
  const [reactionCounts, setReactionCounts] = useState(initialReactions);
  const [userReaction, setUserReaction] = useState(initialUserReaction);
  const [isLoading, setIsLoading] = useState(false);
  const selectorRef = useRef(null);
  const usersListRef = useRef(null);

  // Calculate total reactions (use the 'total' property if it exists, otherwise sum all reaction counts)
  const totalReactions = reactionCounts.total !== undefined
    ? reactionCounts.total
    : Object.entries(reactionCounts)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [_, count]) => sum + count, 0);

  // Get the most common reaction type (excluding the 'total' property if it exists)
  const getMostCommonReaction = () => {
    if (totalReactions === 0) return 'like';
    return Object.entries(reactionCounts)
      .filter(([key]) => key !== 'total')
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type)[0];
  };

  // Close selectors when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowReactionSelector(false);
      }
      if (usersListRef.current && !usersListRef.current.contains(event.target)) {
        setShowReactionUsers(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch reactions when component mounts or when contentId/contentType changes
  useEffect(() => {
    if (contentId && contentType) {
      fetchReactions();
    }
  }, [contentId, contentType]);

  // Create a memoized fetchReactions function that won't change on re-renders
  const fetchReactions = async () => {
    try {
      // Get the appropriate API endpoint
      const endpoint = getApiEndpoint(contentType, contentId);
      console.log(`Fetching reactions from ${endpoint}`);

      // Use the new reaction system
      const { data } = await customFetch.get(endpoint);
      console.log('Reaction data:', data);

      // Update local state with fetched data
      setReactionCounts(data.reactionCounts || {});
      setUserReaction(data.userReaction);

      // Notify parent component of the updated reaction data
      if (onReactionChange) {
        onReactionChange(data.reactionCounts || {}, data.userReaction);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
      // Log detailed error information
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

      // Set default values on error
      setReactionCounts({});
      setUserReaction(null);

      // Only show toast for non-401 errors (401 is handled by customFetch interceptor)
      if (error.response && error.response.status !== 401) {
        toast.error('Failed to load reactions');
      }
    }
  };

  // Update local state when props change, but only if we haven't fetched data yet
  useEffect(() => {
    // Only update from props if we haven't fetched data yet or if the props have meaningful data
    // This prevents overwriting fetched data with incomplete initial data
    const hasInitialReactionData = Object.values(initialReactions).some(count => count > 0);

    if (hasInitialReactionData) {
      setReactionCounts(prevCounts => {
        // If we already have fetched data with multiple reaction types, don't overwrite with just 'like' count
        const hasFetchedMultipleReactions =
          Object.entries(prevCounts).filter(([key, val]) => key !== 'total' && val > 0).length > 1;

        if (hasFetchedMultipleReactions) {
          return prevCounts;
        }
        return initialReactions;
      });
    }

    // Always update user reaction from props as it's user-specific
    setUserReaction(initialUserReaction);
  }, [initialReactions, initialUserReaction]);



  // Use the appropriate API endpoint based on content type
  const getApiEndpoint = (contentType, contentId) => {
    // Use the new unified reactions API for all content types
    // Note: Don't include /api/v1/ prefix as customFetch already has baseURL set to /api/v1
    return `/reactions/${contentType}/${contentId}`;
  };

  // Handle reaction click
  const handleReaction = async (type) => {
    if (!user) {
      toast.info('Please log in to react');
      return;
    }

    if (isLoading) return;

    // Store current state for rollback if needed - declare outside try block
    const prevUserReaction = userReaction;
    const prevReactionCounts = { ...reactionCounts };

    // Calculate optimistic update values
    let optimisticUserReaction;
    let optimisticReactionCounts;

    if (userReaction === type) {
      // Remove reaction if clicking the same type
      optimisticUserReaction = null;
      optimisticReactionCounts = {
        ...reactionCounts,
        [type]: Math.max(0, (reactionCounts[type] || 0) - 1)
      };
    } else {
      // Add new reaction and remove old one if exists
      optimisticUserReaction = type;
      if (userReaction) {
        optimisticReactionCounts = {
          ...reactionCounts,
          [userReaction]: Math.max(0, (reactionCounts[userReaction] || 0) - 1),
          [type]: (reactionCounts[type] || 0) + 1
        };
      } else {
        optimisticReactionCounts = {
          ...reactionCounts,
          [type]: (reactionCounts[type] || 0) + 1
        };
      }
    }

    try {
      setIsLoading(true);

      // Optimistically update UI
      setUserReaction(optimisticUserReaction);
      setReactionCounts(optimisticReactionCounts);

      // Notify parent component of optimistic update
      if (onReactionChange) {
        onReactionChange(optimisticReactionCounts, optimisticUserReaction);
      }

      // Close selector
      setShowReactionSelector(false);

      // Get the appropriate API endpoint
      const endpoint = getApiEndpoint(contentType, contentId);
      console.log(`Sending reaction: ${type} to ${endpoint}`);
      console.log('Request payload:', { type });

      // Use the new reaction system
      const response = await customFetch.post(endpoint, { type });
      const data = response.data;
      console.log('Reaction response:', data);

      // Update with actual server data
      setReactionCounts(data.reactionCounts || {});
      setUserReaction(data.userReaction);

      // Notify parent component with server data
      if (onReactionChange) {
        onReactionChange(data.reactionCounts || {}, data.userReaction);
      }
    } catch (error) {
      console.error('Error updating reaction:', error);

      // Show detailed error message
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        toast.error(`Failed to update reaction: ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('No response received from server');
      } else {
        console.error('Error message:', error.message);
        toast.error(`Error: ${error.message}`);
      }

      // Revert to previous state on error
      setUserReaction(prevUserReaction);
      setReactionCounts(prevReactionCounts);

      // Notify parent component of reversion
      if (onReactionChange) {
        onReactionChange(prevReactionCounts, prevUserReaction);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Track long press for mobile devices
  const [longPressTimer, setLongPressTimer] = useState(null);

  // Handle touch start (for mobile long press)
  const handleTouchStart = () => {
    if (!user) return;

    // Start a timer for long press
    const timer = setTimeout(() => {
      setShowReactionSelector(true);
    }, 500); // 500ms long press to show reaction selector

    setLongPressTimer(timer);
  };

  // Handle touch end (for mobile long press)
  const handleTouchEnd = () => {
    // Clear the timer if touch ends before long press is detected
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Handle touch move (for mobile long press)
  const handleTouchMove = () => {
    // Clear the timer if user moves finger before long press is detected
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Handle click on main reaction button
  const handleMainButtonClick = () => {
    if (!user) {
      toast.info('Please log in to react');
      return;
    }

    if (userReaction) {
      // If user already reacted, toggle it off
      handleReaction(userReaction);
    } else {
      // If no reaction yet, show selector
      setShowReactionSelector(!showReactionSelector);
    }
  };

  // Handle showing users who reacted
  const handleShowUsers = (type = null) => {
    setSelectedReactionType(type);
    setShowReactionUsers(true);
  };

  return (
    <div className="relative">
      {/* Main reaction button */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleMainButtonClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${userReaction
            ? 'bg-gray-100 hover:bg-gray-200'
            : 'text-gray-600 hover:bg-gray-100'
            }`}
          disabled={isLoading}
        >
          <span className="text-lg">
            {userReaction ? reactionIcons[userReaction] : reactionIcons.like}
          </span>
          <span className="text-sm font-medium">
            {userReaction ? reactionLabels[userReaction] : 'React'}
          </span>
        </button>

        {/* Reaction counts */}
        {totalReactions > 0 && (
          <button
            className="text-sm text-gray-500 hover:underline flex items-center gap-1"
            onClick={() => handleShowUsers()}
          >
            <span className="text-lg">
              {reactionIcons[getMostCommonReaction()]}
            </span>
            <span>{totalReactions}</span>
          </button>
        )}
      </div>

      {/* Reaction selector */}
      {showReactionSelector && (
        <div
          ref={selectorRef}
          className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg z-50 p-2 flex flex-wrap gap-2 border border-gray-200 w-auto min-w-[350px] max-w-[95vw] md:max-w-none"
        >
          <div className="w-full text-center text-xs text-gray-500 mb-2 md:hidden">
            Tap a reaction below
          </div>
          {Object.entries(reactionIcons).map(([type, icon]) => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              className="p-2 hover:bg-gray-100 rounded-full transition-transform hover:scale-110 flex flex-col items-center min-w-[50px] min-h-[50px] md:min-w-0 md:min-h-0"
              title={reactionLabels[type]}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs mt-1">{reactionLabels[type]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Users who reacted */}
      {showReactionUsers && (
        <div
          ref={usersListRef}
          className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg z-50 border border-gray-200 w-64"
        >
          <ReactionUsersList
            contentId={contentId}
            contentType={contentType}
            reactionType={selectedReactionType}
            onClose={() => setShowReactionUsers(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ReactionSelector;
