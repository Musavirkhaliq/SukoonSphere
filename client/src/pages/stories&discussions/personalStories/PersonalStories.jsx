import React, { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { FaPlus, FaSpinner, FaBookOpen, FaHeart } from "react-icons/fa";
import { FiClock, FiTrendingUp, FiCalendar } from "react-icons/fi";
import { MdMultipleStop } from "react-icons/md";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { Outlet } from "react-router-dom";
import PersonalStoryCard from "@/components/personalStories/PersonalStoryCard";
import CreateStoryModal from "@/components/personalStories/CreateStoryModal";
import { SearchAndFilterBar } from "@/components";

const PersonalStories = () => {
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "newest";
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showModal, setShowModal] = useState(false);
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

  // Handle filter change
  const handleFilterChange = (value) => {
    setSearchParams({
      ...(searchQuery && { search: searchQuery }),
      filter: value
    });
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({
      ...(currentFilter !== "newest" && { filter: currentFilter }),
      ...(searchInput && { search: searchInput })
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput("");
    setSearchParams({
      ...(currentFilter !== "newest" && { filter: currentFilter })
    });
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
    queryKey: ["personalStories", currentFilter, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam,
        limit: 9,
        sortBy: currentFilter,
        ...(searchQuery && { search: searchQuery }),
      });
      const response = await customFetch.get(`personal-stories?${params}`);
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

  // Fetch featured stories (most liked)
  const { data: featuredData } = useQuery({
    queryKey: ["featuredPersonalStories"],
    queryFn: async () => {
      const response = await customFetch.get("personal-stories/most-liked?limit=1");
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const featuredStory = featuredData?.stories?.[0];
  const allStories = data?.pages.flatMap((page) => page.stories) || [];

  // Filter out the featured story from the grid if it exists
  const filteredStories = featuredStory && currentFilter === "newest" && !searchQuery
    ? allStories.filter(story => story._id !== featuredStory._id)
    : allStories;

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaBookOpen className="text-[var(--primary)]" />
            Personal Stories
          </h1>
          <p className="text-gray-600 mt-2">
            Share your personal experiences and read stories from others
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) {
              toast.error("Please login to share your story!");
              return;
            }
            setShowModal(true);
          }}
          className="btn-2 flex gap-2 whitespace-nowrap"
        >
          <FaPlus />
          Share Your Story
        </button>
      </div>

      {/* Search and filter bar */}
      <SearchAndFilterBar
        searchValue={searchInput}
        onSearchChange={(e) => setSearchInput(e.target.value)}
        onSearchSubmit={handleSearch}
        onClearSearch={clearSearch}
        filterOptions={filterOptions}
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        placeholder="Search personal stories..."
      />

      {/* Featured story */}
      {featuredStory && currentFilter === "newest" && !searchQuery && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaHeart className="text-red-500" />
            Featured Story
          </h2>
          <PersonalStoryCard story={featuredStory} />
        </div>
      )}

      {/* Story grid */}
      {status === "loading" && !allStories.length ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : allStories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No stories found</h3>
          <p className="text-gray-500">
            {searchQuery
              ? `No results found for "${searchQuery}". Try a different search term.`
              : "Be the first to share your personal story!"}
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : currentFilter === "popular"
              ? "Popular Stories"
              : currentFilter === "oldest"
              ? "Oldest Stories"
              : currentFilter === "title"
              ? "Stories A-Z"
              : "Recent Stories"}
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story, index) => (
              <motion.div key={story._id} variants={itemVariants}>
                <PersonalStoryCard story={story} index={index} />
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

      {/* Create story modal */}
      {showModal && (
        <CreateStoryModal
          onClose={() => setShowModal(false)}
          onStoryCreated={() => refetch()}
        />
      )}

      <Outlet />
    </div>
  );
};

export default PersonalStories;
