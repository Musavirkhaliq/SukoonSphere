import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ActivityTracker from '../../utils/activityTracker';
import { useUser } from '../../context/UserContext';
import './RecommendedContent.css';

/**
 * Component to display personalized content recommendations
 * 
 * @param {Object} props
 * @param {string} props.contentType - Optional filter for content type
 * @param {number} props.limit - Number of recommendations to show
 * @param {string} props.title - Title for the recommendations section
 * @param {string} props.className - Additional CSS class
 */
const RecommendedContent = ({ 
  contentType = null, 
  limit = 5, 
  title = "Recommended For You", 
  className = "" 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // If user is not logged in, get popular content instead
        if (!user) {
          const popularContent = await ActivityTracker.getPopularContent(
            contentType || 'post', 
            7, 
            limit
          );
          setRecommendations(popularContent);
        } else {
          // Get personalized recommendations
          const recs = await ActivityTracker.getRecommendations(contentType, limit);
          setRecommendations(recs);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user, contentType, limit]);
  
  const handleRecommendationClick = (recommendation) => {
    if (user && recommendation._id) {
      ActivityTracker.trackRecommendationClick(
        recommendation._id,
        recommendation.contentType,
        recommendation.contentId,
        recommendation.contentModel
      );
    }
  };
  
  // Generate link based on content type
  const getContentLink = (recommendation) => {
    const { contentType, contentId } = recommendation;
    
    switch (contentType) {
      case 'post':
        return `/posts/${contentId}`;
      case 'article':
        return `/articles/${contentId}`;
      case 'video':
        return `/videos/video/${contentId}`;
      case 'podcast':
        return `/podcasts/${contentId}`;
      case 'question':
        return `/QA-section/question/${contentId}`;
      case 'answer':
        return `/QA-section/question/answer/${contentId}/comments`;
      default:
        return '#';
    }
  };
  
  // Get content thumbnail
  const getContentThumbnail = (recommendation) => {
    const content = recommendation.contentId;
    
    if (!content) return null;
    
    // Different content types store images in different fields
    if (content.imageUrl) return content.imageUrl;
    if (content.coverImage) return content.coverImage;
    
    // Default thumbnails based on content type
    switch (recommendation.contentType) {
      case 'post':
        return '/images/default-post.jpg';
      case 'article':
        return '/images/default-article.jpg';
      case 'video':
        return '/images/default-video.jpg';
      case 'podcast':
        return '/images/default-podcast.jpg';
      case 'question':
      case 'answer':
        return '/images/default-qa.jpg';
      default:
        return '/images/default-content.jpg';
    }
  };
  
  // Get content title
  const getContentTitle = (recommendation) => {
    const content = recommendation.contentId;
    
    if (!content) return 'Recommended content';
    
    // Different content types store titles in different fields
    if (content.title) return content.title;
    
    // For posts, use the first part of the description
    if (content.description) {
      return content.description.length > 60
        ? content.description.substring(0, 60) + '...'
        : content.description;
    }
    
    // Default title based on content type
    return `Recommended ${recommendation.contentType}`;
  };
  
  // Get content creator
  const getContentCreator = (recommendation) => {
    const content = recommendation.contentId;
    
    if (!content) return null;
    
    // Different content types store creator info in different fields
    if (content.username) return content.username;
    if (content.author && typeof content.author === 'object' && content.author.name) {
      return content.author.name;
    }
    if (content.createdBy && typeof content.createdBy === 'object' && content.createdBy.name) {
      return content.createdBy.name;
    }
    
    return 'SukoonSphere';
  };
  
  // Get reason text
  const getReasonText = (reason) => {
    switch (reason) {
      case 'content_similarity':
        return 'Because you viewed similar content';
      case 'user_preference':
        return 'Based on your interests';
      case 'popular_content':
        return 'Popular in SukoonSphere';
      case 'creator_affinity':
        return 'From creators you follow';
      case 'tag_based':
        return 'Topics you might like';
      case 'category_based':
        return 'Categories you enjoy';
      case 'collaborative_filtering':
        return 'Others with similar interests liked this';
      default:
        return 'Recommended for you';
    }
  };
  
  if (loading) {
    return (
      <div className={`recommended-content ${className}`}>
        <h3>{title}</h3>
        <div className="recommendations-loading">
          <div className="recommendation-skeleton"></div>
          <div className="recommendation-skeleton"></div>
          <div className="recommendation-skeleton"></div>
        </div>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return null; // Don't show empty recommendations
  }
  
  return (
    <div className={`recommended-content ${className}`}>
      <h3>{title}</h3>
      <div className="recommendations-container">
        {recommendations.map((recommendation) => (
          <Link
            key={recommendation._id || recommendation.contentId._id}
            to={getContentLink(recommendation)}
            className="recommendation-card"
            onClick={() => handleRecommendationClick(recommendation)}
          >
            <div className="recommendation-image">
              <img 
                src={getContentThumbnail(recommendation)} 
                alt={getContentTitle(recommendation)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/default-content.jpg';
                }}
              />
              <span className="content-type-badge">{recommendation.contentType}</span>
            </div>
            <div className="recommendation-content">
              <h4>{getContentTitle(recommendation)}</h4>
              <p className="recommendation-creator">{getContentCreator(recommendation)}</p>
              <p className="recommendation-reason">{getReasonText(recommendation.reason)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedContent;
