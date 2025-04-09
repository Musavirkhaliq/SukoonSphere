import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import customFetch from '@/utils/customFetch';
import { FaTrophy, FaMedal, FaAward, FaStar, FaCheck, FaHeart, FaComment, FaQuestion, FaPen, FaCalendarCheck, FaFire, FaFlag } from 'react-icons/fa';

const UserAchievements = () => {
  const user = useOutletContext();
  // Future implementation: Add state for badge detail modal

  const { data, isLoading, error } = useQuery({
    queryKey: ['userAchievements', user?._id],
    queryFn: async () => {
      const response = await customFetch.get(`/user/achievements/${user?._id}`);
      return response.data;
    },
    enabled: !!user?._id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Function to get icon for badge
  const getBadgeIcon = (badge) => {
    if (badge.includes('Post')) return <FaPen className="text-blue-500" />;
    if (badge.includes('Answer')) return <FaCheck className="text-green-500" />;
    if (badge.includes('Question')) return <FaQuestion className="text-purple-500" />;
    if (badge.includes('Comment')) return <FaComment className="text-yellow-500" />;
    if (badge.includes('Like')) return <FaHeart className="text-red-500" />;
    if (badge.includes('Streak')) return <FaStar className="text-orange-500" />;
    return <FaAward className="text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading achievements</p>
      </div>
    );
  }

  if (!data?.progress?.completed?.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FaTrophy className="text-gray-300 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Achievements Yet</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          This user hasn't earned any achievements yet. Achievements are earned by participating in the community.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Rank and Points */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                <FaMedal className="text-white text-3xl" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-purple-900 rounded-full px-2 py-1 text-xs font-bold">
                #{data?.user?.rank || '?'}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Total Points</h3>
              <p className="text-sm opacity-80">Earned through community participation</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{data?.user?.totalPoints || 0}</div>
            <div className="text-sm opacity-80 mt-1">
              {data?.user?.rank === 1 ? '🏆 Current Leader!' :
               data?.user?.rank <= 3 ? '🥇 Top 3 Rank!' :
               data?.user?.rank <= 10 ? '🌟 Top 10 Rank!' : 'Community Rank'}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" /> Achievements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.progress?.completed?.map((badge, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4"
              // onClick handler for future badge detail modal
              // onClick={() => setSelectedBadge(badge)}
            >
              <div className="text-3xl">{getBadgeIcon(badge)}</div>
              <div className="flex-grow">
                <h4 className="text-base font-semibold text-gray-800 mb-1">{badge}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Journey Visualization */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FaFire className="text-orange-500 mr-2" /> Streak Journey
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <FaCalendarCheck className="text-orange-500 text-xl" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{data?.user?.streakCount || 0} Day Streak</h4>
              <p className="text-sm text-gray-500">Longest: {data?.user?.longestStreak || 0} days</p>
            </div>
          </div>

          <div className="bg-orange-100 px-3 py-1 rounded-full text-orange-700 text-sm font-medium">
            {data?.streakProgress?.current === 0 ? 'Start your streak today!' :
             data?.streakProgress?.current >= 30 ? 'Incredible dedication!' :
             data?.streakProgress?.current >= 7 ? 'Great consistency!' : 'Keep going!'}
          </div>
        </div>

        {/* Journey Path Visualization */}
        <div className="relative py-8">
          {/* Journey Line */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2 z-0"></div>

          {/* Milestone Markers */}
          <div className="relative z-10 flex justify-between">
            {data?.streakProgress?.milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${milestone.achieved ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                >
                  {index === data?.streakProgress?.milestones.length - 1 ? (
                    <FaFlag className={milestone.achieved ? 'text-white' : 'text-gray-400'} />
                  ) : (
                    <FaStar className={milestone.achieved ? 'text-white' : 'text-gray-400'} />
                  )}
                </div>
                <span className={`text-xs font-medium ${milestone.achieved ? 'text-orange-500' : 'text-gray-400'}`}>
                  {milestone.days}d
                </span>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div
            className="absolute top-1/2 left-0 h-2 bg-orange-500 rounded-full transform -translate-y-1/2 z-5"
            style={{
              width: `${Math.min(100, (data?.streakProgress?.current / (data?.streakProgress?.milestones[data?.streakProgress?.milestones.length - 1]?.days || 365)) * 100)}%`
            }}
          ></div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          {data?.streakProgress?.current > 0 ? (
            <p>You're on a {data?.streakProgress?.current} day streak! Next milestone: {data?.streakProgress?.nextMilestone} days</p>
          ) : (
            <p>Visit daily to build your streak and earn special badges!</p>
          )}
        </div>
      </div>

      {/* Upcoming Achievements */}
      {data?.progress?.pending?.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <FaMedal className="text-gray-400 mr-2" /> Upcoming Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data?.progress?.pending?.slice(0, 3).map((badge, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex items-center space-x-4"
              >
                <div className="text-3xl text-gray-300">{getBadgeIcon(badge.badge)}</div>
                <div className="flex-grow">
                  <h4 className="text-base font-semibold text-gray-600 mb-1">{badge.badge}</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(badge.currentProgress / badge.nextMilestone) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {badge.currentProgress} / {badge.nextMilestone} {badge.task}s
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAchievements;
