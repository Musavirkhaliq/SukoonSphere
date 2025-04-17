import React, { useState, useEffect } from "react";
import customFetch from "@/utils/customFetch";
import { Form, useActionData, Link, useSearchParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import UserAvatar from "@/components/shared/UserAvatar";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import MobileGroupIcons from "@/components/shared/MobileGroupIcons";
import "@/components/shared/MobileGroupIcons.css";

export const answerAction = async ({ request }) => {
  const formData = await request.formData();
  const context = formData.get("context");
  const questionId = formData.get("questionId");
  const isAnonymous = formData.get("isAnonymous") === "true";

  if (!context?.trim()) {
    return { error: "Answer cannot be empty" };
  }

  try {
    const { data } = await customFetch.post(
      `/qa-section/question/${questionId}/add-answer`,
      { context, isAnonymous }
    );
    return { success: data.msg };
  } catch (error) {
    console.log(error);
    return { error: error?.response?.data?.msg || "Could not submit answer." };
  }
};

const Answer = () => {
  const { user } = useUser();
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const actionData = useActionData();
  const { ref, inView } = useInView();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "newest";
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (searchInput) {
            newParams.set("search", searchInput);
          } else {
            newParams.delete("search");
          }
          return newParams;
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, setSearchParams]);

  // Filter options
  const filterOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "mostAnswered", label: "Most Answered" },
    { value: "unanswered", label: "Unanswered" },
  ];

  const handleFilterChange = (value) => {
    setSearchParams({ filter: value });
  };

  // Fetch questions with pagination and filtering
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error: loadError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["questions", currentFilter, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam,
        limit: 10,
        sortBy: currentFilter,
        ...(searchQuery && { search: searchQuery }),
      });
      const response = await customFetch.get(
        `/qa-section/all-questions?${params}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 5 * 60 * 1000,
  });

  // Reset infinite query when filter changes
  useEffect(() => {
    refetch();
  }, [currentFilter, refetch]);

  // Load next page when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allQuestions = data?.pages.flatMap((page) => page.questions) || [];

  useEffect(() => {
    if (actionData?.success) {
      setSelectedQuestionId(null);
      setNewAnswer("");
      refetch();
    }
  }, [actionData, refetch]);

  const handleAnswerButtonClick = (questionId) => {
    if (!user) {
      toast.error("Please login to answer questions");
      return;
    }
    setSelectedQuestionId((prev) => (prev === questionId ? null : questionId));
    setNewAnswer("");
    setIsAnonymous(false);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit an answer");
      return;
    }

    if (!newAnswer.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    if (!selectedQuestionId) {
      console.error("Question ID is missing");
      toast.error("Failed to submit answer. Please try again.");
      return;
    }

    try {
      const response = await customFetch.post(
        `/qa-section/question/${selectedQuestionId}/add-answer`,
        {
          context: newAnswer,
          isAnonymous: isAnonymous ? true : false // Ensure boolean value is sent
        }
      );

      toast.success("Answer submitted successfully");
      setNewAnswer("");
      setSelectedQuestionId(null);
      refetch();
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error(error.response?.data?.msg || "Failed to submit answer");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center p-4 lg:p-8">
        <p className="text-red-500 text-lg md:text-xl">{loadError.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  console.log("All questions:", allQuestions); // Debug log

  const groups = [
    {
      id: 1,
      name: "Mindfulness Practices ",
      image: "https://example.com/image_mindfulness.jpg",
    },
    {
      id: 2,
      name: "Coping with Anxiety ",
      image: "https://example.com/image_anxiety.jpg",
    },
    {
      id: 3,
      name: "Therapy Techniques ",
      image: "https://example.com/image_therapy.jpg",
    },
    {
      id: 4,
      name: "Depression Support Group ",
      image: "https://example.com/image_depression.jpg",
    },
    {
      id: 5,
      name: "Stress Management Workshops ",
      image: "https://example.com/image_stress.jpg",
    },
  ];

  return (
    <>
      <div className="relative max-w-7xl mx-auto p-2 md:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Mobile Groups - Visible on small screens */}
          <div className="lg:hidden col-span-full mb-4">
            <MobileGroupIcons />
          </div>

          {/* Profile Sidebar - Hidden on mobile, visible on md+ screens */}
          <div className="hidden lg:block md:col-span-3 sticky top-[10%] h-screen overflow-y-auto">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
              <div className="space-y-4">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {group.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {group.name}
                      </p>
                      <p className="text-xs text-gray-500">Starting soon</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-6">
            <div className="flex flex-col gap-4 mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Questions
              </h2>
              {/* Search bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full bg-[var(--white-color)] py-2 px-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.delete("search");
                        return newParams;
                      });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <IoCloseOutline className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filter buttons */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 md:mt-0">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange(option.value)}
                      className={`flex items-center  gap-2 px-3 py-2 rounded-full transition-all duration-200 ease-in-out whitespace-nowrap ${
                        currentFilter === option.value
                          ? "bg-[var(--primary)] text-white"
                          : "text-[var(--grey--800)] hover:bg-gray-100 hover:shadow-sm"
                      }`}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {allQuestions?.length === 0 ? (
              <div className="text-center p-4 md:p-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">
                  No questions available at the moment.
                </p>
              </div>
            ) : (
              <>
                {allQuestions?.map((question) => (
                  <div
                    key={question._id}
                    className="flex flex-col gap-3 p-4 md:p-6 bg-white rounded-xl shadow-sm mb-4 border border-gray-100"
                  >
                    <UserAvatar
                      createdBy={question?.author.userId}
                      username={question?.author.username || question?.authorName}
                      userAvatar={question?.author.userAvatar}
                      createdAt={question?.createdAt}
                    />

                    <h3 className="text-base md:text-xl mb-2 font-bold text-[var(--grey--900)] hover:text-[var(--ternery)] transition-colors duration-200s">
                      {question?.questionText}
                    </h3>
                    <p className="text-base mb-2 leading-relaxed text-[var(--grey--800)]">
                      {question.context}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {question?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs md:text-sm text-gray-500 mb-3 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Total Answers: {question.totalAnswers || 0}
                    </p>
                    <div className="flex flex-wrap md:flex-nowrap gap-2">
                      <button
                        onClick={() => handleAnswerButtonClick(question._id)}
                        className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 py-2 md:py-2.5 px-3 md:px-4 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                          selectedQuestionId === question._id
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            : "btn-2 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {selectedQuestionId === question._id ? (
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
                      {question.totalAnswers > 0 && (
                        <Link
                          to={`/QA-section/question/${question._id}`}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 py-2 md:py-2.5 px-3 md:px-4 rounded-xl font-medium text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-300"
                        >
                          See more answers
                        </Link>
                      )}
                    </div>

                    {selectedQuestionId === question._id && (
                      <Form onSubmit={handleSubmitAnswer} className="mt-4">
                        <input
                          type="hidden"
                          name="questionId"
                          value={question._id}
                        />
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="anonymous"
                              checked={isAnonymous}
                              onChange={(e) => setIsAnonymous(e.target.checked)}
                              className="w-4 h-4 text-[var(--primary)] rounded"
                            />
                            <label htmlFor="anonymous" className="text-sm text-gray-600">
                              Post anonymously
                            </label>
                          </div>
                        </div>
                        <div className="mb-4">
                          <textarea
                            name="context"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            placeholder="Write your answer here..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary min-h-[100px] resize-none"
                          />
                          {actionData?.error && (
                            <p className="text-red-500 text-sm mt-1">
                              {actionData.error}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="btn-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Submit Answer
                          </button>
                        </div>
                      </Form>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                <div ref={ref} className="py-4 text-center">
                  {isFetchingNextPage && (
                    <div className="text-gray-500">
                      Loading more questions...
                    </div>
                  )}
                  {!isFetchingNextPage && hasNextPage && (
                    <div className="text-gray-400">
                      Scroll for more questions
                    </div>
                  )}
                  {!hasNextPage && allQuestions.length === 0 && (
                    <div className="text-gray-400">No questions available</div>
                  )}
                </div>

                {/* Load more button */}
                {hasNextPage && !isFetchingNextPage && (
                  <div className="text-center py-4">
                    <button
                      onClick={() => fetchNextPage()}
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Load More Questions
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block md:col-span-3 sticky top-[10%] h-screen overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Stay tuned for more features...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Answer;
