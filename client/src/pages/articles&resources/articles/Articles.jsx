import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaSpinner,
  FaFire
} from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { ArticleCard, PageIntro, SearchAndFilterBar } from "@/components";
import FeaturedArticle from "@/components/articleComponents/FeaturedArticle";
import { FiCalendar, FiClock, FiTrendingUp } from "react-icons/fi";
import { MdMultipleStop } from "react-icons/md";
import { BiUpvote } from "react-icons/bi";
import { motion } from "framer-motion";

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
      value: "popular",
      label: "Popular",
      icon: <FiTrendingUp className="w-4 h-4" />,
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

  // Fetch featured article (most popular article)
  const { data: featuredData } = useQuery({
    queryKey: ["featuredArticle"],
    queryFn: async () => {
      const response = await customFetch.get("articles?limit=1&sortBy=popular");
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const featuredArticle = featuredData?.articles?.[0];
  const allArticles = data?.pages.flatMap((page) => page.articles) || [];

  // Filter out the featured article from the grid if it exists
  const filteredArticles = featuredArticle && currentFilter === "newest" && !searchQuery
    ? allArticles.filter(article => article._id !== featuredArticle._id)
    : allArticles;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageIntro
          title="Articles"
          description="Explore our collection of articles written by mental health professionals and experts. Find valuable insights, tips, and information about mental health and well-being."
        />
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        className="flex flex-col gap-4 mb-8 bg-white rounded-lg shadow-md p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SearchAndFilterBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setSearchParams={setSearchParams}
          filterOptions={filterOptions}
          currentFilter={currentFilter}
          handleFilterChange={handleFilterChange}
        />
      </motion.div>

      {/* Featured Article - Only show on default view (newest, no search) */}
      {featuredArticle && currentFilter === "newest" && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FeaturedArticle article={featuredArticle} />
        </motion.div>
      )}

      {/* Articles Grid */}
      {status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredArticles?.length === 0 ? (
        <motion.div
          className="text-center p-8 rounded-lg bg-white shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center rounded-xl p-8 space-y-4 text-center">
            <div className="bg-blue-100 p-6 rounded-full">
              <FaBookOpen className="w-16 h-16 text-blue-500 animate-pulse" />
            </div>
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No articles found
              </h2>
              <p className="text-gray-600 mb-6">
                Try adjusting your search and filters or check back later for
                updated articles.
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      newParams.delete("search");
                      return newParams;
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Section heading */}
          {currentFilter === "popular" && (
            <div className="flex items-center gap-2 mb-2">
              <FaFire className="text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">Popular Articles</h2>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <motion.div key={article._id} variants={itemVariants}>
                <ArticleCard article={article} index={index} />
              </motion.div>
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
        </motion.div>
      )}
    </div>
  );
};

export default Articles;
