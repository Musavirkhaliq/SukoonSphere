# SukoonSphere

SukoonSphere is an innovative digital platform designed to address critical gaps in mental health awareness, education, and access to care. Through both a website and mobile app, SukoonSphere aims to create a comprehensive and supportive environment where users can access information, connect with professionals, and engage in meaningful discussions about mental health. The platform will serve as a hub for individuals seeking support, professionals looking to enhance their skills, and institutions aiming to collaborate with experts.

## Environment Setup

### Environment Variables
This project uses environment variables for configuration. Example files are provided:
- `.env.example` in the root directory
- `client/.env.example` in the client directory

To set up your environment:
1. Copy these example files to create your own `.env` files
2. Fill in your own values for the variables

**IMPORTANT: Never commit `.env` files to version control as they may contain sensitive information like API keys and secrets.**

## Project Objectives:
1.	Increase Mental Health Awareness: Provide accessible, engaging content that educates the public on mental health issues, treatments, and wellness practices.
2.	Create a Safe Space for Dialogue: Facilitate open conversations between individuals affected by mental health issues and those seeking to understand them better, especially students.
3.	Facilitate Professional Connections: Connect mental health experts with institutions and individuals in need of their services.
4.	Enhance Professional Skills: Offer resources and training for current and aspiring mental health professionals.
5.	Reduce Mental Health Stigma: Encourage open discussions, storytelling, and shared experiences to reduce the stigma associated with mental health.

Key Features:
1.	Curated Articles on Mental Health Topics:
•	A diverse collection of articles providing in-depth insights into various mental health issues, treatments, and wellness practices.
2.	Interactive Neuroscience Content:
•	Engaging, educational content that explores the brain's role in mental health, designed to be accessible and informative for all users.
3.	Expert-Institution Matchmaking System:
•	A feature that connects mental health experts with institutions in need of their services, fostering professional collaboration and enhancing care delivery.
4.	Therapist Training Portal:
•	A resource-rich portal offering training and development opportunities for aspiring and current mental health professionals, supporting their ongoing education and skill enhancement.
5.	Resource Directory for Seeking Help:
•	A comprehensive directory of mental health resources, including contact information for therapists, clinics, and support groups, ensuring users can easily find the help they need.
6.	Share a Story:
•	A section where users can share personal experiences with mental health, offering support and connection within the community, and encouraging others to share their own stories.
7.	Create and Share Videos:
•	A platform for users and experts to create and share video content related to mental health, including tips, therapy sessions, meditation guides, and personal experiences.
8.	Podcasts:
•	A dedicated space for hosting and listening to mental health podcasts, featuring expert insights, personal stories, and educational discussions.
9.	Debates and Discussions:
•	An interactive forum where users can engage in debates and discussions on mental health issues, moderated by professionals to ensure a safe and respectful environment.
10.	Write and Publish Articles:
•	A feature that allows users and professionals to write and publish articles on mental health topics, contributing to a diverse and ever-growing knowledge base.
11.	Virtual Support Groups:
•	Facilitated online support groups where individuals facing similar mental health challenges can connect and support each other, guided by professional facilitators.
12.	Mental Health Challenges:
•	Regular challenges that encourage users to engage in positive mental health practices, such as mindfulness, journaling, or exercise, promoting proactive self-care.
13.	Interactive Webinars and Workshops:
•	Live sessions led by mental health experts, covering a wide range of topics and available to both the general public and professionals, enhancing knowledge and skills.
14.	Mental Health Resource Library:
•	A comprehensive library of books, articles, videos, and other resources, categorized by mental health topics, providing users with easy access to reliable information.
15.	Expert Q&A Sessions:
•	Regular live Q&A sessions with mental health professionals, offering users direct access to expert advice and personalized guidance.
16.	Mental Health Journal:
•	A secure, private journal feature where users can track their thoughts, moods, and progress over time, encouraging self-reflection and mental health monitoring.








/*/*/*/*/*/**/*/*/*/*/*  Website Deployment Process  /*/*/*/*/*/**/*/*/*/*/*

/*/*/*/*/**/*/*/*/* Prerequistes /*/*/*/*/*/**/*/
Step 1- Copy github repository(if not copied yet).
        command: git clone github_repo_url

Step 2- Navigate to repository.
        command: code folder_name

Step 3- Setup node modules.
        command: npm i (both in client and BE)

Step 4- Set up environment variables.
        - Copy `.env.example` to `.env` in the root directory
        - Copy `client/.env.example` to `client/.env`
        - Fill in your own values for the environment variables

Step 5- Create build version of client.
        command: npm run build

/*/*/*/*/**/*/*/*/* VPS commands- Deploy website /*/*/*/*/*/**/*/


Step 1- Check Running Processes:
        command: ps aux | grep node

Step 2- Identify running Node.js processes.

Step 3- Terminate process if any:
        command: sudo kill processId-PID(eg. 182928)

Step 4- Clear Log File:
        command rm nohup.out

Step 5- Remove the nohup.out log file to start fresh.
        Optional- Restart Server:
        reboot

Step 6-  Launch the Node.js server application in the background.
        command: nohup node server.js & (run command in BE)

Step 7- Start a preview server for the application on the host machine.
        command: nohup pnpm preview --host &

Step 8- Exit terminals.
        command: exit

/*/*/*/*/**/*/*/*/* Database commands-  /*/*/*/*/**/*/
Check mongoDb.
        command: mongosh
Show database.
        command: show dbs
Use database or clustures.
        command: use --clusture or db name

/*/*/*/*/**/*/*/*/* Clone and backup local Database /*/*/*/*/*/**/*/
Clone database.
        command: mongodump --out "." --host loacalhost --port27017
