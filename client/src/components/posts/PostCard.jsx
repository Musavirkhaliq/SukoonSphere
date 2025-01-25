import React, { useState } from "react";
import {
  FaRegHeart,
  FaRegComment,
  FaUserPlus,
  FaUserMinus,
} from "react-icons/fa";
import DeleteModal from "../shared/DeleteModal";
import customFetch from "@/utils/customFetch";
import { Link, useNavigate } from "react-router-dom";
import UserAvatar from "../shared/UserAvatar";
import PostActions from "../shared/PostActions";
import { toast } from "react-toastify";
import EditPostModal from "./EditPostModal";
import { formatDistanceToNow } from "date-fns";

const PostCard = ({
  post,
  user,
  comment = "link",
  totalComments,
  onCommentClick,
  onPostUpdate,
}) => {
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(user?._id));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.totalLikes || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const navigate = useNavigate();
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handlePostUpdate = (updatedPost) => {
    setCurrentPost(updatedPost);
    if (onPostUpdate) {
      onPostUpdate(updatedPost);
    }
  };

  const handleDeletePost = async () => {
    try {
      await customFetch.delete(`/posts/${post._id}`);
      window.location.reload();
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like this post!");
      navigate("/auth/sign-up");
      return;
    }
    setIsLoading(true);
    try {
      await customFetch.patch(`/posts/${currentPost._id}/like`);
      setIsLiked(!isLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <UserAvatar
              username={currentPost.username}
              userAvatar={currentPost.userAvatar}
              createdBy={currentPost.createdBy}
              createdAt={currentPost.createdAt}
              size="medium"
            />
          </div>

          {user?._id === currentPost.createdBy && (
            <PostActions handleEdit={handleEdit} handleDelete={handleDelete} />
          )}
        </div>

        {currentPost.imageUrl && (
          <img
            src={currentPost.imageUrl}
            alt="Post"
            className="w-full object-cover rounded-lg mb-4"
          />
        )}
        <p className="text-gray-800 mb-4">{currentPost.description}</p>

        {/* Tags Section */}
        {currentPost.tags && currentPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentPost.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-gray-500">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-1 ${
              isLiked ? "text-red-500" : ""
            } lg:hover:text-red-500 transition-colors`}
          >
            <FaRegHeart className={isLiked ? "fill-current" : ""} />
            <span>{likesCount}</span>
          </button>

          {comment === "link" ? (
            <Link
              to={`/posts/${currentPost._id}`}
              className="flex items-center gap-1 hover:text-blue-500"
            >
              <FaRegComment />
              <span>{currentPost.totalComments || 0}</span>
            </Link>
          ) : (
            <button
              className="flex items-center gap-1 hover:text-blue-500"
              onClick={() => onCommentClick(currentPost._id)}
            >
              <FaRegComment />
              <span>{totalComments}</span>
            </button>
          )}

          {currentPost.editedAt && (
            <span className="text-xs text-gray-400 ml-auto">
              edited{" "}
              {formatDistanceToNow(new Date(currentPost.editedAt), {
                addSuffix: true,
              })}
            </span>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeletePost}
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
        />
      )}

      {showEditModal && (
        <EditPostModal
          post={currentPost}
          onClose={() => setShowEditModal(false)}
          onPostUpdated={handlePostUpdate}
        />
      )}
    </>
  );
};

export default PostCard;
