import React, { useState, useEffect } from 'react';
import ReactionSelector from './ReactionSelector';

/**
 * A wrapper component for ReactionSelector that can be easily used across the application
 *
 * @param {Object} props
 * @param {string} props.contentId - ID of the content being reacted to
 * @param {string} props.contentType - Type of content (post, comment, reply, video, article, etc.)
 * @param {Object} props.initialReactions - Initial reaction counts
 * @param {string} props.initialUserReaction - Initial user reaction
 * @param {Function} props.onReactionChange - Callback when reaction changes
 * @param {string} props.className - Additional CSS classes
 */
const ReactionButton = ({
  contentId,
  contentType,
  initialReactions = {},
  initialUserReaction = null,
  onReactionChange,
  className = ''
}) => {
  // Show mobile tooltip only on small screens
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);

  // Track the latest reaction data to avoid duplicate updates
  const [currentReactions, setCurrentReactions] = useState(initialReactions);
  const [currentUserReaction, setCurrentUserReaction] = useState(initialUserReaction);

  // Handle reaction changes from the selector
  const handleReactionChange = (reactionCounts, userReaction) => {
    // Calculate total reactions if not already included
    let updatedReactionCounts = { ...reactionCounts };

    if (updatedReactionCounts.total === undefined) {
      const totalCount = Object.entries(updatedReactionCounts)
        .filter(([key]) => key !== 'total')
        .reduce((sum, [_, count]) => sum + count, 0);

      updatedReactionCounts.total = totalCount;
    }

    // Update our local state
    setCurrentReactions(updatedReactionCounts);
    setCurrentUserReaction(userReaction);

    // Notify parent component
    if (onReactionChange) {
      onReactionChange(updatedReactionCounts, userReaction);
    }
  };

  useEffect(() => {
    // Only show the tooltip on mobile devices
    if (window.innerWidth < 768 && !localStorage.getItem('reaction-tooltip-shown')) {
      setShowMobileTooltip(true);

      // Hide tooltip after 5 seconds
      const timer = setTimeout(() => {
        setShowMobileTooltip(false);
        localStorage.setItem('reaction-tooltip-shown', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className={`${className} relative`}>
      {showMobileTooltip && (
        <div className="absolute -top-10 left-0 right-0 bg-black text-white text-xs p-2 rounded text-center md:hidden">
          Hold to see all reactions
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
        </div>
      )}
      <ReactionSelector
        contentId={contentId}
        contentType={contentType}
        initialReactions={initialReactions}
        initialUserReaction={initialUserReaction}
        onReactionChange={handleReactionChange}
      />
    </div>
  );
};

export default ReactionButton;
