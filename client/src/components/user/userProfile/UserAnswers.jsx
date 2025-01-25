import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Answer from "@/pages/stories&discussions/qaSection/components/Answer";

const UserAnswers = () => {
  const user = useOutletContext();
  const { user: loggedUser } = useUser();
  const { ref, inView } = useInView();

  // Set up infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["userAnswers", user?._id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await customFetch.get(
        `/qa-section/user-answers/${user?._id}?page=${pageParam}&limit=10`
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
    cacheTime: 5 * 60 * 1000,
  });

  // Fetch next page when last element is in view
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const updateAnswersList = (deletedAnswerId) => {
    // No need to manually update the list since we'll refetch
    refetch();
  };

  if (status === "error") {
    return (
      <div className="text-center text-red-500 py-4">Error loading answers</div>
    );
  }

  const allAnswers = data?.pages.flatMap((page) => page.answers) || [];

  return (
    <div className="lg:p-6 bg-white rounded-xl shadow-sm">
      {/* Answers Count */}
      <div className="flex items-center justify-between mb-4 lg:mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Answers{" "}
          <span className="text-blue-500 ml-2">{allAnswers.length}</span>
        </h2>
      </div>

      {/* Answers List */}
      {status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : allAnswers.length === 0 ? (
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No answers yet
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Share your knowledge by answering questions!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allAnswers.map((answer, index) => (
            <Answer
              key={`${answer._id}-${index}`}
              answer={{
                ...answer,
                author: {
                  userId: answer.createdBy,
                  username: answer.username,
                  userAvatar: answer.userAvatar,
                },
              }}
              user={loggedUser}
              answerCount={allAnswers.length}
              onDelete={updateAnswersList}
            />
          ))}

          {/* Loading indicator */}
          <div ref={ref} className="py-4 text-center">
            {isFetchingNextPage && (
              <div className="text-gray-500">Loading more answers...</div>
            )}
            {!isFetchingNextPage && hasNextPage && (
              <div className="text-gray-400">Scroll for more answers</div>
            )}
            {!hasNextPage && allAnswers.length > 0 && (
              <div className="text-gray-400">No more answers to load</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAnswers;
