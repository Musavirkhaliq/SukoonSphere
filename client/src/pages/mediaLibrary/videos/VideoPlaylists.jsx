import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFilm, FaPlay, FaChevronRight, FaPlus, FaCheck, FaClock, FaTag, FaCalendarAlt, FaUser, FaFilter } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import CreatePlaylistModel from "@/pages/contributors/models/CreatePlaylistModel";
import SearchBar from "@/components/common/SearchBar";

const VideoPlaylists = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [watchHistory, setWatchHistory] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        const { data } = await customFetch.get("/video-playlists/all");
        setPlaylists(data.playlists);
        setFilteredPlaylists(data.playlists);

        // If user is logged in, fetch watch history
        if (user) {
          try {
            const historyResponse = await customFetch.get("/videos/watch-history");
            const historyMap = {};


            historyResponse.data.watchHistory.forEach(item => {
              // Check if videoId is an object (populated) or a string
              const videoId = typeof item.videoId === 'object' ? item.videoId._id : item.videoId;
              historyMap[videoId] = item.watchPercentage;
            });

            setWatchHistory(historyMap);
          } catch (error) {
            console.error("Error fetching watch history:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [user]);

  const handlePlaylistCreated = (newPlaylist) => {
    const updatedPlaylists = [newPlaylist, ...playlists];
    setPlaylists(updatedPlaylists);
    applyFilters(searchTerm, categoryFilter, updatedPlaylists);
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilters(term, categoryFilter, playlists);
  };

  // Apply filters based on search term and category
  const applyFilters = (term, category, playlistsToFilter = playlists) => {
    let results = [...playlistsToFilter];

    // Apply search term filter
    if (term) {
      results = results.filter(playlist =>
        playlist.title.toLowerCase().includes(term.toLowerCase()) ||
        playlist.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Apply category filter
    if (category && category !== 'all') {
      results = results.filter(playlist => playlist.category === category);
    }

    setFilteredPlaylists(results);
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    applyFilters(searchTerm, category);
  };

  const hasPlaylists = filteredPlaylists.length > 0;

  return (
    <div className="p-4">
      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="w-full md:w-2/3">
            <SearchBar
              placeholder="Search playlists by title or description..."
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
            Found {filteredPlaylists.length} {filteredPlaylists.length === 1 ? 'playlist' : 'playlists'} for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Create Playlist Button (for contributors only) */}
      {user && user.role === "contributor" && (
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-2 flex items-center"
          >
            <FaPlus className="mr-2" />
            Create New Playlist
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="col-span-full flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : hasPlaylists ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaylists.map((playlist) => {
            // Calculate playlist stats
            const videoCount = playlist.videos?.length || 0;

            // Calculate completion stats
            let completedVideos = 0;
            let inProgressVideos = 0;
            let notStartedVideos = 0;


            if (playlist.videos && playlist.videos.length > 0) {
              playlist.videos.forEach(video => {
                const videoId = video._id;
                const progress = watchHistory[videoId];


                if (progress >= 90) {
                  completedVideos++;
                } else if (progress > 0) {
                  inProgressVideos++;
                } else {
                  notStartedVideos++;
                }
              });
            }

            const progressPercent = videoCount > 0 ? Math.round((completedVideos / videoCount) * 100) : 0;
            const isCompleted = videoCount > 0 && completedVideos === videoCount;

            return (
              <Link
                key={playlist._id}
                to={`/all-videos/playlist/${playlist._id}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
              >
                {/* Playlist Cover with Overlay */}
                <div className="relative overflow-hidden">
                  <div className="aspect-video w-full">
                    <img
                      src={playlist.coverImage}
                      alt={playlist.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-5">
                    {/* Status Badges */}
                    {user && (
                      <>
                        {isCompleted && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <FaCheck className="mr-1" /> COMPLETED
                          </div>
                        )}
                        {!isCompleted && inProgressVideos > 0 && (
                          <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <FaClock className="mr-1" /> IN PROGRESS
                          </div>
                        )}
                      </>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaPlay className="text-white text-2xl" />
                    </div>

                    {/* Playlist Info */}
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[var(--secondary)] transition-colors">{playlist.title}</h2>
                      <p className="text-white/80 line-clamp-2 mb-3">{playlist.description}</p>

                      {/* Playlist Stats */}
                      <div className="flex flex-wrap items-center text-white/70 text-sm space-x-4 mb-2">
                        <div className="flex items-center">
                          <FaFilm className="mr-2" />
                          <span>{videoCount} {videoCount === 1 ? 'lesson' : 'lessons'}</span>
                        </div>

                        {/* Tags */}
                        {playlist.tags && playlist.tags.length > 0 && (
                          <div className="flex items-center">
                            <FaTag className="mr-2" />
                            <span>{playlist.tags[0]}</span>
                          </div>
                        )}

                        {/* Creation Date */}
                        {playlist.createdAt && (
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Author Info */}
                      {playlist.author && (
                        <div className="flex items-center text-white/70 text-sm">
                          <FaUser className="mr-2" />
                          <span>Created by </span>
                          <img
                            src={playlist.author.avatar || 'https://via.placeholder.com/30'}
                            alt={playlist.author.name}
                            className="w-5 h-5 rounded-full mx-2 object-cover"
                          />
                          <span className="font-medium">{playlist.author.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress and Stats (if user is logged in) */}
                {user && videoCount > 0 && (
                  <div className="px-5 py-4 border-t border-gray-100">
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Course progress</span>
                        <span>{progressPercent}% complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : progressPercent > 0 ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}
                          style={{ width: `${progressPercent > 0 ? progressPercent : 3}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Video Status Counts */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-green-50 p-1.5 rounded">
                        <div className="font-bold text-green-600">{completedVideos}</div>
                        <div className="text-gray-500">Completed</div>
                      </div>
                      <div className="bg-yellow-50 p-1.5 rounded">
                        <div className="font-bold text-yellow-600">{inProgressVideos}</div>
                        <div className="text-gray-500">In Progress</div>
                      </div>
                      <div className="bg-gray-50 p-1.5 rounded">
                        <div className="font-bold text-gray-600">{notStartedVideos}</div>
                        <div className="text-gray-500">Not Started</div>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl p-8 space-y-4 text-center">
          <div className="bg-blue-100 p-6 rounded-full">
            <FaFilm className="w-16 h-16 text-[var(--primary)] animate-pulse" />
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-[var(--grey--900)] mb-3">
              No Playlists Found
            </h2>
            <p className="text-[var(--grey--800)] mb-6">
              {searchTerm ?
                `No playlists match your search for "${searchTerm}". Try different keywords or clear the search.` :
                "No playlists found. This collection is currently empty."}
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

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <CreatePlaylistModel
          setShowModal={setShowCreateModal}
          onSuccess={handlePlaylistCreated}
        />
      )}
    </div>
  );
};

export default VideoPlaylists;
