import React, { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import PostCard from "@/components/posts/PostCard";
import PostModal from "@/components/posts/PostModel";
import PostFilter from "@/components/posts/PostFilter";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { FaPlus, FaBookOpen, FaHeart } from "react-icons/fa";

const AllPosts = () => {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("newest");
  const { ref, inView } = useInView();
  // Set up infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", activeFilter],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await customFetch.get(
        `/posts?page=${pageParam}&limit=10&sortBy=${activeFilter}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 5 * 60 * 1000,
  });

  // Fetch next page when last element is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handlePostUpdate = async (updatedPost) => {
    await refetch();
  };

  if (status === "loading") {
    return <div className="text-center py-4">Loading posts...</div>;
  }

  if (status === "error") {
    return (
      <div className="text-center text-red-500 py-4">Error loading posts</div>
    );
  }

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div>
      <div className="mb-6 p-4 sm:p-6 bg-blue-50 rounded-lg shadow-sm text-center flex justify-center items-center flex-col">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--grey--900)]">
          Share Your Thoughts!
        </h2>
        <p className="text-[var(--grey--800)] mb-2 text-sm sm:text-base">
          Got something on your mind? Share your experiences, tips, and thoughts
          with the community.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              if (!user) {
                toast.error("Please login to create a post!");
                return;
              }
              setShowModal(true);
            }}
            className="btn-2 flex gap-2 justify-center"
          >
            <FaPlus />
            Add Post
          </button>
        </div>
      </div>

      {/* Featured Personal Stories */}
      <div className="mb-6 p-4 sm:p-6 bg-purple-50 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-900 flex items-center gap-2">
            <FaBookOpen className="text-purple-700" />
            Personal Stories
          </h3>
          <Link to="/personal-stories" className="text-sm text-purple-700 hover:text-purple-900 font-medium">
            View All
          </Link>
        </div>

        <FeaturedPersonalStories />

        <div className="mt-4">
          <Link to="/personal-stories" className="btn-outline-purple flex gap-2 w-full sm:w-auto justify-center">
            <FaBookOpen />
            Share Your Story
          </Link>
        </div>
      </div>

      {showModal && (
        <PostModal
          onClose={() => setShowModal(false)}
          onPostCreated={() => refetch()}
        />
      )}

      {/* Filter Component */}
      <PostFilter
        activeFilter={activeFilter}
        onFilterChange={(filter) => {
          setActiveFilter(filter);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Posts List */}
      {allPosts.length > 0 ? (
        <div className="space-y-4">
          {allPosts.map((post, index) => (
            <PostCard
              key={`${post._id}-${index}`}
              post={post}
              user={user}
              onPostUpdate={handlePostUpdate}
            />
          ))}

          {/* Loading indicator - only show if we have more posts to load */}
          <div ref={ref} className="py-4 text-center">
            {isFetchingNextPage && (
              <div className="text-gray-500">Loading more posts...</div>
            )}
            {!isFetchingNextPage && hasNextPage && (
              <div className="text-gray-400">Scroll for more</div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No posts found</div>
      )}
    </div>
  );
};

// Featured Personal Stories Component
const FeaturedPersonalStories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featuredPersonalStories"],
    queryFn: async () => {
      const response = await customFetch.get("/personal-stories/most-liked?limit=3");
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-40 bg-purple-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.stories || data.stories.length === 0) {
    return (
      <p className="text-purple-800 mb-4 text-sm">
        Share your personal experiences and journey in a more detailed format. Your story could inspire others!
      </p>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {data.stories.map((story) => (
        <Link
          key={story._id}
          to={`/personal-stories/${story._id}`}
          className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="relative h-32 bg-gradient-to-r from-purple-500 to-indigo-600 overflow-hidden">
            {story.imageUrl && (
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-full object-cover opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-3">
              <h4 className="text-white font-medium text-sm line-clamp-2">{story.title}</h4>
            </div>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-500 mb-1">
              By {story.authorName || "Anonymous"}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FaHeart className="text-red-500" /> {story.totalLikes || 0} likes
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AllPosts;
