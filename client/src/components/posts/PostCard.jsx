import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import DeleteModal from "../shared/DeleteModal";
import customFetch from "@/utils/customFetch";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../shared/UserAvatar";
import PostActions from "./PostActions"; // Use the PostActions component
import { toast } from "react-toastify";
import EditPostModal from "./EditPostModal";
import PostCommentModal from "./PostCommentModal";

const PostCard = ({ post, user, onPostUpdate }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const [showCommentModal, setShowCommentModal] = useState(false);
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
      const postId = currentPost._id || post._id;
      console.log("Deleting post with ID:", postId);
      const response = await customFetch.delete(`/posts/${postId}`);
      console.log("Delete response:", response);
      toast.success("Post deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error?.response?.data?.msg || "Failed to delete post");
    }
  };

  // console.log("Post data:", { user,post, currentPost });

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <UserAvatar
              username={currentPost?.username}
              userAvatar={currentPost?.userAvatar}
              createdBy={currentPost?.createdBy}
              createdAt={currentPost?.createdAt}
              userAvatarFrame={currentPost?.avatarFrame}
              userAvatarAccessories={currentPost?.avatarAccessories}
              size="large"
            />
          </div>

          {user?._id &&
            ((currentPost?.createdBy &&
              String(user?._id) === String(currentPost?.createdBy)) ||
              (currentPost?.isAnonymous &&
                currentPost?.realCreator &&
                String(user?._id) === String(currentPost?.realCreator))) && (
              <PostActions
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isEditDeleteOnly={true} // Flag to show only edit/delete
              />
            )}
        </div>

        {currentPost?.imageUrl && (
          <div className="relative w-full aspect-[4/3] mb-4">
            <img
              src={currentPost?.imageUrl}
              alt="Post"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        )}

        <p className="text-gray-800 mb-4">{currentPost?.description}</p>

        {/* Tags Section */}
        {currentPost?.tags && currentPost?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentPost?.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Actions (Like, Comment, Share) */}
        <PostActions
          postId={currentPost?._id}
          initialLikesCount={currentPost?.totalLikes || 0}
          isInitiallyLiked={post?.likes?.includes(user?._id)}
          totalComments={currentPost?.totalComments || 0}
          onCommentClick={() => setShowCommentModal(true)}
          isEditDeleteOnly={false} // Show like, comment, share
        />

        {currentPost?.editedAt && (
          <div className="text-xs text-gray-400 text-right mt-2">
            edited{" "}
            {formatDistanceToNow(new Date(currentPost?.editedAt), {
              addSuffix: true,
            })}
          </div>
        )}
      </div>

      {showCommentModal && (
        <PostCommentModal
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          postId={currentPost?._id}
        />
      )}

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