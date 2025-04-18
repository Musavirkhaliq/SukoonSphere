import { useState } from "react";
import UserAvatar from "@/components/shared/UserAvatar";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useUser } from "@/context/UserContext";
import DeleteModal from "@/components/shared/DeleteModal";
import customFetch from "@/utils/customFetch";
import Answer from "./Answer";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const QuestionCard = ({ question, onAnswerSubmitted }) => {
  const { user } = useUser();
  const {
    _id,
    questionText,
    context,
    tags,
    createdAt,
    totalAnswers,
    mostLikedAnswer,
    answers,
    author,
    authorName,
  } = question;

  const previewAnswers = answers?.slice(0, 2) || [];
  const hasMoreAnswers = totalAnswers > previewAnswers.length;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAnswerPreviews, setShowAnswerPreviews] = useState(false);

  const handleDeleteQuestion = async () => {
    setIsDeleting(true);
    try {
      await customFetch.delete(`/qa-section/question/${_id}`);
      setShowDeleteModal(false);
      if (typeof onAnswerSubmitted === "function") {
        onAnswerSubmitted();
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to delete question");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAnswerButtonClick = () => {
    if (!user) {
      toast.error("Please login to answer questions");
      return;
    }
    setShowAnswerForm(!showAnswerForm);
    setAnswerText("");
    setIsAnonymous(false);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }
    setIsSubmitting(true);
    try {
      await customFetch.post(`/qa-section/question/${_id}/add-answer`, {
        context: answerText,
        isAnonymous,
      });
      toast.success("Answer submitted successfully");
      setShowAnswerForm(false);
      setAnswerText("");
      setIsAnonymous(false);
      if (typeof onAnswerSubmitted === "function") {
        onAnswerSubmitted();
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isQuestionOwner = user && (author?.userId === user?._id || question?.realCreator === user?._id);
  // console.log({questionnnnnn:question})
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <UserAvatar
          createdBy={author?.userId}
          username={author?.username || authorName}
          userAvatar={author?.userAvatar}
          createdAt={createdAt}
          userAvatarFrame={author?.avatarFrame || 'default'}
          userAvatarAccessories={author?.avatarAccessories || []}
          size="large"
        />
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
            {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
          </span>
          {isQuestionOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowActionModal(!showActionModal)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                <BsThreeDotsVertical className="text-gray-500" size={20} />
              </button>
              {showActionModal && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete Question
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg md:text-2xl mb-2 font-bold text-[var(--grey--900)] hover:text-[var(--ternery)] transition-colors duration-200">
          {questionText}
        </h3>
        <p className="text-base mb-2 leading-relaxed text-[var(--grey--800)]">{context}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={handleAnswerButtonClick}
          className={`inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
            showAnswerForm
              ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
              : "btn-2 shadow-sm hover:shadow-md"
          }`}
        >
          {showAnswerForm ? (
            <>
              <IoCloseOutline className="h-5 w-5" />
              Cancel
            </>
          ) : (
            <>
              <FiEdit className="h-5 w-5" />
              Answer
            </>
          )}
        </button>
        <Link
          to={`/QA-section/question/${_id}`}
          className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-300"
        >
          See more answers →
        </Link>
      </div>
      {showAnswerForm && (
        <form onSubmit={handleSubmitAnswer} className="mt-4">
          <input type="hidden" name="isAnonymous" value={isAnonymous.toString()} />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-[var(--primary)] rounded focus:ring-[var(--primary)]"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-600">
                Post anonymously
              </label>
            </div>
          </div>
          <div className="mb-4">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Write your answer here..."
              className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-gray-400 min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !answerText.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </button>
          </div>
        </form>
      )}
      {totalAnswers > 0 && (
        <div className="mt-4">
          {totalAnswers > 1 && (
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-500">
                {showAnswerPreviews ? "Answers:" : "Top Answer:"}
              </h4>
              <button
                onClick={() => setShowAnswerPreviews(!showAnswerPreviews)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                {showAnswerPreviews
                  ? "Show less"
                  : `Show ${Math.min(previewAnswers.length, 2)} answers`}
              </button>
            </div>
          )}
          {!showAnswerPreviews && mostLikedAnswer && (
            <Answer
              answer={mostLikedAnswer}
              user={user}
              mostLikedAnswer={true}
              preview={true}
            />
          )}
          {showAnswerPreviews && previewAnswers.length > 0 && (
            <div className="space-y-3">
              {previewAnswers.map((answer) => (
                <Answer
                  key={answer._id}
                  answer={answer}
                  user={user}
                  preview={true}
                />
              ))}
              {hasMoreAnswers && (
                <Link
                  to={`/QA-section/question/${_id}`}
                  className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors mt-2"
                >
                  See {totalAnswers - previewAnswers.length} more answers
                </Link>
              )}
            </div>
          )}
        </div>
      )}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteQuestion}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        itemType="question"
      />
    </div>
  );
};

export default QuestionCard;