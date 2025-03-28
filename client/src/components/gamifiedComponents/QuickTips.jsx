import { FaBook } from "react-icons/fa"

const QuickTips = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg container mt-8">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
      <FaBook className="text-purple-500" /> Quick Tips
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-purple-50 rounded-lg">
        <h4 className="font-medium mb-2">Daily Engagement</h4>
        <p className="text-sm text-gray-600">
          Keep your daily streak alive! Consistently visit the platform to 
          increase your streak count and unlock long-term achievements.
        </p>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium mb-2">Badge Collection</h4>
        <p className="text-sm text-gray-600">
          Earn badges by creating posts, answering questions, commenting, 
          and supporting others. Each milestone brings unique recognition!
        </p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg">
        <h4 className="font-medium mb-2">Community Contributions</h4>
        <p className="text-sm text-gray-600">
          Earn points for every meaningful interaction. Posts, answers, 
          comments, and likes all contribute to your total points and progress.
        </p>
      </div>
    </div>
  </div>
  )
}
export default QuickTips