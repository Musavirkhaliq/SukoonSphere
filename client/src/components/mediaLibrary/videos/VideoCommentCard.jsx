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
import VideoCommentReply from "./VideoCommentReply";
import DeleteModal from "../../shared/DeleteModal";
import PostActions from "../../shared/PostActions";
import UserAvatar from "../../shared/UserAvatar";
import ReactionButton from "../../shared/Reactions/ReactionButton";
import customFetch from "@/utils/customFetch";

const VideoCommentCard = ({ comment, videoId, onCommentUpdate }) => {
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch replies for this comment
  const fetchReplies = async () => {
    if (comment.totalReplies > 0) {
      setIsLoadingReplies(true);
      try {
        const { data } = await customFetch.get(`/video-comments/comments/${comment._id}/replies`);
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
    console.log('Video comment reaction updated:', { newReactionCounts, newUserReaction });

    // Calculate total reactions
    const totalCount = newReactionCounts.total !== undefined
      ? newReactionCounts.total
      : Object.entries(newReactionCounts)
        .filter(([key]) => key !== 'total')
        .reduce((sum, [_, count]) => sum + count, 0);

    setReactionCounts({
      ...newReactionCounts,
      total: totalCount
    });
    setUserReaction(newUserReaction);

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
      await customFetch.patch(`/video-comments/comments/${comment._id}`, {
        content: editContent,
      });
      setIsEditing(false);
      onCommentUpdate();
      toast.success("Comment updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update comment");
    }
  };

  // Handle delete comment
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await customFetch.delete(`/video-comments/comments/${comment._id}`);
      onCommentUpdate();
      toast.success("Comment deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete comment");
    } finally {
      setIsDeleting(false);
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
      await customFetch.post(`/video-comments/comments/${comment._id}/replies`, {
        content: replyContent,
        isAnonymous: isAnonymous,
      });
      setReplyContent("");
      setIsAnonymous(false);
      setShowReplyForm(false);
      fetchReplies();
      onCommentUpdate();
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
          username={comment.username || comment.createdBy?.name}
          userAvatar={comment.userAvatar || comment.createdBy?.avatar}
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
            className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none text-gray-700"
            rows="3"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              className="btn-red !py-1"
            >
              Cancel
            </button>
            <button onClick={handleSubmitEdit} className="btn-2 !py-1">
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2">{comment.content}</p>
      )}

      {/* Comment actions */}
      <div className="flex items-center gap-2 mt-3">
        <ReactionButton
          contentId={comment._id}
          contentType="videoComment"
          initialReactions={{ like: comment.totalLikes || 0 }}
          initialUserReaction={user && comment.likes?.includes(user._id) ? 'like' : null}
          onReactionChange={handleReactionChange}
        />
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-1 text-gray-500 hover:text-primary"
        >
          <FaReply />
          <span className="text-xs">Reply</span>
        </button>
        {comment.totalReplies > 0 && (
          <div className="">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-primary text-sm"
            >
              {showReplies
                ? "Hide Replies"
                : `Show ${comment.totalReplies} ${comment.totalReplies === 1 ? "Reply" : "Replies"}`}
            </button>
          </div>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none text-gray-700"
            rows="2"
          />
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
                className="form-checkbox h-3 w-3 text-[var(--secondary)] rounded focus:ring-[var(--secondary)]"
              />
              <span className="text-xs flex items-center gap-1 text-gray-600">
                <FaUserSecret
                  className={isAnonymous ? "text-[var(--secondary)]" : "text-gray-400"}
                  size={12}
                />
                Post anonymously
              </span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent("");
                  setIsAnonymous(false);
                }}
                className="btn-red !py-1"
              >
                Cancel
              </button>
              <button onClick={handleSubmitReply} className="btn-2 !py-1">
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replies */}
      {showReplies && (
        <div className="mt-3 border-l-2 border-gray-200 space-y-3">
          {isLoadingReplies ? (
            <div className="flex justify-center py-2">
              <FaSpinner className="animate-spin text-blue-500" />
            </div>
          ) : (
            replies.map((reply) => (
              <VideoCommentReply
                key={reply._id}
                reply={reply}
                commentId={comment._id}
                videoId={videoId}
                onReplyUpdate={fetchReplies}
              />
            ))
          )}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        itemType="comment"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default VideoCommentCard;
