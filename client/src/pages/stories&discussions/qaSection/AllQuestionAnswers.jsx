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
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

const AllQuestionAnswers = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('newest');
  const { id } = useParams();
  const { ref, inView } = useInView();

  // Set up infinite query for answers
  const {
    data,
    fetchNextPage,
    hasNextPage: queryHasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: ['answers', id, activeFilter],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await customFetch.get(`/qa-section/question/${id}/answers?page=${pageParam}&limit=10&sortBy=${activeFilter}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      return lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch next page when last element is in view
  useEffect(() => {
    if (inView && queryHasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, queryHasNextPage, isFetchingNextPage]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuestion = async () => {
    try {
      await customFetch.delete(`/qa-section/question/${id}`);
      toast.success("Question deleted successfully");
      setShowDeleteModal(false);
      navigate('/qa-section')
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete question");
    }
  };

  if (status === 'loading') {
    return <div className="text-center py-4">Loading answers...</div>;
  }

  if (status === 'error') {
    return <div className="text-center text-red-500 py-4">Error loading answers</div>;
  }

  const question = data?.pages[0]?.question || {};
  const allAnswers = data?.pages.flatMap(page => page.answers) || [];
  const pagination = data?.pages[data.pages.length - 1]?.pagination;

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-3 border border-gray-100">
      {/* question  */}
      <div className="flex items-center justify-between mb-3">
        <UserAvatar
          createdBy={question?.author?.userId}
          username={question?.author?.username}
          userAvatar={question?.author?.userAvatar}
          createdAt={question?.createdAt}
        />
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
            {pagination?.totalAnswers || 0}{" "}
            {pagination?.totalAnswers === 1 ? "Answer" : "Answers"}
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
      </div>

      {/* Answer Filter */}
      <AnswerFilter 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Answers List */}
      <div className="space-y-4">
        {allAnswers.map((answer) => (
          <Answer 
            key={answer._id} 
            answer={answer} 
            user={user} 
            answerCount={pagination?.totalAnswers || 0} 
          />
        ))}

        {/* Loading indicator */}
        <div ref={ref} className="py-4 text-center">
          {isFetchingNextPage && (
            <div className="text-gray-500">Loading more answers...</div>
          )}
          {!isFetchingNextPage && queryHasNextPage && (
            <div className="text-gray-400">Scroll for more answers</div>
          )}
          {!queryHasNextPage && allAnswers.length > 0 && (
            <div className="text-gray-400">No more answers to load</div>
          )}
          {!queryHasNextPage && allAnswers.length === 0 && (
            <div className="text-gray-400">No answers yet</div>
          )}
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
}

export default AllQuestionAnswers;