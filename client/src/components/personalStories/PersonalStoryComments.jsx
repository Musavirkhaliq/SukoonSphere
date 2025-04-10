import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import { FaUserSecret, FaSpinner, FaPaperPlane, FaRegHeart, FaHeart, FaReply, FaEdit, FaTrash } from "react-icons/fa";
import UserAvatar from "../shared/UserAvatar";
import { formatDistanceToNow } from "date-fns";

const PersonalStoryComments = ({ storyId }) => {
  const { user } = useUser();
  const [commentContent, setCommentContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
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
    }
  };

  // Submit a reply to a comment
  const handleSubmitReply = async (commentId) => {
    if (!user) {
      toast.error("Please login to reply!");
      return;
    }
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty!");
      return;
    }

    try {
      await customFetch.post(`/personal-stories/comments/${commentId}/replies`, {
        content: replyContent,
        isAnonymous: isAnonymous,
      });
      setReplyContent("");
      setReplyingTo(null);
      setIsAnonymous(false);
      refetch();
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error(error.response?.data?.msg || "Failed to add reply");
    }
  };

  // Update a comment
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    try {
      await customFetch.patch(`/personal-stories/comments/${commentId}`, {
        content: editContent,
      });
      setEditingComment(null);
      setEditContent("");
      refetch();
      toast.success("Comment updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update comment");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await customFetch.delete(`/personal-stories/comments/${commentId}`);
      refetch();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete comment");
    }
  };

  // Delete a reply
  const handleDeleteReply = async (replyId) => {
    try {
      await customFetch.delete(`/personal-stories/replies/${replyId}`);
      refetch();
      toast.success("Reply deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete reply");
    }
  };

  // Like a comment
  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast.error("Please login to like comments!");
      return;
    }

    try {
      await customFetch.patch(`/personal-stories/comments/${commentId}/like`);
      refetch();
    } catch (error) {
      toast.error("Failed to like comment");
    }
  };

  // Like a reply
  const handleLikeReply = async (replyId) => {
    if (!user) {
      toast.error("Please login to like replies!");
      return;
    }

    try {
      await customFetch.patch(`/personal-stories/replies/${replyId}/like`);
      refetch();
    } catch (error) {
      toast.error("Failed to like reply");
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
            disabled={!user}
            className="btn-2 flex items-center gap-2"
          >
            <FaPaperPlane />
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
          {allComments.map((comment) => (
            <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm">
              {/* Comment header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <UserAvatar
                    username={comment.username}
                    userAvatar={comment.userAvatar}
                    size="small"
                  />
                  <div>
                    <div className="font-medium">{comment.username}</div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      {comment.editedAt && " (edited)"}
                    </div>
                  </div>
                </div>

                {/* Comment actions */}
                {user && (user._id === comment.createdBy || (comment.isAnonymous && user._id === comment.realCreator)) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingComment(comment._id);
                        setEditContent(comment.content);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment content */}
              {editingComment === comment._id ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--pure)] rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 min-h-[80px]"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setEditingComment(null)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 mt-1">{comment.content}</p>
              )}

              {/* Comment actions */}
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  {comment.likes?.includes(user?._id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span className="text-xs">{comment.likes?.length || 0}</span>
                </button>

                <button
                  onClick={() => {
                    if (replyingTo === comment._id) {
                      setReplyingTo(null);
                    } else {
                      setReplyingTo(comment._id);
                      setReplyContent("");
                    }
                  }}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <FaReply />
                  <span className="text-xs">Reply</span>
                </button>
              </div>

              {/* Reply form */}
              {replyingTo === comment._id && (
                <div className="mt-3 pl-8 border-l-2 border-gray-200">
                  <div className="flex gap-2 mb-2">
                    <UserAvatar
                      username={user?.name || "Guest"}
                      userAvatar={user?.avatar}
                      size="verySmall"
                    />
                    <div className="flex-1">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full px-3 py-2 bg-[var(--pure)] rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 min-h-[60px] text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={() => setIsAnonymous(!isAnonymous)}
                        className="form-checkbox h-3 w-3 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs flex items-center gap-1">
                        <FaUserSecret className={isAnonymous ? "text-blue-600" : "text-gray-500"} size={12} />
                        Reply anonymously
                      </span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitReply(comment._id)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                      >
                        <FaPaperPlane size={10} />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 pl-8 border-l-2 border-gray-200 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            username={reply.username}
                            userAvatar={reply.userAvatar}
                            size="verySmall"
                          />
                          <div>
                            <div className="font-medium text-sm">{reply.username}</div>
                            <div className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                              {reply.editedAt && " (edited)"}
                            </div>
                          </div>
                        </div>

                        {user && (user._id === reply.createdBy || (reply.isAnonymous && user._id === reply.realCreator)) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteReply(reply._id)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-800 text-sm mt-1">{reply.content}</p>

                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => handleLikeReply(reply._id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          {reply.likes?.includes(user?._id) ? (
                            <FaHeart className="text-red-500" size={12} />
                          ) : (
                            <FaRegHeart size={12} />
                          )}
                          <span className="text-xs">{reply.totalLikes || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

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
