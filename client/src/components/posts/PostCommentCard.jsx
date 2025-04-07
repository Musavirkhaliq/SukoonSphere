import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { formatDistanceToNow } from "date-fns";
import { FaReply, FaThumbsUp, FaUserSecret } from "react-icons/fa";
import DeleteModal from "../shared/DeleteModal";
import PostActions from "../shared/PostActions";
import UserAvatar from "../shared/UserAvatar";
import PostCommentReply from "./PostCommentReply";

const PostCommentCard = ({ comment, postId, onCommentUpdate }) => {
  const { user } = useUser();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isEditAnonymous, setIsEditAnonymous] = useState(comment.isAnonymous || false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [replies, setReplies] = useState([]);
  const fetchReplies = async () => {
    try {
      const { data } = await customFetch.get(
        `/posts/comments/${comment._id}/replies`
      );
      setReplies(data.replies);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchReplies();
  }, []);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like comments!");
      return;
    }
    try {
      await customFetch.patch(`/posts/comments/${comment._id}/like`);
      onCommentUpdate();
    } catch (error) {
      toast.error("Failed to like comment");
    }
  };

  const handleEdit = () => {
    if (!user || user._id !== comment.createdBy) {
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
      await customFetch.patch(`/posts/comments/${comment._id}`, {
        content: editContent,
        isAnonymous: isEditAnonymous,
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
      await customFetch.delete(`/posts/comments/${comment._id}`);
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
      await customFetch.post(`/posts/comments/${comment._id}/replies`, {
        postId,
        content: replyContent,
        replyToUserId: comment.createdBy._id,
      });
      setReplyContent("");
      setShowReplyForm(false);
      onCommentUpdate();
      fetchReplies();
      toast.success("Reply added successfully");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add reply");
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-1 border-1">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserAvatar
              createdBy={comment.createdBy}
              username={comment.username}
              userAvatar={comment.userAvatar}
              createdAt={comment.createdAt}
              size="verySmall"
            />
          </div>
          {user && String(user._id) === String(comment.createdBy) && (
            <PostActions handleEdit={handleEdit} handleDelete={handleDelete} />
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent resize-none text-gray-700"
              rows="3"
            />
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditAnonymous}
                  onChange={() => setIsEditAnonymous(!isEditAnonymous)}
                  className="form-checkbox h-3 w-3 text-[var(--secondary)] rounded focus:ring-[var(--secondary)]"
                />
                <span className="text-xs flex items-center gap-1 text-gray-600">
                  <FaUserSecret className={isEditAnonymous ? "text-[var(--secondary)]" : "text-gray-400"} size={12} />
                  Post anonymously
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                    setIsEditAnonymous(comment.isAnonymous || false);
                  }}
                  className="btn-red !py-1 !px-4"
                >
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="btn-2 !py-1 !px-4">
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-2">{comment.content}</p>
        )}

        {/* Comment Actions */}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 ${
              user && comment.likes.includes(user._id)
                ? "text-[var(--secondary)]"
                : "text-gray-500"
            } hover:text-[var(--secondary-hover)] transition-colors duration-200`}
          >
            <FaThumbsUp />
            <span>{comment.likes.length}</span>
          </button>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1 text-gray-500 hover:text-[var(--secondary)] transition-colors duration-200"
          >
            <FaReply />
            Reply
          </button>
          {comment.editedAt && (
            <span className=" text-[10px] text-gray-400 italic justify-self-end">
              Edited{" "}
              {formatDistanceToNow(new Date(comment.editedAt), {
                addSuffix: true,
              })}
            </span>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent resize-none text-gray-700"
              rows="2"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent("");
                }}
                className="btn-red !py-1 !px-4"
              >
                Cancel
              </button>
              <button onClick={handleSubmitReply} className="btn-2 !py-1 !px-4">
                Reply
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies?.length > 0 && (
          <div className="">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-[var(--secondary)] text-sm mt-2 hover:text-[var(--secondary-hover)] transition-colors duration-200"
            >
              {showReplies
                ? "Hide Replies"
                : `Show ${comment.replies.length} ${
                    comment.replies.length === 1 ? "Reply" : "Replies"
                  }`}
            </button>
          </div>
        )}
        {showReplies && (
          <div className="ml-4 mt-2 space-y-3">
            {replies.map((reply) => (
              <PostCommentReply
                reply={reply}
                key={reply._id}
                replyId={reply._id}
                commentId={comment._id}
                onReplyUpdate={fetchReplies}
                postId={comment.postId}
              />
            ))}
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

export default PostCommentCard;
