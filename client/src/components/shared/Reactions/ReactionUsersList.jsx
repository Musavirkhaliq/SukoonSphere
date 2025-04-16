import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import customFetch from '@/utils/customFetch';
import { Link } from 'react-router-dom';
import {
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaHandsHelping,
  FaCheck,
  FaSadTear,
  FaAngry,
  FaLightbulb
} from 'react-icons/fa';
import { MdOutlinePeopleAlt } from 'react-icons/md';

// Reaction icons mapping
const reactionIcons = {
  like: <FaThumbsUp className="text-blue-500" />,
  heart: <FaHeart className="text-red-500" />,
  haha: <FaLaugh className="text-yellow-500" />,
  wow: <FaSurprise className="text-yellow-500" />,
  support: <FaHandsHelping className="text-purple-500" />,
  relate: <MdOutlinePeopleAlt className="text-green-500" />,
  agree: <FaCheck className="text-green-500" />,
  sad: <FaSadTear className="text-blue-700" />,
  angry: <FaAngry className="text-red-700" />,
  insightful: <FaLightbulb className="text-yellow-400" />
};

// Reaction labels
const reactionLabels = {
  like: 'Like',
  heart: 'Heart',
  haha: 'Haha',
  wow: 'Wow',
  support: 'Support',
  relate: 'I relate to it',
  agree: 'Agree',
  sad: 'Sad',
  angry: 'Angry',
  insightful: 'Insightful'
};

const ReactionUsersList = ({ contentId, contentType, reactionType, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(reactionType || 'all');

  // Fetch users who reacted
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construct the API endpoint
        // Note: Don't include /api/v1/ prefix as customFetch already has baseURL set to /api/v1
        let endpoint = `/reactions/${contentType}/${contentId}/users`;
        if (selectedType && selectedType !== 'all') {
          endpoint += `?type=${selectedType}`;
        }

        const { data } = await customFetch.get(endpoint);
        setUsers(data.users || []);
      } catch (err) {
        console.error('Error fetching reaction users:', err);
        setError('Failed to load users who reacted');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [contentId, contentType, selectedType]);

  // Handle reaction type filter change
  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">People who reacted</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>

      {/* Reaction type filters */}
      <div className="flex flex-wrap gap-1 mb-3">
        <button
          onClick={() => handleTypeChange('all')}
          className={`px-2 py-1 text-xs rounded-full ${
            selectedType === 'all'
              ? 'bg-gray-200 font-medium'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          All
        </button>

        {Object.entries(reactionIcons).map(([type, icon]) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`flex items-center px-2 py-1 text-xs rounded-full ${
              selectedType === type
                ? 'bg-gray-200 font-medium'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{icon}</span>
            <span>{reactionLabels[type]}</span>
          </button>
        ))}
      </div>

      {/* Users list */}
      <div className="max-h-60 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <FaSpinner className="animate-spin text-gray-500 mr-2" />
            <span className="text-sm text-gray-500">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-2 text-sm">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 py-2 text-sm">
            No one has reacted {selectedType !== 'all' ? `with ${reactionLabels[selectedType]}` : ''} yet
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {users.map((user) => (
              <li key={user._id} className="py-2">
                <Link
                  to={`/user-profile/${user._id}`}
                  className="flex items-center hover:bg-gray-50 p-1 rounded"
                >
                  <div className="flex-shrink-0 mr-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {reactionIcons[user.reactionType]}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReactionUsersList;
