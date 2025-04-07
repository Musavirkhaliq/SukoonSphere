import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { FaSpinner } from "react-icons/fa";
import PostCommentCard from "./PostCommentCard";

const PostComments = ({ postId }) => {
  const { user } = useUser();
  const [commentContent, setCommentContent] = useState("");
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["postComments", postId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await customFetch.get(
        `/posts/${postId}/comments?page=${pageParam}&limit=10`
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
  });

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment!");
      return;
    }
    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    try {
      await customFetch.post(`/posts/${postId}/comments`, {
        content: commentContent,
      });
      setCommentContent("");
      refetch();
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add comment");
    }
  };

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('Loading more comments...');
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Ensure the intersection observer is properly set up
  React.useEffect(() => {
    // Force a check for more comments when the component mounts
    if (hasNextPage && !isFetchingNextPage) {
      const timer = setTimeout(() => {
        fetchNextPage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-4">
        <FaSpinner className="animate-spin h-6 w-6 text-primary" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center text-red-500 py-4">
        Error loading comments
      </div>
    );
  }

  const allComments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div>
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-4 bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder={
            user ? "Write your comment..." : "Please login to comment"
          }
          className="w-full p-3 border-b border-gray-100 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-none text-gray-700 transition-all duration-200"
          rows="2"
          disabled={!user}
        />
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
          {!user && (
            <p className="text-xs text-gray-500">Login to comment</p>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={!user || !commentContent.trim()}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${!user || !commentContent.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]'}`}
            >
              Post
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">
            {allComments.length > 0
              ? `Comments (${allComments.length}${hasNextPage ? '+' : ''})`
              : 'Comments'}
          </h3>
          <div className="text-xs text-gray-500">
            {allComments.length > 0 && 'Most recent first'}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {allComments.map((comment) => (
            <div key={comment._id} className="py-3 first:pt-0">
              <PostCommentCard
                comment={comment}
                postId={postId}
                onCommentUpdate={refetch}
              />
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div ref={ref} className="py-3 text-center">
          {isFetchingNextPage && (
            <div className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin h-4 w-4 text-primary" />
              <span className="text-gray-500 text-xs">Loading more...</span>
            </div>
          )}
          {!hasNextPage && allComments.length > 0 && (
            <p className="text-gray-400 text-xs py-1">No more comments</p>
          )}
        </div>

        {allComments.length === 0 && (
          <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComments;
