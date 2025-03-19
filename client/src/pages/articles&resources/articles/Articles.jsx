import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaSpinner,

} from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { ArticleCard, PageIntro, SearchAndFilterBar } from "@/components";
import { FiCalendar, FiClock } from "react-icons/fi";
import { MdMultipleStop } from "react-icons/md";
import { BiUpvote } from "react-icons/bi";

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "newest";
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);
  const { ref, inView } = useInView();

  // Filter options
  const filterOptions = [
    {
      value: "newest",
      label: "Newest",
      icon: <FiClock className="w-4 h-4" />,
    },
    {
      value: "oldest",
      label: "Oldest",
      icon: <FiCalendar className="w-4 h-4" />,
    },
    {
      value: "title",
      label: "A-Z",
      icon: <MdMultipleStop className="w-4 h-4" />,
    },
  ];

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

  const handleFilterChange = (value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("filter", value);
      return newParams;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Set up infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["articles", currentFilter, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam,
        limit: 9,
        sortBy: currentFilter,
        ...(searchQuery && { search: searchQuery }),
      });
      const response = await customFetch.get(`articles?${params}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 5 * 60 * 1000,
  });

  // Reset infinite query when filter changes
  useEffect(() => {
    refetch();
  }, [currentFilter, refetch]);

  // Fetch next page when last element is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "error") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <p className="text-lg font-medium mb-2">Error</p>
          <p>Failed to load articles. Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allArticles = data?.pages.flatMap((page) => page.articles) || [];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
      {/* Header Section */}
      <PageIntro
        title="Articles"
        description="Explore our collection of articles written by mental health professionals and experts. Find valuable insights, tips, and information about mental health and well-being."
      />

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
        {/* Search bar Filter buttons*/}

        <SearchAndFilterBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setSearchParams={setSearchParams}
          filterOptions={filterOptions}
          currentFilter={currentFilter}
          handleFilterChange={handleFilterChange}
        />
      </div>
      {/* Articles Grid */}
      {status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : allArticles?.length === 0 ? (
        <div className="text-center p-4 md:p-8 rounded-lg ">
          <div className="flex flex-col items-center justify-center  rounded-xl p-8 space-y-4 text-center">
            <div className="bg-blue-100 p-6 rounded-full">
              <FaBookOpen className="w-16 h-16 text-var(--primary) animate-pulse" />
            </div>
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-[var(--grey--900)] mb-3">
                No articles found
              </h2>
              <p className="text-[var(--grey--800)] mb-6">
                Try adjusting your search and filters or check back later for
                updated articles.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allArticles.map((article, index) => (
              <ArticleCard article={article} index={index} />
            ))}
          </div>

          {hasNextPage && (
            <div ref={ref} className="flex justify-center py-4">
              {isFetchingNextPage ? (
                <FaSpinner className="w-6 h-6 text-blue-500 animate-spin" />
              ) : (
                <div className="h-8" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Articles;