Copy to folder.
        command: chmod +x backup.sh


//////
import customFetch from "@/utils/customFetch";
import React, { useEffect, useState } from "react";
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
  )
;
  useEffect(() => {
    const gamification = async () => {
      const { data } = await customFetch.get(`/user/gamification`);
      console.log({  data });
    };
    gamification();
  }, []);

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



















import React, { useEffect, useState } from "react";
import {
  FaMedal,
  FaStar,
  FaFire,
  FaCheckCircle,
  FaTasks,
  FaTrophy,
  FaChartBar,
  FaAward,
  FaUser,
  FaClipboardList
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import customFetch from "@/utils/customFetch";

const GamifiedDashboard = () => {
  const [data, setData] = useState({
    completed: [],
    pending: [],
    user: {},
    topUsers: []
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchGamification = async () => {
      try {
        const { data } = await customFetch.get(`/user/gamification`);
        setData(data);
      } catch (error) {
        console.error("Error fetching gamification data:", error);
      }
    };
    fetchGamification();
  }, []);

  // Prepare data for charts
  const activityData = [
    { name: 'Posts', value: data.user.postCount || 0 },
    { name: 'Likes', value: data.user.likeCount || 0 },
    { name: 'Comments', value: data.user.commentCount || 0 },
    { name: 'Answers', value: data.user.answerCount || 0 },
    { name: 'Questions', value: data.user.questionCount || 0 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  const tabs = [
    { value: "overview", icon: FaChartBar, label: "Overview" },
    { value: "pending", icon: FaClipboardList, label: "Pending" },
    { value: "completed", icon: FaCheckCircle, label: "Completed" },
    { value: "leaderboard", icon: FaTrophy, label: "Leaderboard" }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen p-6">
      <div className="container mx-auto max-w-6xl">
        {/* User Header */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 flex items-center">
          <img
            src={data.user.avatar || '/default-avatar.png'}
            alt={data.user.name}
            className="w-28 h-28 rounded-full mr-6 border-4 border-blue-500 object-cover"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{data.user.name}</h1>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                <FaStar className="text-yellow-500 mr-2 text-xl" />
                <span className="font-semibold text-gray-700">
                  Total Points: {data.user.totalPoints}
                </span>
              </div>
              <div className="flex items-center bg-red-50 px-3 py-1 rounded-full">
                <FaFire className="text-red-500 mr-2 text-xl" />
                <span className="font-semibold text-gray-700">
                  Streak: {data.user.streakCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-2 bg-white rounded-xl shadow-md p-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center justify-center py-3 space-x-2 rounded-lg transition-all duration-300 group ${
                  activeTab === tab.value
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <tab.icon className={`text-lg ${
                  activeTab === tab.value
                    ? "text-white"
                    : "text-gray-400 group-hover:text-blue-500"
                }`} />
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Activity Bar Chart */}
              <div className="bg-white shadow-xl rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <FaTasks className="mr-3 text-blue-500 text-2xl" />
                  <h2 className="text-2xl font-bold text-gray-800">User Activity</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityData}>
                    <XAxis dataKey="name" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip
                      cursor={{fill: 'rgba(0,0,0,0.1)'}}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#3B82F6"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Achievements Pie Chart */}
              <div className="bg-white shadow-xl rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <FaMedal className="mr-3 text-green-500 text-2xl" />
                  <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: data.progress?.completed.length || 0 },
                        { name: 'Pending', value: data.progress?.pending.length || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend
                      iconType="circle"
                      align="center"
                      verticalAlign="bottom"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Pending Tab */}
          {activeTab === "pending" && (
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <FaClipboardList className="mr-3 text-blue-500 text-2xl" />
                <h2 className="text-2xl font-bold text-gray-800">Pending Badges</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.progress?.pending?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 p-5 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center mb-3">
                      <FaAward className="mr-4 text-blue-500 text-3xl" />
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg text-gray-800">{item.badge}</h3>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{
                          width: `${((item.currentProgress || 0) / item.nextMilestone) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {item.currentProgress} / {item.nextMilestone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tab */}
          {activeTab === "completed" && (
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <FaCheckCircle className="mr-3 text-green-500 text-2xl" />
                <h2 className="text-2xl font-bold text-gray-800">Completed Badges</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.progress?.completed?.map((badge, index) => (
                  <div
                    key={index}
                    className="bg-green-50 p-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-green-100 transition-all duration-300"
                  >
                    <FaTrophy className="text-green-500 text-2xl" />
                    <span className="text-green-800 font-semibold">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <FaTrophy className="mr-3 text-yellow-500 text-2xl" />
                <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="p-4 text-left font-bold text-gray-700 rounded-l-xl">Rank</th>
                      <th className="p-4 text-left font-bold text-gray-700">Name</th>
                      <th className="p-4 text-left font-bold text-gray-700 rounded-r-xl">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topUsers?.map((user, index) => (
                      <tr
                        key={user._id}
                        className={`border-b border-gray-100 ${
                          user._id === data.user._id
                            ? "bg-blue-100 font-semibold"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center">
                            <span className={`mr-3 ${
                              index === 0 ? "text-yellow-500" :
                              index === 1 ? "text-gray-400" :
                              index === 2 ? "text-yellow-700" : ""
                            }`}>
                              {index + 1}
                            </span>
                            {index < 3 && <FaTrophy />}
                          </div>
                        </td>
                        <td className="p-4 flex items-center">
                          <FaUser className="mr-2 text-gray-500" />
                          {user.name}
                        </td>
                        <td className="p-4">{user.totalPoints || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamifiedDashboard;