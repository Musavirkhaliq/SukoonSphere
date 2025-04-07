import { BiUpvote } from "react-icons/bi";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaRegCommentAlt,
  FaUser,
  FaClock
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";

const SimilarArticles = ({ similarArticles }) => {
  if (!similarArticles || similarArticles.length === 0) return null;

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
    <div className="mt-16 pt-12 border-t border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900 relative">
          <span className="relative z-10">Similar Articles</span>
          <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-100 opacity-50 -z-10 transform -rotate-1"></span>
        </h3>
        <Link to="/articles" className="text-blue-600 font-medium hover:underline">View all articles</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarArticles.map((article, index) => (
          <motion.div
            key={`${article._id}-${index}`}
            whileHover="hover"
            variants={cardVariants}
            className="h-full"
          >
            <Link
              to={`/articles/article/${article._id}`}
              className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-200 flex flex-col h-full"
            >
              {/* Cover image with gradient overlay */}
              <div className="relative h-48 overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
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
                      <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3 line-clamp-2">
                  {article.title}
                </h2>

                {/* Article text preview */}
                {article.content && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>
                )}

                {/* Author info */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    {article?.authorAvatar ? (
                      <img
                        src={article?.authorAvatar}
                        alt={article?.authorName}
                        className="w-6 h-6 mr-2 object-cover rounded-full border border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <FaUser className="w-3 h-3 text-blue-600" />
                      </div>
                    )}
                    <span className="text-xs font-medium text-gray-700 line-clamp-1">
                      {article?.authorName || "Anonymous"}
                    </span>
                  </div>

                  {/* Engagement metrics */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <BiUpvote className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs text-gray-600">
                        {article?.likes?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRegCommentAlt className="w-3 h-3 text-indigo-600" />
                      <span className="text-xs text-gray-600">
                        {article?.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimilarArticles;
