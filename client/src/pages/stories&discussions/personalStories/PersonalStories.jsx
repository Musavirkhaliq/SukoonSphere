import React, { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { BsSearch, BsX } from "react-icons/bs";

// Sample SearchAndFilterBar Component
const SearchAndFilterBar = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  filterOptions,
  currentFilter,
  onFilterChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-8 bg-white p-2 rounded-lg">
      {/* Search Form */}
      <form onSubmit={onSearchSubmit} className="flex-1">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            value={searchValue}
            onChange={onSearchChange}
            placeholder={placeholder}
            className="w-full bg-[var(--white-color)] p-2  outline-none focus:outline-none focus:ring-[var(--primary)] focus:border-transparent"
          />
          {searchValue && (
            <button
              type="button"
              onClick={onClearSearch}
              className="px-2 text-gray-500 hover:text-gray-700"
            >
              <BsX className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="p-3 rounded-md text-white bg-[var(--primary)]"
          >
            <BsSearch />
          </button>
        </div>
      </form>

      {/* Filter Buttons */}
      <div className="flex  gap-2 md:flex-nowrap ">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`flex items-center gap-2 p-1 md:px-4 md:py-2 rounded-lg ${currentFilter === option.value
              ? "bg-[var(--primary)] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } md:w-auto w-full`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const PersonalStories = () => {
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "newest";
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showModal, setShowModal] = useState(false);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient(); // For cache invalidation

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
    console.log("Changing filter to:", value);
    setSearchParams({
      ...(searchQuery && { search: searchQuery }),
      filter: value,
    });
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchInput);
    setSearchParams({
      ...(currentFilter !== "newest" && { filter: currentFilter }),
      ...(searchInput && { search: searchInput }),
    });
  };

  // Clear search
  const clearSearch = () => {
    console.log("Clearing search");
    setSearchInput("");
    setSearchParams({
      ...(currentFilter !== "newest" && { filter: currentFilter }),
    });
  };

  // Set up infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
  } = useInfiniteQuery({
    queryKey: ["personalStories", currentFilter, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam,
        limit: 9,
        sortBy: currentFilter,
        ...(searchQuery && { search: searchQuery }),
      });
      console.log("Fetching stories with URL:", `personal-stories?${params}`);
      const response = await customFetch.get(`personal-stories?${params}`);
      console.log("API Response:", response.data);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  // Invalidate queries when filter or search changes
  useEffect(() => {
    console.log("Invalidating queries for filter:", currentFilter, "search:", searchQuery);
    queryClient.invalidateQueries(["personalStories", currentFilter, searchQuery]);
  }, [currentFilter, searchQuery, queryClient]);

  // Fetch next page when last element is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("Fetching next page");
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

  // Filter out the featured story from the grid if it exists (only for newest, no search)
  const filteredStories =
    featuredStory && currentFilter === "newest" && !searchQuery
      ? allStories.filter((story) => story._id !== featuredStory._id)
      : allStories;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
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
      {isLoading && !allStories.length ? (
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
          onStoryCreated={() => {
            queryClient.invalidateQueries(["personalStories"]);
          }}
        />
      )}

      <Outlet />
    </div>
  );
};

export default PersonalStories;