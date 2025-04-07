import { useEffect, useState } from "react";
import { FaBookOpen, FaCalendarAlt, FaRegCommentAlt, FaUser, FaChevronRight, FaClock } from "react-icons/fa";
import { BiUpvote } from "react-icons/bi";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import customFetch from "@/utils/customFetch";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./EnhancedSections.css";

const SkeletonArticleCard = () => {
  return (
    <div className="community-card article-card skeleton-card">
      <div className="article-image-container skeleton"></div>
      <div className="card-content">
        <div className="title-skeleton"></div>
        <div className="content-skeleton"></div>
        <div className="content-skeleton"></div>
      </div>
      <div className="card-footer article-footer">
        <div className="article-meta">
          <div className="avatar-skeleton small"></div>
          <div className="name-skeleton"></div>
        </div>
        <div className="article-stats">
          <div className="stat-skeleton"></div>
          <div className="stat-skeleton"></div>
        </div>
      </div>
    </div>
  );
};

const ArticleCard = ({ article }) => {
  // Calculate read time based on content length (rough estimate)
  const getReadTime = (content) => {
    if (!content) return "2 min read";
    const words = content.split(/\s+/).length;
    const readTime = Math.ceil(words / 200); // Assuming 200 words per minute
    return `${readTime} min read`;
  };

  return (
    <motion.div
      className="community-card article-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/articles/article/${article._id}`} className="article-image-container">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} className="article-image" />
        ) : (
          <div className="article-image-placeholder">
            <FaBookOpen />
          </div>
        )}
        <div className="article-category">
          {article.category || "Mental Health"}
        </div>
      </Link>

      <div className="card-content">
        <Link to={`/articles/article/${article._id}`} className="article-title-link">
          <h3 className="article-title">{article.title}</h3>
        </Link>
        <div className="article-preview">
          {article.content ? (
            <p>{article.content.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
          ) : (
            <p>Read this insightful article about mental health and wellbeing...</p>
          )}
        </div>
      </div>

      <div className="card-footer article-footer">
        <div className="article-meta">
          <div className="article-author">
            {article?.author?.avatar ? (
              <img src={article.author.avatar} alt={article.author.name} className="author-avatar" />
            ) : (
              <div className="author-avatar-placeholder">
                <FaUser />
              </div>
            )}
            <span className="author-name">{article?.author?.name || "Anonymous"}</span>
          </div>
          <div className="article-date">
            <FaCalendarAlt className="date-icon" />
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="article-stats">
          <div className="article-stat">
            <BiUpvote />
            <span>{article?.likes?.length || 0}</span>
          </div>
          <div className="article-stat">
            <FaRegCommentAlt />
            <span>{article?.comments?.length || 0}</span>
          </div>
          <div className="article-stat">
            <FaClock />
            <span>{getReadTime(article.content)}</span>
          </div>
        </div>
      </div>

      <Link to={`/articles/article/${article._id}`} className="article-read-more">
        <span>Read Article</span>
        <FaChevronRight />
      </Link>
    </motion.div>
  );
};

export default function EnhancedArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMostLikedArticles = async () => {
    try {
      setLoading(true);
      const response = await customFetch.get("/articles/most-liked");
      setArticles(response?.data?.articles || []);
    } catch (error) {
      console.error("Error fetching most liked articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMostLikedArticles();
  }, []);

  const splideOptions = {
    type: "loop",
    perPage: 3,
    perMove: 1,
    pagination: true,
    arrows: true,
    gap: "2rem",
    breakpoints: {
      1024: { perPage: 2 },
      768: { perPage: 2 },
      640: { perPage: 1 },
    },
    autoplay: true,
    interval: 6000,
    pauseOnHover: true,
    pauseOnFocus: true,
    speed: 1000,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    lazyLoad: "nearby",
    preloadPages: 2
  };

  if (!articles.length && !loading) {
    return null;
  }

  return (
    <section className="enhanced-section">
      <div className="section-header">
        <h2 className="section-title">Featured Articles</h2>
        <p className="section-subtitle">
          Explore our collection of insightful articles on mental health and wellbeing
        </p>
        <Link to="/articles" className="section-link">
          View All Articles
        </Link>
      </div>

      <div className="splide-container">
        <Splide options={splideOptions} className="enhanced-splide">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <SplideSlide key={`skeleton-${index}`}>
                  <SkeletonArticleCard />
                </SplideSlide>
              ))
            : articles.map((article) => (
                <SplideSlide key={article._id}>
                  <ArticleCard article={article} />
                </SplideSlide>
              ))}
        </Splide>
      </div>
    </section>
  );
}
