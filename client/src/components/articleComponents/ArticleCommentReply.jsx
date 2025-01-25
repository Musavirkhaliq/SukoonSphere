import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { formatDistanceToNow } from "date-fns";
import { FaThumbsUp } from "react-icons/fa";
import DeleteModal from "../shared/DeleteModal";
import PostActions from "../shared/PostActions";
import UserAvatar from "../shared/UserAvatar";
import { Link } from "react-router-dom";

const ArticleCommentReply = ({ reply, commentId, onReplyUpdate }) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like replies!");
      return;
    }
    try {
      await customFetch.patch(`/articles/replies/${reply._id}/like`);
      onReplyUpdate();
    } catch (error) {
      toast.error("Failed to like reply");
    }
  };

  const handleEdit = () => {
    if (!user || user._id !== reply.createdBy._id) {
      toast.error("You can only edit your own replies!");
      return;
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error("Reply cannot be empty!");
      return;
    }
    try {
      await customFetch.patch(`/articles/replies/${reply._id}`, {
        content: editContent,
      });
      setIsEditing(false);
      onReplyUpdate();
      toast.success("Reply updated successfully");
    } catch (error) {
      toast.error("Failed to update reply");
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await customFetch.delete(`/articles/replies/${reply._id}`);
      onReplyUpdate();
      toast.success("Reply deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete reply");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-gray-50 p-3 rounded-lg">
        {/* Reply Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserAvatar
              createdBy={reply.createdBy.name}
              username={reply.createdBy.name}
              userAvatar={reply.createdBy.avatar}
              createdAt={reply.createdAt}
              size="verySmall"
            />
          </div>

          {user && user._id === reply.createdBy._id && (
            <PostActions handleEdit={handleEdit} handleDelete={handleDelete} />
          )}
        </div>

        {/* Reply Content */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none text-gray-700"
              rows="2"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(reply.content);
                }}
                className="btn-red !py-1 text-sm"
              >
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="btn-2 !py-1 text-sm">
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm mt-1">
            {reply.replyTo && reply.replyTo._id !== reply.commentId && (
              <Link
                to={`/about/user/${reply.replyTo._id}`}
                className="font-medium text-[var(--ternery)] hover:underline"
              >
                @{reply.replyTo.name}{" "}
              </Link>
            )}
            {reply.content}
          </p>
        )}

        {/* Reply Actions */}
        <div className="flex items-center gap-4 mt-2 text-xs">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 ${
              user && reply.likes.includes(user._id)
                ? "text-primary"
                : "text-gray-500"
            }`}
          >
            <FaThumbsUp />
            <span>{reply.likes.length}</span>
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        title="Delete Reply"
        message="Are you sure you want to delete this reply?"
        itemType="reply"
        isLoading={isDeleting}
      />
    </>
  );
};

export default ArticleCommentReply;
