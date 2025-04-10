import { useEffect, useState } from "react";
import { FaRegComment, FaRegHeart, FaPlus, FaShare, FaEllipsisH, FaRegCommentAlt } from "react-icons/fa";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import customFetch from "@/utils/customFetch";
import UserAvatar from "../shared/UserAvatar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./EnhancedSections.css";

const SkeletonPostCard = () => {
  return (
    <div className="community-card post-card skeleton-card">
      <div className="card-header">
        <div className="avatar-skeleton"></div>
        <div className="user-info-skeleton">
          <div className="name-skeleton"></div>
          <div className="date-skeleton"></div>
        </div>
      </div>
      <div className="card-content">
        <div className="content-skeleton"></div>
        <div className="content-skeleton"></div>
        <div className="content-skeleton"></div>
        <div className="content-skeleton short"></div>
      </div>
      <div className="card-footer">
        <div className="action-skeleton"></div>
        <div className="action-skeleton"></div>
      </div>
    </div>
  );
};

const CallToActionCard = () => {
  return (
    <div className="community-card cta-card">
      <div className="cta-icon bg-[var(--primary-color)]">
        <FaPlus />
      </div>
      <h3>Share Your Story</h3>
      <p>
        Join our supportive community and share your experiences, insights, and journey.
      </p>
      <Link to="/posts" className="btn-1">
        Create Post
      </Link>
    </div>
  );
};

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="community-card post-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-header">
        <UserAvatar
          username={post?.createdBy?.name}
          userAvatar={post?.createdBy?.avatar}
          createdBy={post?.createdBy?.name}
          createdAt={post?.createdAt}
          size="medium"
        />

        <div className="card-menu">
          <FaEllipsisH />
          <div className={`card-menu-dropdown ${isHovered ? 'visible' : ''}`}>
            <Link to={`/Posts`} className="menu-item">
              View Post
            </Link>
            <Link to={`/about/user/${post?.createdBy?._id}`} className="menu-item">
              View Profile
            </Link>
          </div>
        </div>
      </div>

      <Link to={`/posts/${post?._id}`} className="card-content">
        <p>{post?.description}</p>
      </Link>

      <div className="card-footer">
        <div className="flex gap-8 items-center ">
          <button className=" flex gap-2 items-center">
            <FaRegHeart className={post?.likes?.includes(post?.createdBy?._id) ? "text-red-500" : ""} />
            <span>{post?.likes?.length || 0}</span>
          </button>

          <button className="flex gap-2 items-center">
            <FaRegCommentAlt className="text-black" />
            <span>{post?.comments?.length || 0}</span>
          </button>

          <button className="action-button">
            <FaShare className="text-black" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function EnhancedUserPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await customFetch.get("/posts/most-liked");
      setUserPosts(response?.data?.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const splideOptions = {
    type: "loop",
    perPage: 3,
    perMove: 1,
    pagination: true,
    arrows: false,
    gap: "2rem",
    breakpoints: {
      1024: { perPage: 2 },
      768: { perPage: 2 },
      640: { perPage: 1 },
    },
    autoplay: true,
    interval: 4000,
    pauseOnHover: true,
    pauseOnFocus: true,
    speed: 1000,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    lazyLoad: "nearby",
    preloadPages: 2
  };

  return (
    <section className="enhanced-section">
      <div className="section-header">
        <h2 className="section-title">Community Posts</h2>
        <p className="section-subtitle">
          Explore stories and experiences shared by our community members
        </p>
        <Link to="/posts" className="section-link">
          View All Posts
        </Link>
      </div>

      <div className="splide-container">
        <Splide options={splideOptions} className="enhanced-splide">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
              <SplideSlide key={`skeleton-${index}`}>
                <SkeletonPostCard />
              </SplideSlide>
            ))
            : userPosts.map((post) => (
              <SplideSlide key={post?._id}>
                <PostCard post={post} />
              </SplideSlide>
            ))}

          {!loading && (
            <SplideSlide>
              <CallToActionCard />
            </SplideSlide>
          )}
        </Splide>
      </div>
    </section>
  );
}
