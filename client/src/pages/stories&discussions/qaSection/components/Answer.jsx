import AnswersCommentSlide from "@/components/qa/AnswersCommentSlide";
import DeleteModal from "@/components/shared/DeleteModal";
import PostActions from "@/components/shared/PostActions";
import UserAvatar from "@/components/shared/UserAvatar";
import customFetch from "@/utils/customFetch";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Answer = ({ answer: initialAnswer, user, answerCount, mostLikedAnswer, preview }) => {
  const navigate = useNavigate();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showAnswerDeleteModal, setShowAnswerDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLiked, setIsLiked] = useState(
    initialAnswer.likes?.includes(user?._id)
  );
  const [likeCount, setLikeCount] = useState(initialAnswer.totalLikes || 0);
  const [answer, setAnswer] = useState(initialAnswer);
  const [editedContext, setEditedContext] = useState(answer.context);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!!mostLikedAnswer); // Auto-expand the most liked answer
  const [shouldTruncate, setShouldTruncate] = useState(false);

  // Use a shorter character limit for preview mode
  const MAX_CHARS = preview ? 150 : 300;

  // Check if the answer is long enough to truncate
  useEffect(() => {
    if (answer.context && answer.context.length > MAX_CHARS) {
      setShouldTruncate(true);
    }
  }, [answer.context]);

  const handleDeleteAnswer = async () => {
    try {
      await customFetch.delete(`/qa-section/question/answer/${answer._id}`);
      setShowAnswerDeleteModal(false);

      toast.success("Answer deleted successfully");
      answerCount === 1 ? navigate("/qa-section") : window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikeAnswer = async () => {
    if (!user) {
      toast.error("Please login to like an answer");
      return;
    }
    try {
      await customFetch.patch(`/qa-section/question/answer/${answer._id}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContext(answer.context);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContext(answer.context);
  };

  const handleSaveEdit = async () => {
    if (!editedContext.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    try {
      const response = await customFetch.patch(
        `/qa-section/answer/${answer._id}`,
        { context: editedContext }
      );
      setAnswer(response.data.answer);
      setIsEditing(false);
      toast.success("Answer updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Failed to update answer");
    }
  };

  return (
    <div className={`mt-2 ${preview ? 'p-3' : 'p-4'} bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 ${preview ? 'border-gray-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <UserAvatar
          createdBy={answer?.author?.userId}
          username={answer?.author?.username}
          userAvatar={answer?.author?.userAvatar}
          createdAt={answer?.createdAt}
          compact={preview} // Use compact avatar for preview mode
        />
        {!preview && user && answer.author?.userId === user?._id && (
          <PostActions
            handleEdit={handleEdit}
            handleDelete={() => setShowAnswerDeleteModal(true)}
          />
        )}
      </div>
      <div className="prose max-w-none mb-2">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedContext}
              onChange={(e) => setEditedContext(e.target.value)}
              placeholder="Edit your answer..."
              className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary min-h-[100px] resize-none"
            />
            <div className="flex justify-end gap-3 pt-3 border-t">
              <button onClick={handleCancelEdit} className="btn-red">
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editedContext.trim()}
                className="btn-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-base mb-2 leading-relaxed text-[var(--grey--800)]">
              {shouldTruncate && !isExpanded
                ? `${answer.context.substring(0, MAX_CHARS)}...`
                : answer.context}
            </p>

            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors mt-1"
              >
                {isExpanded ? (
                  <>
                    <FiChevronUp className="w-4 h-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <FiChevronDown className="w-4 h-4" />
                    Read more
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
      {/* Show interaction buttons in a more compact way for preview mode */}
      <div className="flex items-center gap-4 text-gray-500">
        <button
          className={`flex items-center gap-1 ${
            isLiked ? "text-red-500" : ""
          } hover:text-red-500 transition-colors ${preview ? 'text-sm' : ''}`}
          onClick={handleLikeAnswer}
          disabled={preview} // Disable interactions in preview mode
        >
          <FaRegHeart className={`${isLiked ? "fill-current" : ""} ${preview ? 'w-3 h-3' : ''}`} />
          <span>{likeCount}</span>
        </button>
        {!preview ? (
          <div
            onClick={() => setShowCommentModal(true)}
            className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer"
          >
            <FaRegComment />
            <span>{answer.totalComments}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm">
            <FaRegComment className="w-3 h-3" />
            <span>{answer.totalComments}</span>
          </div>
        )}
        {answer.editedAt && !preview && (
          <span className="text-xs text-gray-400 ml-auto">
            edited{" "}
            {formatDistanceToNow(new Date(answer.editedAt), {
              addSuffix: true,
            })}
          </span>
        )}
      </div>

      {showCommentModal && (
        <AnswersCommentSlide
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          answerId={answer._id}
        />
      )}

      <DeleteModal
        isOpen={showAnswerDeleteModal}
        onClose={() => setShowAnswerDeleteModal(false)}
        onDelete={handleDeleteAnswer}
        title="Delete Answer"
        message="Are you sure you want to delete this answer?"
        itemType="answer"
      />
    </div>
  );
};

export default Answer;
