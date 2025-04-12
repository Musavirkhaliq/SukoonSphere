import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import {
  FaRegHeart,
  FaHeart,
  FaReply,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaUserSecret,
  FaPaperPlane
} from "react-icons/fa";
import UserAvatar from "../shared/UserAvatar";
import customFetch from "@/utils/customFetch";

const PersonalStoryCommentCard = ({ comment, storyId, onCommentUpdate }) => {
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

  // Handle like comment
  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like comments!");
      return;
    }
    try {
      await customFetch.patch(`/personal-stories/comments/${comment._id}/like`);
      onCommentUpdate();
    } catch (error) {
      toast.error("Failed to like comment");
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
      onCommentUpdate();
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
      onCommentUpdate();
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
      onCommentUpdate();
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error(error.response?.data?.msg || "Failed to add reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Handle like reply
  const handleLikeReply = async (replyId) => {
    if (!user) {
      toast.error("Please login to like replies!");
      return;
    }
    try {
      await customFetch.patch(`/personal-stories/replies/${replyId}/like`);
      fetchReplies();
    } catch (error) {
      toast.error("Failed to like reply");
    }
  };

  // Handle delete reply
  const handleDeleteReply = async (replyId) => {
    if (!user) {
      toast.error("Please login to delete replies!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this reply?")) {
      return;
    }

    try {
      await customFetch.delete(`/personal-stories/replies/${replyId}`);
      fetchReplies();
      onCommentUpdate();
      toast.success("Reply deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete reply");
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
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>
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
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitEdit}
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
          onClick={handleLike}
          className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
        >
          {comment.likes?.includes(user?._id) ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
          <span className="text-xs">{comment.totalLikes || 0}</span>
        </button>

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
              {/* <UserAvatar
                username={user?.name || "Guest"}
                userAvatar={user?.avatar}
                size="verySmall"
              /> */}
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
          ) : replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply._id} className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      username={reply.username}
                      userAvatar={reply.userAvatar}
                      createdBy={reply.createdBy}
                      createdAt={reply.createdAt}
                      size="verySmall"
                    />
                    {reply.replyToUsername && reply.replyToUsername !== comment.username && (
                      <span className="text-xs text-gray-500">
                        replying to <span className="font-medium">{reply.replyToUsername}</span>
                      </span>
                    )}
                  </div>

                  {user && (user._id === reply.createdBy || (reply.isAnonymous && user._id === reply.realCreator)) && (
                    <button
                      onClick={() => handleDeleteReply(reply._id)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      <FaTrash size={12} />
                    </button>
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
