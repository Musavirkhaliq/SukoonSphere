import { FaCrown, FaFireAlt, FaMedal, FaStar } from "react-icons/fa"

const LeaderBoard = ({data}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-4">
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
        {/* User's Rank Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
                <FaMedal className="text-white text-3xl" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-purple-200 text-purple-800 rounded-full px-2 py-1 text-xs font-bold">
                #{data?.user?.rank}
              </div>
           
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{data?.user?.name} <sub className="text-gray-600">(you)</sub></h2>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <FaFireAlt className="text-orange-500" />
                  {data?.user?.longestStreak || 0} day streak
                </span>
                <span className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  {data?.user?.badges?.length || 0} badges
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-700">
              {data?.user?.totalPoints || 0} XP
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Your Ranking
            </div>
          </div>
        </div>
      </div>
      {data.topUsers.slice(0, 5).map((user, index) => (
        <div
          key={user._id}
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
                    #{user?.rank}
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
                <h4 className="font-bold text-gray-800">{user?.name}</h4>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaFireAlt className="text-orange-500" />
                    {user?.longestStreak || 0} day streak
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {user?.badges?.length || 0} badges
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-purple-600">
                {user?.totalPoints || 0} XP
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
    </div>
    
    <div className="space-y-4">
      {data.topUsers.slice(5,10).map((user, index) => (
        <div
          key={user._id}
          className={`p-4 rounded-xl transition-all bg-white border-2 border-gray-100`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    "bg-purple-500"
                  }`}
                >
                  <span className="text-white font-bold">
                    #{user?.rank}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{user?.name}</h4>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaFireAlt className="text-orange-500" />
                    {user?.longestStreak || 0} day streak
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {user?.badges?.length || 0} badges
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-purple-600">
                {user?.totalPoints || 0} XP
              </span>
         
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}
export default LeaderBoard