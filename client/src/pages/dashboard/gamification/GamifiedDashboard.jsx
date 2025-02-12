import React, { useState } from "react";
import {
  FaCrown,
  FaMedal,
  FaTrophy,
  FaSeedling,
  FaChartLine,
  FaComments,
  FaBook,
  FaHeartbeat,
  FaCalendarCheck,
  FaLightbulb,
  FaHandsHelping,
  FaStar,
  FaCheckCircle,
  FaStopwatch,
  FaFireAlt,
} from "react-icons/fa";

const ProgressBar = ({ progress }) => (
  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const GamifiedDashboard = () => {
  // Enhanced state management
  const [activeTab, setActiveTab] = useState("overview");
  const [showBadgeDetails, setShowBadgeDetails] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [isChallengePending, setIsChallengePending] = useState(false);

  const currentLevel = {
    name: "Explorer",
    progress: 65,
    nextLevel: "Guide",
    points: 320,
    nextLevelPoints: 500,
    streak: 7,
    totalTasks: 145,
  };

  const stats = {
    week: { completed: 12, points: 240, streak: 7 },
    month: { completed: 45, points: 890, streak: 22 },
    year: { completed: 145, points: 2890, streak: 65 },
  };

  const badges = [
    {
      id: 1,
      name: "First Step",
      earned: true,
      icon: <FaSeedling />,
      description: "Complete your first task",
      earnedDate: "2024-02-01",
      progress: 100,
    },
    {
      id: 2,
      name: "Active Contributor",
      earned: true,
      icon: <FaComments />,
      description: "Make 50 meaningful comments",
      earnedDate: "2024-02-05",
      progress: 100,
    },
    {
      id: 3,
      name: "Knowledge Seeker",
      earned: false,
      icon: <FaBook />,
      description: "Complete 10 learning paths",
      progress: 60,
    },
    {
      id: 4,
      name: "Mental Health Hero",
      earned: false,
      icon: <FaHeartbeat />,
      description: "Complete 30 mindfulness sessions",
      progress: 40,
    },
    {
      id: 5,
      name: "Helping Hand",
      earned: false,
      icon: <FaHandsHelping />,
      description: "Help 20 community members",
      progress: 25,
    },
  ];

  const challenges = [
    {
      id: 1,
      title: "Daily Mindfulness",
      description: "Complete 3 mindfulness exercises",
      progress: 2,
      total: 3,
      reward: 50,
      type: "daily",
    },
    {
      id: 2,
      title: "Weekly Champion",
      description: "Help 5 community members",
      progress: 3,
      total: 5,
      reward: 100,
      type: "weekly",
    },
    {
      id: 3,
      title: "Learning Master",
      description: "Complete 2 learning paths",
      progress: 1,
      total: 2,
      reward: 150,
      type: "weekly",
    },
  ];

  const leaderboard = [
    { name: "User1", points: 1200, streak: 15, badges: 8 },
    { name: "User2", points: 980, streak: 12, badges: 7 },
    { name: "User3", points: 850, streak: 9, badges: 6 },
    { name: "User4", points: 720, streak: 8, badges: 5 },
    { name: "User5", points: 650, streak: 7, badges: 4 },
  ];

  const handleStartChallenge = (challengeId) => {
    setIsChallengePending(true);
    // Simulate API call
    setTimeout(() => {
      setIsChallengePending(false);
      toast.success("Challenge started! Good luck!");
    }, 1000);
  };

  const BadgeDetailModal = ({ badge, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl text-purple-500">{badge.icon}</span>
          <div>
            <h3 className="text-xl font-bold">{badge.name}</h3>
            <p className="text-gray-600">{badge.description}</p>
          </div>
        </div>
        <div className="mb-4">
          <ProgressBar progress={badge.progress} />
          <p className="text-sm text-gray-500 mt-2">
            Progress: {badge.progress}%
          </p>
        </div>
        {badge.earned && (
          <p className="text-green-600 flex items-center gap-2">
            <FaCheckCircle /> Earned on {badge.earnedDate}
          </p>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <FaTrophy className="text-white text-4xl" />
                </div>
                <span className="absolute -bottom-2 -right-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Level {currentLevel.name}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Sartaj Ashraf
                </h2>
                <div className="flex items-center gap-4">
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaChartLine className="text-purple-500" />
                    {currentLevel.points} XP
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaCalendarCheck className="text-green-500" />
                    {currentLevel.streak} day streak
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-gray-100 rounded-lg px-4 py-2 text-gray-700"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-purple-600 text-sm">Tasks Completed</p>
              <p className="text-2xl font-bold">
                {stats[selectedTimeframe].completed}
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-blue-600 text-sm">Points Earned</p>
              <p className="text-2xl font-bold">
                {stats[selectedTimeframe].points}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-green-600 text-sm">Best Streak</p>
              <p className="text-2xl font-bold">
                {stats[selectedTimeframe].streak} days
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          {["overview", "challenges", "achievements", "leaderboard"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-purple-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress Section */}
          {activeTab === "overview" && (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaMedal className="text-yellow-500" /> Level Progress
                </h3>
                <ProgressBar progress={currentLevel.progress} />
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  {["Newbie", "Explorer", "Guide", "Mentor"].map(
                    (level, idx) => (
                      <div
                        key={level}
                        className={`p-2 rounded-lg ${
                          currentLevel.name === level
                            ? "bg-purple-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <span className="block text-sm font-medium">
                          {level}
                        </span>
                        <span className="text-xs text-gray-500">
                          {idx === 0
                            ? "0+"
                            : idx === 1
                              ? "100+"
                              : idx === 2
                                ? "500+"
                                : "1000+"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" /> Active Challenges
                </h3>
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="bg-gray-50 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{challenge.title}</h4>
                          <p className="text-sm text-gray-600">
                            {challenge.description}
                          </p>
                        </div>
                        <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                          +{challenge.reward} XP
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar
                            progress={
                              (challenge.progress / challenge.total) * 100
                            }
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {challenge.progress}/{challenge.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaCrown className="text-purple-500" /> Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    onClick={() => setShowBadgeDetails(badge)}
                    className={`p-4 rounded-xl transition-all cursor-pointer hover:shadow-md ${
                      badge.earned
                        ? "bg-green-50 border-2 border-green-200"
                        : "bg-gray-50 border-2 border-dashed border-gray-200 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-2xl ${badge.earned ? "text-yellow-500" : "text-gray-400"}`}
                      >
                        {badge.icon}
                      </span>
                      <div>
                        <h4 className="font-medium">{badge.name}</h4>
                        <p className="text-sm text-gray-500">
                          {badge.description}
                        </p>
                        <div className="mt-2">
                          <ProgressBar progress={badge.progress} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {/* Previous code remains the same until the leaderboard section */}

          {activeTab === "leaderboard" && (
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div
                  key={user.name}
                  className={`p-4 rounded-xl transition-all ${
                    index === 0
                      ? "bg-yellow-50 border-2 border-yellow-200"
                      : index === 1
                        ? "bg-gray-100 border-2 border-gray-200"
                        : index === 2
                          ? "bg-orange-50 border-2 border-orange-200"
                          : "bg-white border-2 border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                                ? "bg-gray-500"
                                : index === 2
                                  ? "bg-orange-500"
                                  : "bg-purple-500"
                          }`}
                        >
                          <span className="text-white font-bold">
                            #{user.rank}
                          </span>
                        </div>
                        {index < 3 && (
                          <FaCrown
                            className={`absolute -top-2 -right-2 ${
                              index === 0
                                ? "text-yellow-500"
                                : index === 1
                                  ? "text-gray-500"
                                  : "text-orange-500"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{user.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaFireAlt className="text-orange-500" />
                            {user.streak} day streak
                          </span>
                          <span className="flex items-center gap-1">
                            <FaStar className="text-yellow-500" />
                            {user.badges} badges
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-purple-600">
                        {user.points} XP
                      </span>
                      {index === 0 && (
                        <div className="text-xs text-yellow-600 font-medium mt-1">
                          Current Leader! 🏆
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Weekly Challenge Banner */}
              <div className="mt-8 bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Weekly Challenge</h3>
                    <p className="opacity-90">Reach top 3 on the leaderboard</p>
                    <div className="flex items-center gap-2 mt-2">
                      <FaStar className="text-yellow-300" />
                      <span>Reward: Special Badge + 500 XP</span>
                    </div>
                  </div>
                  <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
                    View Challenges
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg container mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaBook className="text-purple-500" /> Quick Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium mb-2">Daily Engagement</h4>
            <p className="text-sm text-gray-600">
              Complete daily challenges to maintain your streak and earn bonus
              XP!
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Badge Collection</h4>
            <p className="text-sm text-gray-600">
              Focus on unlocking new badges to level up faster.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2">Community Help</h4>
            <p className="text-sm text-gray-600">
              Help others to earn extra points and unlock special achievements!
            </p>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default GamifiedDashboard;
