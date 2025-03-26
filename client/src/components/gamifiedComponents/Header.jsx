import { FaCalendarCheck, FaChartLine } from "react-icons/fa"

const Header = ({user, completedTasks }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <div className="flex items-center gap-4">
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaChartLine className="text-purple-500" />
                    {user.totalPoints} points
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaCalendarCheck className="text-green-500" />
                    {user.streakCount} day streak
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-purple-600 text-sm">Tasks Completed</p>
              <p className="text-2xl font-bold">
                {completedTasks}
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-blue-600 text-sm">Points Earned</p>
              <p className="text-2xl font-bold">
                {user?.totalPoints}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-green-600 text-sm">Best Streak</p>
              <p className="text-2xl font-bold">
                {user?.longestStreak} day{user?.longestStreak > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
  )
}
export default Header