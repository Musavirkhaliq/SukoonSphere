import DeleteModal from "@/components/shared/DeleteModal";
import PostActions from "@/components/shared/PostActions";
import UserAvatar from "@/components/shared/UserAvatar";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Answer from "./components/Answer";
import AnswerFilter from "@/components/qa/AnswerFilter";
import { toast } from "react-toastify";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";

const AllQuestionAnswers = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const { ref, inView } = useInView();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("newest");
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const INITIAL_ANSWERS_TO_SHOW = 2;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } = useInfiniteQuery({
    queryKey: ["answers", id, activeFilter],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await customFetch.get(
        `/qa-section/question/${id}/answers?page=${pageParam}&limit=10&sortBy=${activeFilter}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteQuestion = async () => {
    try {
      await customFetch.delete(`/qa-section/question/${id}`);
      toast.success("Question deleted successfully");
      setShowDeleteModal(false);
      navigate("/qa-section");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to delete question");
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
      await customFetch.post(`/qa-section/question/${id}/add-answer`, {
        context: answerText,
        isAnonymous,
      });
      toast.success("Answer submitted successfully");
      setShowAnswerForm(false);
      setAnswerText("");
      setIsAnonymous(false);
      refetch();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="text-center py-4">Loading answers...</div>;
  }

  if (status === "error") {
    return <div className="text-center text-red-500 py-4">Error loading answers</div>;
  }

  const question = data?.pages[0]?.question || {};
  const allAnswers = data?.pages.flatMap((page) => page.answers) || [];
  const pagination = data?.pages[data.pages.length - 1]?.pagination;

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-3 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <UserAvatar
          createdBy={question?.author?.userId}
          username={question?.author?.username}
          userAvatar={question?.author?.userAvatar}
          userAvatarFrame={question?.author?.avatarFrame}
          userAvatarAccessories={question?.author?.avatarAccessories}
          createdAt={question?.createdAt}
        />
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
            {pagination?.totalAnswers || 0} {pagination?.totalAnswers === 1 ? "Answer" : "Answers"}
          </span>
          {user && question?.author?.userId === user?._id && (
            <PostActions handleDelete={() => setShowDeleteModal(true)} />
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg md:text-2xl mb-2 font-bold text-[var(--grey--900)] hover:text-[var(--ternery)] transition-colors duration-200">
          {question?.questionText}
        </h3>
        <p className="text-base mb-2 leading-relaxed text-[var(--grey--800)]">{question?.context}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {question?.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 mb-2">
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
                Answer this question
              </>
            )}
          </button>
        </div>
        {showAnswerForm && (
          <form onSubmit={handleSubmitAnswer} className="mt-4 mb-4">
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
      </div>
      {allAnswers.length > 0 && (
        <AnswerFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      )}
      <div className="space-y-4">
        {(showAllAnswers ? allAnswers : allAnswers.slice(0, INITIAL_ANSWERS_TO_SHOW)).map((answer) => (
          <Answer key={answer._id} answer={answer} user={user} answerCount={pagination?.totalAnswers || 0} />
        ))}
        {allAnswers.length > INITIAL_ANSWERS_TO_SHOW && (
          <div className="text-center py-3">
            <button
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all duration-300"
            >
              {showAllAnswers
                ? `Show less answers (${INITIAL_ANSWERS_TO_SHOW} of ${allAnswers.length})`
                : `Show all answers (${allAnswers.length - INITIAL_ANSWERS_TO_SHOW} more)`}
            </button>
          </div>
        )}
        <div ref={ref} className="py-4 text-center">
          {isFetchingNextPage && <div className="text-gray-500">Loading more answers...</div>}
          {!isFetchingNextPage && hasNextPage && <div className="text-gray-400">Scroll for more answers</div>}
          {!hasNextPage && allAnswers.length > 0 && <div className="text-gray-400">No more answers to load</div>}
          {!hasNextPage && allAnswers.length === 0 && <div className="text-gray-400">No answers yet</div>}
        </div>
      </div>
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

export default AllQuestionAnswers;