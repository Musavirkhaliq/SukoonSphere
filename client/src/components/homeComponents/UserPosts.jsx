import { useEffect, useState } from "react";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import SectionTitle from "../sharedComponents/SectionTitle";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import customFetch from "@/utils/customFetch";
import UserAvatar from "../shared/UserAvatar";
import { Link } from "react-router-dom";

const SkeletonPostCard = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full max-w-md h-60 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex justify-start gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
      <div className="text-sm mb-2 text-left min-h-8 overflow-hidden">
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="flex justify-start items-center gap-5 mt-2 text-gray-500">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-6"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-6"></div>
        </div>
      </div>
    </div>
  );
};

// New CallToActionCard component
const CallToActionCard = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full max-w-md h-60 flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-semibold mb-2">Share Your Thoughts!</h3>
      <p className="text-sm text-gray-600 mb-4">
        Join the community and post your own ideas,share your experiences & many more.
      </p>
      <Link to="/posts" className="btn-2">
        Post Now
      </Link>
    </div>
  );
};

export default function UserPosts() {
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
    perPage: 4,
    perMove: 1,
    pagination: true,
    arrows: false,
    gap: "1.5rem",
    breakpoints: {
      1024: { perPage: 3 },
      768: { perPage: 2 },
      640: { perPage: 1 },
    },
    autoplay: "play",
    interval: 2000,
    preloadPages: 2
  };

  const PostCard = ({ post }) => {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md w-full max-w-md h-60 text-left">
        <div className="flex items-center justify-between mb-3">
          <div className="flex justify-start gap-2">
            <UserAvatar
              username={post?.createdBy?.name}
              userAvatar={post?.createdBy?.avatar}
              createdBy={post?.createdBy?.name}
              createdAt={post?.createdAt}
              size="medium"
            />
          </div>
        </div>
        <div className="text-sm mb-2 text-left min-h-8 overflow-hidden line-clamp-4">
          {post?.description}
        </div>
        <div className="flex justify-start items-center gap-5 mt-2 text-gray-500">
          <button
            disabled
            className="text-sm font-medium flex items-center gap-2"
          >
            <FaRegHeart className="h-4 w-4" />
            <span className="ml-1">{post?.likes?.length || 0}</span>
          </button>
          <button
            disabled
            className="text-sm font-medium flex items-center gap-2"
          >
            <FaRegComment className="h-4 w-4" />
            <span className="ml-1">{post?.comments?.length || 0}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto p-2">
      <SectionTitle title={"Community Posts"} />
      <div>
        <Splide options={splideOptions}>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
              <SplideSlide key={`skeleton-${index}`} className="pb-12">
                <SkeletonPostCard />
              </SplideSlide>
            ))
            : userPosts.map((post) => (
              <SplideSlide key={post?._id} className="pb-12">
                <PostCard post={post} />
              </SplideSlide>
            ))}
          {!loading && (
            <SplideSlide className="pb-12">
              <CallToActionCard />
            </SplideSlide>
          )}
        </Splide>
      </div>
    </section>
  );
}