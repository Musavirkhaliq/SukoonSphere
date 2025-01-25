import DeleteModal from "@/components/shared/DeleteModal";
import PostActions from "@/components/shared/PostActions";
import UserAvatar from "@/components/shared/UserAvatar";
import customFetch from "@/utils/customFetch";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Answer = ({ answer: initialAnswer, user, answerCount }) => {
  const navigate = useNavigate();
  const [showAnswerDeleteModal, setShowAnswerDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLiked, setIsLiked] = useState(
    initialAnswer.likes?.includes(user?._id)
  );
  const [likeCount, setLikeCount] = useState(initialAnswer.totalLikes || 0);
  const [answer, setAnswer] = useState(initialAnswer);
  const [editedContext, setEditedContext] = useState(answer.context);
  const [isEditing, setIsEditing] = useState(false);

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
    <div className=" mt-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <UserAvatar
          createdBy={answer?.author?.userId}
          username={answer?.author?.username}
          userAvatar={answer?.author?.userAvatar}
          createdAt={answer?.createdAt}
        />
        {user && answer.author?.userId === user?._id && (
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
          <p className="text-base mb-2 leading-relaxed text-[var(--grey--800)]">
            {answer.context}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 text-gray-500">
        <button
          className={`flex items-center gap-2 ${
            isLiked ? "text-red-500" : ""
          } hover:text-red-500 transition-colors`}
          onClick={handleLikeAnswer}
        >
          <FaRegHeart className={isLiked ? "fill-current" : ""} />
          <span>{likeCount}</span>
        </button>
        <Link
          to={`/QA-section/question/answer/${answer._id}/comments`}
          className="flex items-center gap-2 hover:text-blue-500 transition-colors"
        >
          <FaRegComment />
          <span>{answer.totalComments}</span>
        </Link>
        {answer.editedAt && (
          <span className="text-xs text-gray-400 ml-auto">
            edited{" "}
            {formatDistanceToNow(new Date(answer.editedAt), {
              addSuffix: true,
            })}
          </span>
        )}
      </div>
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
