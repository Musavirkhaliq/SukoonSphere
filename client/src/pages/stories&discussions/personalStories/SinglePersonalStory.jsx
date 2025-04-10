import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaUser,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import EditStoryModal from "@/components/personalStories/EditStoryModal";
import DeleteModal from "@/components/shared/DeleteModal";
import PersonalStoryComments from "@/components/personalStories/PersonalStoryComments";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";

const SinglePersonalStory = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showComments, setShowComments] = useState(true);

  // Fetch story data
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["personalStory", id],
    queryFn: async () => {
      const response = await customFetch.get(`/personal-stories/${id}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const story = data?.story;

  // Update like state when data is loaded
  useEffect(() => {
    if (story) {
      setIsLiked(story.isLiked || false);
      setLikesCount(story.totalLikes || 0);
    }
  }, [story]);

  // Calculate reading time
  const calculateReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    return `${readingTime} min read`;
  };

  // Handle like
  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like this story!");
      navigate("/auth/sign-up");
      return;
    }

    try {
      await customFetch.patch(`/personal-stories/${id}/like`);
      setIsLiked(!isLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.log(error);
      toast.error("Failed to like story");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await customFetch.delete(`/personal-stories/${id}`);
      toast.success("Story deleted successfully");
      navigate("/personal-stories");
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error(error?.response?.data?.msg || "Failed to delete story");
    }
  };

  // Handle story update
  const handleStoryUpdate = (updatedStory) => {
    refetch();
  };

  // Check if user is the author
  const isAuthor = user && story && (
    (story.author === user._id) ||
    (story.isAnonymous && story.realCreator === user._id)
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Story</h2>
        <p className="text-gray-700 mb-6">
          {error?.response?.data?.msg || "The story could not be found or has been removed."}
        </p>
        <Link to="/personal-stories" className="btn-2 inline-flex items-center gap-2">
          <FaArrowLeft />
          Back to Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        to="/personal-stories"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft />
        Back to Stories
      </Link>

      {/* Story header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{story.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            {story.authorAvatar ? (
              <img
                src={story.authorAvatar}
                alt={story.authorName}
                className="w-8 h-8 object-cover rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <FaUser className="w-4 h-4 text-purple-600" />
              </div>
            )}
            <span>{story.authorName || "Anonymous"}</span>
          </div>

          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-gray-400" />
            <span>{format(new Date(story.createdAt), 'MMM d, yyyy')}</span>
          </div>

          <div className="flex items-center gap-1">
            <FaClock className="text-gray-400" />
            <span>{calculateReadingTime(story.content)}</span>
          </div>
        </div>

        {/* Story actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
            >
              {isLiked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors"
            >
              <FaRegComment />
              <span>{story.totalComments || 0} {story.totalComments === 1 ? 'Comment' : 'Comments'}</span>
            </button>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                title="Edit story"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                title="Delete story"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Story image */}
      {story.imageUrl && (
        <div className="mb-8">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full max-h-96 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Story content */}
      <div className="prose prose-lg max-w-none mb-12 article-body">
        <div
          dangerouslySetInnerHTML={{ __html: story.content }}
        />
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-8 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaRegComment />
            Comments
          </h2>
          <PersonalStoryComments storyId={id} />
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && (
        <EditStoryModal
          story={story}
          onClose={() => setShowEditModal(false)}
          onStoryUpdated={handleStoryUpdate}
        />
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDelete}
          title="Delete Story"
          message="Are you sure you want to delete this story? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default SinglePersonalStory;
