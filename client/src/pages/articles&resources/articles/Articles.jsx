import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import {
  FaBookOpen,
  FaSpinner,
  FaFire
} from "react-icons/fa";
import { ArticleCard, PageIntro, SearchAndFilterBar } from "@/components";
import FeaturedArticle from "@/components/articleComponents/FeaturedArticle";
import { FiCalendar, FiClock, FiTrendingUp } from "react-icons/fi";
import { MdMultipleStop } from "react-icons/md";
import { motion } from "framer-motion";

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "newest";
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [hasLoadedArticles, setHasLoadedArticles] = useState(false);
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
    // Update the URL params with the new filter
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("filter", value);
      return newParams;
    });

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Force a refetch to ensure we get the correct data for this filter
    setTimeout(() => {
      // Reset the hasLoadedArticles state to ensure we show the loading indicator
      setHasLoadedArticles(false);
      refetch();
    }, 100); // Small timeout to ensure the URL params are updated first
  };

  // Set up infinite query with enabled option to control when it runs
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
      // Map frontend filter values to backend sortBy values
      // The backend controller expects specific values for sorting
      let sortByValue;
      switch(currentFilter) {
        case 'popular':
          // For popular, we need to sort by likes count
          sortByValue = 'popular';
          break;
        case 'oldest':
          sortByValue = 'oldest';
          break;
        case 'title':
          sortByValue = 'title';
          break;
        default: // 'newest'
          sortByValue = 'newest';
      }

      // Make sure we're using the correct parameter for the backend
      const params = new URLSearchParams({
        page: pageParam,
        limit: 9,
        sortBy: sortByValue,
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
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
    enabled: true, // Always enabled to ensure it runs on mount
  });

  // Reset infinite query when filter changes
  useEffect(() => {
    refetch();
  }, [currentFilter, refetch]);

  // Ensure articles are loaded when component mounts
  useEffect(() => {
    // Force a refetch when the component mounts to ensure we have the latest data
    refetch().then(() => {
      // Mark articles as loaded after successful refetch
      setHasLoadedArticles(true);
    });

    // As a fallback, directly fetch articles if React Query doesn't work
    const fetchArticlesDirectly = async () => {
      try {
        const sortByValue = currentFilter === 'popular' ? 'popular' :
                           currentFilter === 'oldest' ? 'oldest' :
                           currentFilter === 'title' ? 'title' : 'newest';

        const params = new URLSearchParams({
          page: 1,
          limit: 9,
          sortBy: sortByValue,
          ...(searchQuery && { search: searchQuery }),
        });

        // Just fetch the data, we don't need to use the response
        await customFetch.get(`articles?${params}`);

        // Mark articles as loaded after direct fetch
        setHasLoadedArticles(true);
      } catch (error) {
        // If direct fetch fails, still mark as loaded to avoid infinite loading state
        setHasLoadedArticles(true);
      }
    };

    // Call the direct fetch after a short delay if articles haven't loaded yet
    const timer = setTimeout(() => {
      if (!hasLoadedArticles) {
        fetchArticlesDirectly();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [refetch, currentFilter, searchQuery, hasLoadedArticles]);

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
  const { data: featuredData, refetch: refetchFeatured } = useQuery({
    queryKey: ["featuredArticle"],
    queryFn: async () => {
      const response = await customFetch.get("articles?limit=1&sortBy=popular");
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always refetch on mount
    staleTime: 0, // Data is immediately considered stale
  });

  // Ensure featured article is loaded when component mounts
  useEffect(() => {
    refetchFeatured();
  }, [refetchFeatured]);

  // Get the featured article from the query data
  const featuredArticle = featuredData?.articles?.[0];

  // Get articles from the query data
  let allArticles = data?.pages?.flatMap((page) => page.articles) || [];

  // Determine if we should show the featured article
  const showFeaturedArticle = featuredArticle && currentFilter === "newest" && !searchQuery;

  // For the default view (newest), filter out the featured article to avoid duplication
  // For all other filters, show all articles
  const filteredArticles = showFeaturedArticle && allArticles.length > 0
    ? allArticles.filter(article => article._id !== featuredArticle._id)
    : allArticles;

  // If we have articles, mark as loaded
  useEffect(() => {
    if (allArticles.length > 0 && !hasLoadedArticles) {
      setHasLoadedArticles(true);
    }
  }, [allArticles.length, hasLoadedArticles]);

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
      {showFeaturedArticle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FeaturedArticle article={featuredArticle} />
        </motion.div>
      )}

      {/* Articles Grid */}
      {(status === "loading" && !hasLoadedArticles) || (filteredArticles.length === 0 && !hasLoadedArticles) ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredArticles?.length === 0 && hasLoadedArticles ? (
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
          {/* Refresh button for users */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setHasLoadedArticles(false);
                refetch().then(() => setHasLoadedArticles(true));
              }}
              className="text-[var(--ternery)]  flex items-center gap-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Articles
            </button>
          </div>
          {/* Section heading */}
          {currentFilter === "popular" && (
            <div className="flex items-center gap-2 mb-2">
              <FaFire className="text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">Popular Articles</h2>
            </div>
          )}
          {currentFilter === "oldest" && (
            <div className="flex items-center gap-2 mb-2">
              <FiCalendar className="text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Oldest Articles</h2>
            </div>
          )}
          {currentFilter === "title" && (
            <div className="flex items-center gap-2 mb-2">
              <MdMultipleStop className="text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">Articles A-Z</h2>
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
