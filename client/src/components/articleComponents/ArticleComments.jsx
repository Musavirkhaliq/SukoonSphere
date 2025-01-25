import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import ArticleCommentCard from "./ArticleCommentCard";
import { FaSpinner } from "react-icons/fa";

const ArticleComments = ({ articleId }) => {
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
    queryKey: ["articleComments", articleId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await customFetch.get(
        `/articles/${articleId}/comments?page=${pageParam}&limit=10`
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
      await customFetch.post(`/articles/${articleId}/comments`, {
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
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

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
    <div className="mt-8">
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder={
            user ? "Write your comment..." : "Please login to comment"
          }
          className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none text-gray-700"
          rows="3"
          disabled={!user}
        />
        <button type="submit" disabled={!user} className="btn-2 mt-2">
          Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {allComments.map((comment) => (
          <ArticleCommentCard
            key={comment._id}
            comment={comment}
            articleId={articleId}
            onCommentUpdate={refetch}
          />
        ))}

        {/* Loading indicator */}
        <div ref={ref} className="py-4 text-center">
          {isFetchingNextPage && (
            <FaSpinner className="animate-spin h-6 w-6 mx-auto text-primary" />
          )}
          {!hasNextPage && allComments.length > 0 && (
            <p className="text-gray-500">No more comments</p>
          )}
        </div>

        {allComments.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default ArticleComments;
