import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import PostCard from "@/components/posts/PostCard";
import PostModal from "@/components/posts/PostModel";
import PostFilter from "@/components/posts/PostFilter";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { FaPlus } from "react-icons/fa";

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
        <button
          onClick={() => {
            if (!user) {
              toast.error("Please login to create a post!");
              return;
            }
            setShowModal(true);
          }}
          className="btn-2 flex gap-2 w-full sm:w-auto"
        >
          <FaPlus />
          Add Post
        </button>
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

export default AllPosts;
