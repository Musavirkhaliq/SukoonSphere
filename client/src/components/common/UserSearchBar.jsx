import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaUserPlus, FaUserCheck, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';

const UserSearchBar = ({ isMobile = false }) => {
  const { user: currentUser } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [following, setFollowing] = useState({});
  const searchRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search for users
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        const { data } = await customFetch.get(`/user/search?query=${searchTerm}`);
        console.log('Search response:', data);

        if (!data.success || !data.users) {
          console.error('Invalid response format:', data);
          toast.error('Failed to search users: Invalid response format');
          setIsLoading(false);
          return;
        }

        // Filter out the current user from results
        const filteredResults = data.users.filter(user =>
          user._id !== currentUser?._id
        );

        console.log('Filtered results:', filteredResults);
        setSearchResults(filteredResults);

        // Get following status for each user
        if (currentUser) {
          // Initialize all users as not followed for simplicity
          const followingStatus = {};
          filteredResults.forEach(user => {
            followingStatus[user._id] = false;
          });
          setFollowing(followingStatus);
        }

        setShowResults(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error searching users:', error);
        console.error('Error details:', error.response?.data || error.message);
        setIsLoading(false);
        toast.error(error.response?.data?.message || 'Failed to search users');
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, currentUser]);

  const handleFollow = async (userId) => {
    if (!currentUser) {
      toast.error('Please log in to follow users');
      return;
    }

    try {
      console.log(`Attempting to follow user ${userId}`);
      const response = await customFetch.post(`/user/follow/${userId}`);
      console.log('Follow response:', response.data);

      setFollowing(prev => ({
        ...prev,
        [userId]: true
      }));
      toast.success('User followed successfully');
    } catch (error) {
      console.error('Error following user:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(error.response?.data?.msg || error.response?.data?.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      console.log(`Attempting to unfollow user ${userId}`);
      const response = await customFetch.post(`/user/unfollow/${userId}`);
      console.log('Unfollow response:', response.data);

      setFollowing(prev => ({
        ...prev,
        [userId]: false
      }));
      toast.success('User unfollowed successfully');
    } catch (error) {
      console.error('Error unfollowing user:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(error.response?.data?.msg || error.response?.data?.message || 'Failed to unfollow user');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  const navigateToUserProfile = (userId) => {
    setShowResults(false);
    navigate(`/about/user/${userId}`);
  };

  return (
    <div ref={searchRef} className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-md'}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>

        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim().length >= 2 && setShowResults(true)}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className={`z-50 mt-1 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto ${isMobile ? 'fixed left-0 right-0 mx-4 top-20' : 'absolute w-full'}`}>
          {isMobile && (
            <div className="sticky top-0 bg-white p-2 border-b flex justify-end">
              <button
                onClick={() => setShowResults(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close search results"
              >
                <FaTimes />
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)]"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No users found matching "{searchTerm}"</p>
              {isMobile && (
                <button
                  onClick={handleClear}
                  className="mt-2 text-sm text-[var(--primary)] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div>
              {searchResults.map(user => (
                <div key={user._id} className="p-3 border-b last:border-b-0 hover:bg-gray-50">
                  <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex items-center justify-between mb-2'}`}>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => navigateToUserProfile(user._id)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[var(--primary)] text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">{user.name}</h4>
                        <p className="text-sm text-gray-500 truncate">@{user.username || user.name.toLowerCase().replace(/\s+/g, '_')}</p>
                      </div>
                    </div>

                    {!isMobile && (
                      <button
                        onClick={() => navigateToUserProfile(user._id)}
                        className="text-sm text-[var(--primary)] hover:underline flex items-center whitespace-nowrap"
                      >
                        <FaExternalLinkAlt className="mr-1" size={12} /> Profile
                      </button>
                    )}
                  </div>

                  <div className={`${isMobile ? 'flex justify-between items-center mt-2' : 'flex justify-end'}`}>
                    {isMobile && (
                      <button
                        onClick={() => navigateToUserProfile(user._id)}
                        className="text-sm text-[var(--primary)] hover:underline flex items-center"
                      >
                        <FaExternalLinkAlt className="mr-1" size={12} /> Profile
                      </button>
                    )}

                    {currentUser && (
                      <div>
                        {following[user._id] ? (
                          <button
                            onClick={() => handleUnfollow(user._id)}
                            className="flex items-center text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                          >
                            <FaUserCheck className="mr-1" /> Following
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFollow(user._id)}
                            className="flex items-center text-sm px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary-light-hover)]"
                          >
                            <FaUserPlus className="mr-1" /> Follow
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;
