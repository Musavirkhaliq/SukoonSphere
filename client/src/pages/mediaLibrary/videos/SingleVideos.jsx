import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import VideoCard from "../../../components/mediaLibrary/videos/VideoCard";
import { FaFilm, FaFilter } from "react-icons/fa";
import SearchBar from "../../../components/common/SearchBar";

const SingleVideos = () => {
  const { videos: initialVideos } = useLoaderData();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Set initial videos when loaded
  useEffect(() => {
    if (initialVideos) {
      setVideos(initialVideos);
      setFilteredVideos(initialVideos);
      setIsLoading(false);
    }
  }, [initialVideos]);

  // Handle search
  const handleSearch = async (term) => {
    setSearchTerm(term);
    applyFilters(term, categoryFilter);
  };

  // Apply filters based on search term and category
  const applyFilters = (term, category) => {
    let results = [...videos];

    // Apply search term filter
    if (term) {
      results = results.filter(video =>
        video.title.toLowerCase().includes(term.toLowerCase()) ||
        video.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Apply category filter
    if (category && category !== 'all') {
      results = results.filter(video => video.category === category);
    }

    setFilteredVideos(results);
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    applyFilters(searchTerm, category);
  };

  const hasFilteredVideos = filteredVideos && filteredVideos.length > 0;

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="w-full md:w-2/3">
            <SearchBar
              placeholder="Search videos by title or description..."
              onSearch={handleSearch}
              initialValue={searchTerm}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/3 flex justify-end">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Filter by Category:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-1 rounded-full text-sm ${categoryFilter === 'all' ? 'bg-[var(--primary)] text-white' : 'bg-white border'}`}
              >
                All Categories
              </button>
              <button
                onClick={() => handleCategoryChange('meditation')}
                className={`px-3 py-1 rounded-full text-sm ${categoryFilter === 'meditation' ? 'bg-[var(--primary)] text-white' : 'bg-white border'}`}
              >
                Meditation
              </button>
              <button
                onClick={() => handleCategoryChange('yoga')}
                className={`px-3 py-1 rounded-full text-sm ${categoryFilter === 'yoga' ? 'bg-[var(--primary)] text-white' : 'bg-white border'}`}
              >
                Yoga
              </button>
              <button
                onClick={() => handleCategoryChange('mindfulness')}
                className={`px-3 py-1 rounded-full text-sm ${categoryFilter === 'mindfulness' ? 'bg-[var(--primary)] text-white' : 'bg-white border'}`}
              >
                Mindfulness
              </button>
            </div>
          </div>
        )}

        {/* Search Results Count */}
        {searchTerm && (
          <p className="text-sm text-gray-600 mb-2">
            Found {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} for "{searchTerm}"
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="col-span-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : hasFilteredVideos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl p-8 space-y-4 text-center">
          <div className="bg-blue-100 p-6 rounded-full">
            <FaFilm className="w-16 h-16 text-[var(--primary)] animate-pulse" />
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-[var(--grey--900)] mb-3">
              No Videos Found
            </h2>
            <p className="text-[var(--grey--800)] mb-6">
              {searchTerm ?
                `No videos match your search for "${searchTerm}". Try different keywords or clear the search.` :
                "No videos found. This collection is currently empty."}
            </p>
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)]"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleVideos;
