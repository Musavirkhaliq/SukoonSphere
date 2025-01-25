import PostActions from "@/components/shared/PostActions";
import UserAvatar from "@/components/shared/UserAvatar";
import customFetch from "@/utils/customFetch";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import Answer from "./components/Answer";
import { useUser } from "@/context/UserContext";
import DeleteModal from "@/components/shared/DeleteModal";
import { useState } from "react";


const SingleAnswerOutlet = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { answer, question, error } = useLoaderData();

  // Handle error state
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // Handle loading/undefined state
  if (!answer || !question) {
    return <div className="p-4">Loading...</div>;
  }

  const [totalComments, setTotalComments] = useState(answer.totalComments || 0);
  answer.totalComments = totalComments;

  const handleDeleteQuestion = async () => {
    try {
      await customFetch.delete(`/qa-section/question/${question._id}`);
      setShowDeleteModal(false);
      navigate("/qa-section");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6 border border-gray-100">
      {/* question  */}
      <div className="flex items-center justify-between mb-5">
        <UserAvatar
          username={question?.author?.username}
          userAvatar={question?.author?.userAvatar}
          createdAt={question?.createdAt}
        />
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
            {question?.totalAnswers}{" "}
            {question?.totalAnswers === 1 ? "Answer" : "Answers"}
          </span>
          {user && question?.author?.userId === user?._id && (
            <PostActions handleDelete={() => setShowDeleteModal(true)} />
          )}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-gray-800 hover:text-blue-600 transition-colors duration-200">
          {question?.questionText}
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          {question?.context}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {question?.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <Answer answer={answer} key={answer._id} user={user} answerCount={1} />
      <Outlet context={{ answer, setTotalComments }} />
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

export default SingleAnswerOutlet;
