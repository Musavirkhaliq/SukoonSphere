import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import { FaUserSecret, FaSpinner, FaPaperPlane } from "react-icons/fa";
import UserAvatar from "../shared/UserAvatar";
import PersonalStoryCommentCard from "./PersonalStoryCommentCard";

const PersonalStoryComments = ({ storyId }) => {
  const { user } = useUser();
  const [commentContent, setCommentContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref, inView } = useInView();

  // Fetch comments
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["storyComments", storyId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await customFetch.get(
        `/personal-stories/${storyId}/comments?page=${pageParam}&limit=10`
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

  // Load more comments when scrolling
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Submit a new comment
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

    setIsSubmitting(true);
    try {
      await customFetch.post(`/personal-stories/${storyId}/comments`, {
        content: commentContent,
        isAnonymous: isAnonymous,
      });
      setCommentContent("");
      setIsAnonymous(false);
      refetch();
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Flatten comments data from all pages
  const allComments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-6">
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex gap-3 mb-3">
          <UserAvatar
            username={user?.name || "Guest"}
            userAvatar={user?.avatar}
            size="small"
          />
          <div className="flex-1">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder={user ? "Add a comment..." : "Please login to comment"}
              className="w-full px-4 py-2 bg-[var(--pure)] rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary min-h-[80px]"
              disabled={!user}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
              className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={!user}
            />
            <span className="text-sm flex items-center gap-1">
              <FaUserSecret className={isAnonymous ? "text-blue-600" : "text-gray-500"} />
              Comment anonymously
            </span>
          </label>

          <button
            type="submit"
            disabled={!user || isSubmitting}
            className="btn-2 flex items-center gap-2"
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
            Comment
          </button>
        </div>
      </form>

      {/* Comments list */}
      {status === "loading" && !allComments.length ? (
        <div className="flex justify-center py-4">
          <FaSpinner className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : allComments.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
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
                <PersonalStoryCommentCard
                  comment={comment}
                  storyId={storyId}
                  onCommentUpdate={refetch}
                />
              </div>
            ))}
          </div>

          {/* Load more comments */}
          {hasNextPage && (
            <div ref={ref} className="flex justify-center py-4">
              {isFetchingNextPage ? (
                <FaSpinner className="w-6 h-6 text-blue-500 animate-spin" />
              ) : (
                <div className="h-8" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalStoryComments;
