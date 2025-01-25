import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import DeleteModal from "@/components/shared/DeleteModal";
import { Link, useOutletContext } from "react-router-dom";
import UserAvatar from "@/components/shared/UserAvatar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const UserQuestions = () => {
  const user = useOutletContext();
  const { user: loggedUser } = useUser();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showActionModal, setShowActionModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = React.useState(null);
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["userQuestions", user?._id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await customFetch.get(
        `/qa-section/user-questions/${user?._id}?page=${pageParam}&limit=4`
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    enabled: !!user?._id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await customFetch.delete(`/qa-section/question/${selectedQuestionId}`);
      refetch();
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
    setIsDeleting(false);
  };

  const allQuestions = data?.pages.flatMap((page) => page.questions) || [];
  const filteredQuestions = allQuestions.filter(
    (question) =>
      (question.questionText?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (question.context?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  return (
    <div className="lg:p-6 bg-white rounded-xl shadow-sm">
      {/* Search Bar */}
      {/* <div className="mb-4 lg:mb-8">
                <div className="relative max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search in questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-3 pl-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300"
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                </div>
            </div> */}

      {/* Questions Count */}
      <div className="flex items-center justify-between mb-4 lg:mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Questions{" "}
          <span className="text-blue-500 ml-2">{filteredQuestions.length}</span>
        </h2>
      </div>

      {/* Questions List */}
      {status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : status === "error" ? (
        <div className="text-center text-red-500 py-4">
          Error loading questions
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {searchQuery
              ? "No matching questions found"
              : "No questions asked yet"}
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery
              ? "Try searching with different keywords"
              : "Start asking questions to get help from the community!"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((question) => (
            <div
              key={question._id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col space-y-4">
                {/* User Info and Date */}
                <div className="flex items-center justify-between">
                  <UserAvatar
                    createdBy={question.createdBy}
                    username={question.username}
                    userAvatar={question.userAvatar}
                    createdAt={question.createdAt}
                  />
                  {loggedUser?._id === question.createdBy && (
                    <div className="relative">
                      <button
                        onClick={() => {
                          setSelectedQuestionId(question._id);
                          setShowActionModal(!showActionModal);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <BsThreeDotsVertical className="text-gray-500" />
                      </button>
                      {showActionModal &&
                        selectedQuestionId === question._id && (
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

                {/* Question Content */}
                <div>
                  <Link
                    to={`/QA-section/question/${question._id}`}
                    className="block"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                      {question.questionText}
                    </h3>
                    <p className="text-gray-600">{question.context}</p>
                  </Link>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {question.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{question.totalAnswers || 0} answers</span>
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          <div ref={ref} className="py-4 text-center">
            {isFetchingNextPage && (
              <div className="text-gray-500">Loading more questions...</div>
            )}
            {!isFetchingNextPage && hasNextPage && (
              <div className="text-gray-400">Scroll for more questions</div>
            )}
            {!hasNextPage && allQuestions.length > 0 && (
              <div className="text-gray-400">No more questions to load</div>
            )}
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        itemType="question"
      />
    </div>
  );
};

export default UserQuestions;
