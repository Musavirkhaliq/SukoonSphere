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
  // Show mobile tooltip only on small screens
  const [showMobileTooltip, setShowMobileTooltip] = React.useState(false);

  React.useEffect(() => {
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
        onReactionChange={onReactionChange}
      />
    </div>
  );
};

export default ReactionButton;
