import React from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaRegCommentAlt,
  FaUser,
  FaClock
} from "react-icons/fa";
import { BiUpvote } from "react-icons/bi";
import { motion } from "framer-motion";
import { format } from "date-fns";
import UserAvatar from "../shared/UserAvatar";

const ArticleCard = ({ article, index }) => {
  // Format date in a more readable way
  const formattedDate = format(new Date(article.createdAt), 'MMM d, yyyy');

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

  return (
    <motion.div
      whileHover="hover"
      variants={cardVariants}
      className="h-full"
    >
      <Link
        key={`${article._id}-${index}`}
        to={`/articles/article/${article._id}`}
        className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-200 flex flex-col h-full"
      >
        {/* Larger cover image with gradient overlay */}
        <div className="relative h-64 sm:h-72 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            variants={imageVariants}
          >
            {article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                <FaBookOpen className="w-16 h-16 text-white opacity-75" />
              </div>
            )}
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-90"></div>
          </motion.div>

          {/* Article metadata on the image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {/* Reading time and date */}
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <FaClock className="w-3 h-3" />
                <span>{calculateReadingTime(article.content)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Title on the image for larger screens */}
            <h2 className="text-xl sm:text-2xl font-bold leading-tight line-clamp-2 text-white hidden sm:block">
              {article.title}
            </h2>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          {/* Title for mobile screens */}
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3 line-clamp-2 sm:hidden">
            {article.title}
          </h2>

          {/* Article text preview */}
          {article.content && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>
          )}

          {/* Engagement metrics */}
          <div className="flex items-center gap-6 my-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200">
                <BiUpvote className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {article?.likes?.length || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-200">
                <FaRegCommentAlt className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {article?.comments?.length || 0}
              </span>
            </div>
          </div>

          {/* Author info */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              {/* {article?.authorAvatar ? (
                <img
                  src={article?.authorAvatar}
                  alt={article?.authorName}
                  className="w-8 h-8 mr-2 object-cover rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 shadow-sm">
                  <FaUser className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-800 line-clamp-1">
                {article?.authorName || "Anonymous"}
              </span> */}
            <UserAvatar
              username={article?.authorName}
              userAvatar={article?.authorAvatar}
              createdBy={article?.authorId}
              createdAt={article?.createdAt}
              userAvatarFrame={article?.authorAvatarFrame}
              userAvatarAccessories={article?.authorAvatarAccessories}
              size="medium"
              />
              </div>

            {/* Read more indicator */}
            <span className="text-sm font-medium text-blue-600 group-hover:underline">Read more</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard;
