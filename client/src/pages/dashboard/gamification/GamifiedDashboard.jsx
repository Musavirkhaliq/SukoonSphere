
import Header from "@/components/gamifiedComponents/Header";
import Achievements from "@/components/gamifiedComponents/Achievements";
import Challenges from "@/components/gamifiedComponents/Challenges";
import LeaderBoard from "@/components/gamifiedComponents/LeaderBoard";
import QuickTips from "@/components/gamifiedComponents/QuickTips";
import ActiveChallenges from "@/components/gamifiedComponents/ActiveChallenges";
import customFetch from "@/utils/customFetch";
import UserProgress from "@/components/gamifiedComponents/UserProgress";
import React, { useEffect, useState } from "react";



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
  const [data, setData] = useState({
    completed: [],
    pending: [],
    user: {},
    topUsers: []
  });
  useEffect(() => {
    const gamification = async () => {
      const { data } = await customFetch.get(`/user/gamification`);
      setData(data);
    };
    gamification();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <Header user={data?.user} completedTasks={data?.progress?.completed?.length} />

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          {["overview", "challenges", "achievements", "leaderboard"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab
                  ? "bg-[var(--primary)] text-white"
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
          {activeTab === "overview" && (
            <>
              <UserProgress data={data} />
              <ActiveChallenges pending={data?.progress?.pending} ProgressBar={ProgressBar} />
            </>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <Achievements progress={data?.progress} />
          )}
          {activeTab === "challenges" && (
            <Challenges pending={data?.progress?.pending} ProgressBar={ProgressBar} />
          )}
        </div>
        {activeTab === "leaderboard" && (
          <LeaderBoard data={data} />
        )}
        <QuickTips />
      </div>
    </div>
  );
};

export default GamifiedDashboard;

