import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import {
  FaReply,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaUserSecret,
} from "react-icons/fa";
import UserAvatar from "../shared/UserAvatar";
import customFetch from "@/utils/customFetch";
import PersonalStoryCommentReply from "./PersonalStoryCommentReply";
import PostActions from "../shared/PostActions";
import ReactionButton from "../shared/Reactions/ReactionButton";

const PersonalStoryCommentCard = ({ comment, storyId, refetch }) => {
  const { user } = useUser();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replies, setReplies] = useState([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Fetch replies for this comment
  const fetchReplies = async () => {
    if (comment.totalReplies > 0) {
      setIsLoadingReplies(true);
      try {
        const { data } = await customFetch.get(`/personal-stories/comments/${comment._id}/replies`);
        setReplies(data.replies);
      } catch (error) {
        console.error("Error fetching replies:", error);
      } finally {
        setIsLoadingReplies(false);
      }
    }
  };

  useEffect(() => {
    if (showReplies && replies.length === 0 && comment.totalReplies > 0) {
      fetchReplies();
    }
  }, [showReplies]);

  // State to track reaction counts and user reaction
  const [reactionCounts, setReactionCounts] = useState({ like: comment.totalLikes || 0 });
  const [userReaction, setUserReaction] = useState(user && comment.likes?.includes(user?._id) ? 'like' : null);

  // Handle reaction change
  const handleReactionChange = (newReactionCounts, newUserReaction) => {
    console.log('Personal story comment reaction updated:', { newReactionCounts, newUserReaction });

    // Calculate total reactions (use the 'total' property if it exists, otherwise sum all reaction counts)
    const totalCount = newReactionCounts.total !== undefined
      ? newReactionCounts.total
      : Object.entries(newReactionCounts)
          .filter(([key]) => key !== 'total')
          .reduce((sum, [_, count]) => sum + count, 0);

    // Update local state with the new reaction data
    setReactionCounts({
      ...newReactionCounts,
      total: totalCount
    });
    setUserReaction(newUserReaction);

    // When reaction changes, refetch to update the UI
    if (refetch) {
      refetch();
    }
  };

  // Handle edit comment
  const handleEdit = () => {
    if (!user) {
      toast.error("Please login to edit comments!");
      return;
    }

    const isAuthorized =
      (comment.createdBy === user._id) ||
      (comment.isAnonymous && comment.realCreator === user._id);

    if (!isAuthorized) {
      toast.error("You can only edit your own comments!");
      return;
    }

    setIsEditing(true);
    setEditContent(comment.content);
  };

  // Submit edited comment
  const handleSubmitEdit = async () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    try {
      await customFetch.patch(`/personal-stories/comments/${comment._id}`, {
        content: editContent,
      });
      setIsEditing(false);
      refetch();
      toast.success("Comment updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update comment");
    }
  };

  // Handle delete comment
  const handleDelete = async () => {
    if (!user) {
      toast.error("Please login to delete comments!");
      return;
    }

    const isAuthorized =
      (comment.createdBy === user._id) ||
      (comment.isAnonymous && comment.realCreator === user._id);

    if (!isAuthorized) {
      toast.error("You can only delete your own comments!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await customFetch.delete(`/personal-stories/comments/${comment._id}`);
      refetch();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete comment");
    }
  };

  // Submit reply
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to reply!");
      return;
    }
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty!");
      return;
    }

    setIsSubmittingReply(true);
    try {
      await customFetch.post(`/personal-stories/comments/${comment._id}/replies`, {
        content: replyContent,
        isAnonymous: isAnonymous,
      });
      setReplyContent("");
      setIsAnonymous(false);
      setShowReplyForm(false);
      fetchReplies();
      refetch();
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error(error.response?.data?.msg || "Failed to add reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };




  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {/* Comment header */}
      <div className="flex justify-between items-start mb-3">
        <UserAvatar
          username={comment.username}
          userAvatar={comment.userAvatar}
          createdBy={comment.createdBy}
          createdAt={comment.createdAt}
          size="verySmall"
        />

        {user && (user._id === comment.createdBy || (comment.isAnonymous && user._id === comment.realCreator)) && (
          <PostActions handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
      </div>

      {/* Comment content */}
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--pure)] rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 min-h-[80px]"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="btn-red !py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitEdit}
              className="btn-2 !py-2"
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
        <ReactionButton
          contentId={comment._id}
          contentType="personalStoryComment"
          initialReactions={{
            like: comment.totalLikes || 0,
            total: comment.totalLikes || 0
          }}
          initialUserReaction={user && comment.likes?.includes(user?._id) ? 'like' : null}
          onReactionChange={handleReactionChange}
        />

        <button
          onClick={() => {
            setShowReplyForm(!showReplyForm);
            if (showReplyForm) {
              setReplyContent("");
            }
          }}
          className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
        >
          <FaReply />
          <span className="text-xs">Reply</span>
        </button>

        {comment.totalReplies > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-[var(--ternery)] hover:text-blue-500 transition-colors"
          >
            <span className="text-xs">
              {showReplies ? "Hide replies" : `Show ${comment.totalReplies} ${comment.totalReplies === 1 ? "reply" : "replies"}`}
            </span>
          </button>
        )}
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <div className="mt-3 pl-8 border-l-2 border-gray-200">
          <form onSubmit={handleSubmitReply}>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 bg-[var(--pure)] rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 min-h-[60px] text-sm"
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
                  className="form-checkbox h-3 w-3 text-blue-600 rounded focus:ring-blue-500"
                  disabled={!user}
                />
                <span className="text-xs flex items-center gap-1">
                  <FaUserSecret className={isAnonymous ? "text-blue-600" : "text-gray-500"} size={12} />
                  Reply anonymously
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="btn-red !py-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReply || !user}
                  className="btn-2 !py-1"
                >
                  {isSubmittingReply && (
                    <FaSpinner className="animate-spin" size={10} />
                  )}
                  Reply
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Replies */}
      {showReplies && (
        <div className="mt-3 pl-8 border-l-2 border-gray-200 space-y-3">
          {isLoadingReplies ? (
            <div className="flex justify-center py-2">
              <FaSpinner className="animate-spin text-blue-500" />
            </div>
          ) : replies.length > 0 && !isLoadingReplies ? (
            replies.map((reply) => (
              <PersonalStoryCommentReply
                key={reply._id}
                reply={reply}
                commentId={comment._id}
                onReplyUpdate={fetchReplies}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 py-2">No replies yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalStoryCommentCard;
