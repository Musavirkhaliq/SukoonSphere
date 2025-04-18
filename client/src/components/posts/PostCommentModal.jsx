import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import PostComments from "./PostComments";
import customFetch from "@/utils/customFetch";
import UserAvatar from "../shared/UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/context/UserContext";
import PostActions from "./PostActions";

const PostCommentModal = ({ isOpen, onClose, postId }) => {
  const { user } = useUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        const { data } = await customFetch.get(`/posts/${postId}`);
        setPost(data.post);

        // Set initial like state
        if (user && data.post.likes) {
          setIsLiked(data.post.likes.includes(user._id));
          setLikesCount(data.post.totalLikes || data.post.likes.length || 0);
        } else {
          setLikesCount(data.post.totalLikes || data.post.likes?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPost();
    }
  }, [postId, isOpen, user]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-[90] transition-opacity duration-300 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 animate-modalFadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white z-10 rounded-t-xl">
            <h2 className="text-xl font-bold text-gray-900">Post & Comments</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close comments"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Fixed Post Content */}
              {post && (
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <UserAvatar
                      username={post.username}
                      userAvatar={post.userAvatar}
                      createdBy={post.createdBy}
                      createdAt={post.createdAt}
                      size="medium"
                    />
                  </div>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="w-full object-cover rounded-lg mb-4 max-h-[300px]"
                    />
                  )}

                  <p className="text-gray-800 mb-4">{post.description}</p>

                  {/* Tags Section */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Post Actions */}
                  <PostActions
                    postId={postId}
                    initialLikesCount={likesCount}
                    isInitiallyLiked={isLiked}
                    totalComments={post.totalComments}
                  />

                  {/* Edited Timestamp */}
                  {post.editedAt && (
                    <div className="mt-2 text-xs text-gray-400 text-right">
                      edited {formatDistanceToNow(new Date(post.editedAt), { addSuffix: true })}
                    </div>
                  )}
                </div>
              )}

              {/* Scrollable Comments Section */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-white">
                <PostComments postId={postId} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PostCommentModal;