import React from 'react';
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
  return (
    <div className={className}>
      <ReactionSelector
        contentId={contentId}
        contentType={contentType}
        initialReactions={initialReactions}
        initialUserReaction={initialUserReaction}
        onReactionChange={onReactionChange}
      />
    </div>
  );
};

export default ReactionButton;
