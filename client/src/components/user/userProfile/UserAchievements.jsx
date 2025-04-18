import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/customFetch";
import {
  FaTrophy,
  FaMedal,
  FaAward,
  FaStar,
  FaCheck,
  FaHeart,
  FaComment,
  FaQuestion,
  FaPen,
  FaCalendarCheck,
  FaFire,
  FaFlag,
  FaChevronDown,
  FaChevronUp,
  FaCrown,
  FaLock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import LeaderBoard from "@/components/gamifiedComponents/LeaderBoard";

const UserAchievements = () => {
  const [gamifiedData, setGamifiedData] = useState({
    completed: [],
    pending: [],
    user: {},
    topUsers: [],
  });
  const [isGamifiedLoading, setIsGamifiedLoading] = useState(true);
  const [gamifiedError, setGamifiedError] = useState(null);
  const user = useOutletContext();
  const { user: currentUser } = useUser();

  const isOwnProfile = currentUser?._id === user?._id;

  const [openSection, setOpenSection] = useState("completed");
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    const gamification = async () => {
      setIsGamifiedLoading(true);
      try {
        const { data } = await customFetch.get(`/user/gamification`);
        setGamifiedData(data);
      } catch (error) {
        setGamifiedError(error.response?.data?.message || "Failed to load leaderboard data");
        toast.error(error.response?.data?.message || "Failed to load leaderboard data");
      } finally {
        setIsGamifiedLoading(false);
      }
    };
    gamification();
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userAchievements", user?._id],
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
    if (badge.includes("Post")) return <FaPen className="text-blue-500" />;
    if (badge.includes("Answer")) return <FaCheck className="text-green-500" />;
    if (badge.includes("Question"))
      return <FaQuestion className="text-purple-500" />;
    if (badge.includes("Comment"))
      return <FaComment className="text-yellow-500" />;
    if (badge.includes("Like")) return <FaHeart className="text-red-500" />;
    if (badge.includes("Streak")) return <FaStar className="text-orange-500" />;
    return <FaAward className="text-gray-500" />;
  };

  // Toggle accordion sections
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Modal for badge details
  const BadgeDetailModal = () => {
    if (!selectedBadge) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Badge Details</h3>
            <button
              onClick={() => setSelectedBadge(null)}
              className="text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">{getBadgeIcon(selectedBadge)}</div>
            <h2 className="text-xl font-bold">{selectedBadge}</h2>
          </div>

          <p className="text-gray-600 mb-4">
            This badge is earned through active participation in the community.
            Continue engaging to unlock more achievements!
          </p>

          <button
            onClick={() => setSelectedBadge(null)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
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
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No Achievements Yet
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          This user hasn't earned any achievements yet. Achievements are earned
          by participating in the community.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Rank and Points Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                {data?.user?.rank <= 3 ? (
                  <FaCrown className="text-yellow-300 text-3xl" />
                ) : (
                  <FaMedal className="text-white text-3xl" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-purple-900 rounded-full px-2 py-1 text-xs font-bold">
                #{data?.user?.rank || "?"}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-1">Total Points</h3>
              <p className="text-sm opacity-80">
                Earned through community participation
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-4xl font-bold">
              {data?.user?.totalPoints || 0}
            </div>
            <div className="text-sm opacity-80 mt-1">
              {data?.currentPoints > 1200
                ? "🏆 Current Leader!"
                : data?.currentPoints > 700
                  ? "🪙 Top 10 Rank!"
                  : data?.currentPoints > 300
                    ? "🥉 Top 25 Rank!"
                    : "Community Rank"}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <Link
          to="/gamifiedDashboard"
          className="text-sm md:text-base text-[var(--ternery)] hover:underline"
        >
          View achievement dashboard
        </Link>
      </div>

      {/* Badge Detail Modal */}
      <BadgeDetailModal />

      {/* Streak Journey Visualization */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FaFire className="text-orange-500 mr-2" /> Streak Journey
        </h3>

        <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <FaCalendarCheck className="text-orange-500 text-xl" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                {data?.user?.streakCount || 0} Day Streak
              </h4>
              <p className="text-sm text-gray-500">
                Longest: {data?.user?.longestStreak || 0} days
              </p>
            </div>
          </div>

          <div className="bg-orange-100 px-4 py-2 rounded-full text-orange-700 text-sm font-medium">
            {data?.streakProgress?.current === 0
              ? "Start your streak today!"
              : data?.streakProgress?.current >= 30
                ? "Incredible dedication!"
                : data?.streakProgress?.current >= 7
                  ? "Great consistency!"
                  : "Keep going!"}
          </div>
        </div>

        {/* Journey Path Visualization */}
        <div className="relative py-8 overflow-x-auto">
          <div className="min-w-md">
            {/* Journey Line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2 z-0"></div>

            {/* Milestone Markers */}
            <div className="relative z-10 flex justify-between">
              {data?.streakProgress?.milestones.map((milestone, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-8 ${
                      milestone.achieved
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {index === data?.streakProgress?.milestones.length - 1 ? (
                      <FaFlag
                        className={
                          milestone.achieved ? "text-white" : "text-gray-400"
                        }
                      />
                    ) : (
                      <FaStar
                        className={
                          milestone.achieved ? "text-white" : "text-gray-400"
                        }
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      milestone.achieved ? "text-orange-500" : "text-gray-400"
                    }`}
                  >
                    {milestone.days}d
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div
              className="absolute top-1/2 left-0 h-2 bg-orange-500 rounded-full transform -translate-y-1/2 z-5"
              style={{
                width: `${Math.min(100, (data?.streakProgress?.current / (data?.streakProgress?.milestones[data?.streakProgress?.milestones.length - 1]?.days || 365)) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          {data?.streakProgress?.current > 0 ? (
            <p>
              You're on a {data?.streakProgress?.current} day streak! Next
              milestone: {data?.streakProgress?.nextMilestone} days
            </p>
          ) : (
            <p>Visit daily to build your streak and earn special badges!</p>
          )}
        </div>
      </div>

      {/* Achievements Accordion */}
      <div className="bg-white  rounded-xl shadow-md overflow-hidden space-y-4">
        {/* Completed Achievements Section */}
        <div className="">
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none "
            onClick={() => toggleSection("completed")}
            aria-expanded={openSection === "completed"}
            aria-controls="completed-section"
          >
            <div className="flex items-center">
              <FaTrophy className="text-yellow-500 mr-2" />
              <h3 className="text-xl font-bold">Earned Achievements</h3>
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                {data?.progress?.completed?.length || 0}
              </span>
            </div>
            {openSection === "completed" ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {openSection === "completed" && (
            <div id="completed-section" className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.progress?.completed?.map((badge, index) => (
                  <div
                    key={index}
                    className="bg-white  rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4 cursor-pointer"
                    onClick={() => setSelectedBadge(badge)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedBadge(badge)}
                  >
                    <div className="text-3xl">{getBadgeIcon(badge)}</div>
                    <div className="flex-grow">
                      <h4 className="text-base font-semibold text-gray-800">
                        {badge}
                      </h4>
                      <p className="text-xs text-gray-500">Click for details</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Achievements Section */}
        {isOwnProfile && data?.progress?.pending?.length > 0 && (
          <div className="">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none  "
              onClick={() => toggleSection("pending")}
              aria-expanded={openSection === "pending"}
              aria-controls="pending-section"
            >
              <div className="flex items-center">
                <FaMedal className="text-gray-400 mr-2" />
                <h3 className="text-xl font-bold">Upcoming Challenges</h3>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {data?.progress?.pending?.length || 0}
                </span>
              </div>
              {openSection === "pending" ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {openSection === "pending" && (
              <div id="pending-section" className="p-4">
                <div className="flex justify-end mb-4">
                  <Link
                    to="/gamifiedDashboard"
                    className="text-sm md:text-base text-[var(--ternery)] hover:underline"
                  >
                    View all upcoming achievements
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data?.progress?.pending?.slice(0, 3).map((badge, index) => (
                    <div
                      key={index}
                      className="bg-gray-50  rounded-xl p-4 shadow-sm flex items-center space-x-4"
                    >
                      <div className="relative">
                        <div className="text-3xl text-gray-300">
                          {getBadgeIcon(badge.badge)}
                        </div>
                        <FaLock className="absolute -bottom-1 -right-1 text-sm text-gray-400" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-base font-semibold text-gray-600 mb-1">
                          {badge.badge}
                        </h4>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[var(--primary)] h-2 rounded-full"
                            style={{
                              width: `${(badge.currentProgress / badge.nextMilestone) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {badge.currentProgress} / {badge.nextMilestone}
                          </p>
                          <p className="text-xs text-blue-500 font-medium">
                            {Math.round(
                              (badge.currentProgress / badge.nextMilestone) *
                                100
                            )}
                            %
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {badge.task}s needed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Section */}
        <div className="">
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
            onClick={() => toggleSection("leaderBoard")}
            aria-expanded={openSection === "leaderBoard"}
            aria-controls="leaderboard-section"
          >
            <div className="flex items-center">
              <FaMedal className="text-gray-400 mr-2" />
              <h3 className="text-xl font-bold">Leaderboard</h3>
            </div>
            {openSection === "leaderBoard" ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {openSection === "leaderBoard" && (
            <div id="leaderboard-section" className="p-4">
              {isGamifiedLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 "></div>
                </div>
              ) : gamifiedError ? (
                <div className="text-center py-8 text-red-500">
                  <p>{gamifiedError}</p>
                </div>
              ) : gamifiedData.topUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaTrophy className="text-gray-300 text-4xl mx-auto mb-4" />
                  <p>No leaderboard data available yet.</p>
                </div>
              ) : (
                <LeaderBoard data={gamifiedData} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAchievements;