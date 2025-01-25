import { useState } from "react";
import UserAvatar from "@/components/shared/UserAvatar";
import PostActions from "@/components/shared/PostActions";
import { FaUserMinus, FaUserPlus } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import DeleteModal from "@/components/shared/DeleteModal";
import customFetch from "@/utils/customFetch";
import Answer from "./Answer";
import { Link } from "react-router-dom";

const QuestionCard = ({ question }) => {
  const { user } = useUser();
  const {
    _id,
    questionText,
    context,
    tags,
    createdAt,
    totalAnswers,
    mostLikedAnswer,
    author,
  } = question;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteQuestion = async () => {
    try {
      await customFetch.delete(`/qa-section/question/${_id}`);
      setShowDeleteModal(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <UserAvatar
          createdBy={author?.userId}
          username={author?.username}
          userAvatar={author?.userAvatar}
          createdAt={createdAt}
        />
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
            {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
          </span>
          {/* {user && question?.author?.userId === user?._id && (
            <PostActions handleDelete={() => setShowDeleteModal(true)} />
          )} */}
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

      {mostLikedAnswer && (
        <div className=" mt-1">
          <Answer answer={mostLikedAnswer} user={user} mostLikedAnswer={true} />
        </div>
      )}
      <Link
        to={`/QA-section/question/${_id}`}
        className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
      >
        See more answers →
      </Link>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteQuestion}
        title="Delete Question"
        message="Are you sure you want to delete this question?"
        itemType="question"
      />
    </div>
  );
};

export default QuestionCard;
