import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { formatDistanceToNow } from "date-fns";
import { FaReply, FaThumbsUp } from "react-icons/fa";
import ArticleCommentReply from "./ArticleCommentReply";
import DeleteModal from "../shared/DeleteModal";
import PostActions from "../shared/PostActions";
import UserAvatar from "../shared/UserAvatar";

const ArticleCommentCard = ({ comment, articleId, onCommentUpdate }) => {
  const { user } = useUser();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like comments!");
      return;
    }
    try {
      await customFetch.patch(`/articles/comments/${comment._id}/like`);
      onCommentUpdate();
    } catch (error) {
      toast.error("Failed to like comment");
    }
  };

  const handleEdit = () => {
    if (!user || user._id !== comment.createdBy._id) {
      toast.error("You can only edit your own comments!");
      return;
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }
    try {
      await customFetch.patch(`/articles/comments/${comment._id}`, {
        content: editContent,
      });
      setIsEditing(false);
      onCommentUpdate();
      toast.success("Comment updated successfully");
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await customFetch.delete(`/articles/comments/${comment._id}`);
      onCommentUpdate();
      toast.success("Comment deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!user) {
      toast.error("Please login to reply!");
      return;
    }
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty!");
      return;
    }
    try {
      await customFetch.post(`/articles/comments/${comment._id}/replies`, {
        content: replyContent,
        replyToUserId: comment.createdBy._id,
      });
      setReplyContent("");
      setShowReplyForm(false);
      onCommentUpdate();
      toast.success("Reply added successfully");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add reply");
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserAvatar
              createdBy={comment.createdBy.name}
              username={comment.createdBy.name}
              userAvatar={comment.createdBy.avatar}
              createdAt={comment.createdAt}
              size="verySmall"
            />
          </div>
          {user && user._id === comment.createdBy._id && (
            <PostActions handleEdit={handleEdit} handleDelete={handleDelete} />
          )}
        </div>

        {/* Comment Content */}
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
              <button onClick={handleSaveEdit} className="btn-2 !py-1">
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2">{comment.content}</p>
        )}

        {/* Comment Actions */}
        <div className="flex items-center gap-4 mt-3 text-sm">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 ${
              user && comment.likes.includes(user._id)
                ? "text-primary"
                : "text-gray-500"
            }`}
          >
            <FaThumbsUp />
            <span>{comment.likes.length}</span>
          </button>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1 text-gray-500 hover:text-primary"
          >
            <FaReply />
            Reply
          </button>
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
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent("");
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
        )}

        {/* Replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-primary text-sm"
            >
              {showReplies
                ? "Hide Replies"
                : `Show ${comment.replies.length} ${
                    comment.replies.length === 1 ? "Reply" : "Replies"
                  }`}
            </button>
            {showReplies && (
              <div className="ml-4 mt-2 space-y-3">
                {comment.replies.map((reply) => (
                  <ArticleCommentReply
                    key={reply._id}
                    reply={reply}
                    commentId={comment._id}
                    onReplyUpdate={onCommentUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This will also delete all replies to this comment."
        itemType="comment"
        isLoading={isDeleting}
      />
    </>
  );
};

export default ArticleCommentCard;
