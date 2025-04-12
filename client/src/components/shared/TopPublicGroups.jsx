import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import customFetch from '@/utils/customFetch';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';

const TopPublicGroups = () => {
  const { user } = useUser();
  const [publicGroups, setPublicGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningGroup, setJoiningGroup] = useState(null);
  const [pendingJoinRequests, setPendingJoinRequests] = useState([]);

  // Fetch public groups
  useEffect(() => {
    const fetchPublicGroups = async () => {
      try {
        setIsLoading(true);
        const { data } = await customFetch.get('/rooms/public');
        // Ensure we have valid data and limit to top 5
        const publicGroupsArray = Array.isArray(data) ? data.slice(0, 5) : [];
        setPublicGroups(publicGroupsArray);
      } catch (error) {
        console.error('Error fetching public groups:', error);
        // Use placeholder data if API fails
        setPublicGroups(getPlaceholderGroups());
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPendingJoinRequests = async () => {
      if (!user) return;

      try {
        const { data } = await customFetch.get('/rooms/join-requests/pending');
        // Extract room IDs from pending requests
        const pendingRoomIds = data.map(request => request.roomId);
        setPendingJoinRequests(pendingRoomIds);
      } catch (error) {
        console.error('Error fetching pending join requests:', error);
        setPendingJoinRequests([]);
      }
    };

    fetchPublicGroups();
    fetchPendingJoinRequests();
  }, [user]);

  // Handle joining a group
  const handleJoinGroup = async (groupId) => {
    if (!user) {
      toast.error('Please login to join a group');
      return;
    }

    try {
      setJoiningGroup(groupId);
      await customFetch.post(`/rooms/${groupId}/join`);
      setPendingJoinRequests([...pendingJoinRequests, groupId]);
      toast.success('Join request sent successfully');
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error(error.response?.data?.message || 'Failed to join group');
    } finally {
      setJoiningGroup(null);
    }
  };

  // Placeholder groups in case API fails
  const getPlaceholderGroups = () => [
    {
      _id: '1',
      name: 'Mindfulness Practices 🧘‍♂️',
      description: 'Daily mindfulness exercises and discussions',
      members: [{ user: {} }, { user: {} }, { user: {} }],
    },
    {
      _id: '2',
      name: 'Coping with Anxiety 💭',
      description: 'Support group for anxiety management',
      members: [{ user: {} }, { user: {} }, { user: {} }, { user: {} }],
    },
    {
      _id: '3',
      name: 'Therapy Techniques 📖',
      description: 'Sharing effective therapy approaches',
      members: [{ user: {} }, { user: {} }],
    },
    {
      _id: '4',
      name: 'Depression Support Group ❤️',
      description: 'A safe space for those dealing with depression',
      members: [{ user: {} }, { user: {} }, { user: {} }, { user: {} }, { user: {} }],
    },
    {
      _id: '5',
      name: 'Stress Management Workshops 🌱',
      description: 'Learn techniques to manage daily stress',
      members: [{ user: {} }, { user: {} }, { user: {} }],
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaUsers className="mr-2 text-[var(--primary)]" />
          Top Public Rooms
        </h3>
        {!user ? (
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => {
              if (!user) {
                toast.error('Please login to join a group');
                return;
              }
            }}
          >
            View All
          </button>
        ) : (
          <Link to="/chats" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {publicGroups.length > 0 ? (
            publicGroups.map((group) => (
              <div
                key={group._id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {group.image ? (
                      <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-blue-600 font-medium text-lg">
                        {group.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{group.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {group.description || `${group.members?.length || 0} members`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinGroup(group._id)}
                  disabled={joiningGroup === group._id || pendingJoinRequests.includes(group._id)}
                  className={`flex-shrink-0 p-2 rounded-full ${pendingJoinRequests.includes(group._id)
                    ? 'bg-green-50 text-green-600'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    } transition-colors`}
                  title={pendingJoinRequests.includes(group._id) ? 'Join request pending' : 'Join group'}
                >
                  {joiningGroup === group._id ? (
                    <div className="animate-spin h-4 w-4 border-b-2 border-current rounded-full"></div>
                  ) : pendingJoinRequests.includes(group._id) ? (
                    <FaCheckCircle className="h-4 w-4" />
                  ) : (
                    <FaUserPlus className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No public Rooms available
            </div>
          )}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-gray-100">
        <h4 className="font-medium text-gray-700 mb-2">Why Join Rooms?</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <span className="text-[var(--primary)] mr-2">•</span>
            <span>Connect with people who share similar experiences</span>
          </li>
          <li className="flex items-start">
            <span className="text-[var(--primary)] mr-2">•</span>
            <span>Participate in group discussions</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TopPublicGroups;
