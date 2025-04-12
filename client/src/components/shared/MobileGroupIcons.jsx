import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import customFetch from '@/utils/customFetch';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';

const MobileGroupIcons = () => {
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
  const handleJoinGroup = async (groupId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking the join button

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
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center">
          <FaUsers className="mr-1 text-[var(--primary)]" />
          Rooms
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
        <div className="flex justify-center items-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide">
          {publicGroups.length > 0 ? (
            publicGroups.map((group) => (
              <Link
                to={`/chats?room=${group._id}`}
                key={group._id}
                className="flex-shrink-0 group"
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-all">
                      {group.image ? (
                        <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-blue-600 font-medium text-lg">
                          {group.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Join button overlay */}
                    <button
                      onClick={(e) => handleJoinGroup(group._id, e)}
                      disabled={joiningGroup === group._id || pendingJoinRequests.includes(group._id)}
                      className={`absolute -bottom-1 -right-1 p-1.5 rounded-full ${pendingJoinRequests.includes(group._id)
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white'
                        } shadow-md transition-colors`}
                      title={pendingJoinRequests.includes(group._id) ? 'Join request pending' : 'Join group'}
                    >
                      {joiningGroup === group._id ? (
                        <div className="animate-spin h-3 w-3 border-b-2 border-white rounded-full"></div>
                      ) : pendingJoinRequests.includes(group._id) ? (
                        <FaCheckCircle className="h-3 w-3" />
                      ) : (
                        <FaUserPlus className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-center mt-1 w-16 truncate">{group.name.split(' ')[0]}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-2 text-gray-500 text-xs w-full">
              No rooms available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileGroupIcons;
