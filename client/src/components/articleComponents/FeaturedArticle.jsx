import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaRegCommentAlt, FaUser, FaClock } from 'react-icons/fa';
import { BiUpvote } from 'react-icons/bi';
import { format } from 'date-fns';
import UserAvatar from '../shared/UserAvatar';

const FeaturedArticle = ({ article }) => {
  if (!article) return null;
  
  // Format date in a more readable way
  const formattedDate = format(new Date(article.createdAt), 'MMMM d, yyyy');
  
  // Estimate reading time (assuming average reading speed of 200 words per minute)
  const calculateReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordCount = content.split(/\\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    return `${readingTime} min read`;
  };

  return (
    <div className="mb-12 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        <div className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 rounded-br-lg z-10 font-medium">
          Featured
        </div>
        <Link to={`/articles/article/${article._id}`}>
          <div className="relative h-96 overflow-hidden">
            {article.imageUrl ? (
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold opacity-30">Featured Article</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70"></div>
          </div>
        </Link>
      </div>
      
      <div className="relative -mt-24 mx-4 sm:mx-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3 gap-4">
          <div className="flex items-center">
            <FaClock className="mr-2 text-[var(--primary)]" />
            <span>{calculateReadingTime(article.content)}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-[var(--primary)]" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <BiUpvote className="mr-2 text-[var(--primary)]" />
            <span>{article.likes?.length || 0} likes</span>
          </div>
          <div className="flex items-center">
            <FaRegCommentAlt className="mr-2 text-[var(--primary)]" />
            <span>{article.comments?.length || 0} comments</span>
          </div>
        </div>
        
        <Link to={`/articles/article/${article._id}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200">
            {article.title}
          </h2>
        </Link>
        
        <p className="text-gray-600 mb-6 line-clamp-3">
          {article.content?.replace(/<[^>]*>/g, '').substring(0, 200)}...
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* {article.authorAvatar ? (
              <img 
                src={article.authorAvatar} 
                alt={article.authorName} 
                className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
                <FaUser className="text-blue-600" />
              </div>
            )}
            <div>
              <span className="block font-medium text-gray-900">{article.authorName || 'Anonymous'}</span>
              <span className="text-xs text-gray-500">Author</span>
            </div> */}
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
          
          <Link 
            to={`/articles/article/${article._id}`}
            className="btn-2 transition-colors duration-200"
          >
            Read Article
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
