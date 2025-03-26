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
  import { FaTasks, FaMedal } from "react-icons/fa";
import LevelProgress from "./Levelprogress";
const UserProgress = ({data}) => {
    const activityData = [
        { name: 'Posts', value: data.user.postCount || 0 },
        { name: 'Likes', value: data.user.likeCount || 0 },
        { name: 'Comments', value: data.user.commentCount || 0 },
        { name: 'Answers', value: data.user.answerCount || 0 },
        { name: 'Questions', value: data.user.questionCount || 0 }
      ];
      const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaMedal className="text-yellow-500" /> Level Progress
                </h3>
                <LevelProgress data={data} />
                 <div className="grid lg:grid-cols-2 gap-4 mt-4">
              {/* Activity Bar Chart */}
              <div className="bg-white shadow-lg rounded-2xl p-6 h">
                <div className="flex items-center mb-4">
                  <FaTasks className="mr-3 text-blue-500 text-2xl" />
                  <h3 className="text-lg font-bold text-gray-800">User Activity</h3>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={activityData}>
                    <XAxis dataKey="name" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip 
                      cursor={{fill: 'rgba(0,0,0,0.1)'}}
                      contentStyle={{
                        backgroundColor: 'white', 
                        borderRadius: '9px', 
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
                  <h3 className="text-lg font-bold text-gray-800">Achievements</h3>
                </div>
                <ResponsiveContainer width="100%" height={220}>
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
              </div>
  )
}
export default UserProgress