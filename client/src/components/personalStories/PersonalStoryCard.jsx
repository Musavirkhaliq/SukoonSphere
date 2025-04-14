import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegComment, FaUser } from "react-icons/fa";
import { format } from "date-fns";
import { motion } from "framer-motion";
import UserAvatar from "../shared/UserAvatar";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactionButton from "../shared/Reactions/ReactionButton";

const PersonalStoryCard = ({ story, index }) => {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(story?.isLiked || false);
  const [likesCount, setLikesCount] = useState(story?.totalLikes || 0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Format date in a more readable way
  const formattedDate = format(new Date(story.createdAt), 'MMM d, yyyy');

  // Estimate reading time (assuming average reading speed of 200 words per minute)
  const calculateReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    return `${readingTime} min read`;
  };

  // Animation variants for hover effects
  const cardVariants = {
    hover: {
      y: -5,
      transition: { duration: 0.3 }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.5 }
    }
  };

  const handleReactionChange = (newReactionCounts, newUserReaction) => {
    console.log('Personal story reaction updated:', { newReactionCounts, newUserReaction });

    // Update local state
    // Calculate total reactions (use the 'total' property if it exists, otherwise sum all reaction counts)
    const totalCount = newReactionCounts.total !== undefined
      ? newReactionCounts.total
      : Object.entries(newReactionCounts)
          .filter(([key]) => key !== 'total')
          .reduce((sum, [_, count]) => sum + count, 0);

    setLikesCount(totalCount);
    setIsLiked(!!newUserReaction);
  };

  const handleReactionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // The actual reaction handling is done by the ReactionButton component
  };

  return (
    <motion.div
      whileHover="hover"
      variants={cardVariants}
      className="h-full"
    >
      <Link
        to={`/personal-stories/${story._id}`}
        className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-200 flex flex-col h-full"
      >
        {/* Cover image with gradient overlay */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            variants={imageVariants}
          >
            {story.imageUrl ? (
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {story.title.charAt(0)}
                </span>
              </div>
            )}
          </motion.div>

          {/* Story metadata on the image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent">
            <h2 className="text-xl font-bold leading-tight line-clamp-2">
              {story.title}
            </h2>

            <div className="flex items-center justify-between text-xs mt-2">
              <div className="flex items-center gap-2">
                <span>{calculateReadingTime(story.content)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          {/* Story text preview */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {story.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>

          {/* Story stats and actions */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              {story.authorAvatar ? (
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-8 h-8 mr-2 object-cover rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2 shadow-sm">
                  <FaUser className="w-4 h-4 text-purple-600" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-800 line-clamp-1">
                {story.authorName || "Anonymous"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div onClick={handleReactionClick}>
                <ReactionButton
                  contentId={story._id}
                  contentType="personalStory"
                  initialReactions={{
                    like: likesCount,
                    total: likesCount
                  }}
                  initialUserReaction={isLiked ? 'like' : null}
                  onReactionChange={handleReactionChange}
                />
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <FaRegComment />
                <span className="text-xs">{story.totalComments || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PersonalStoryCard;
