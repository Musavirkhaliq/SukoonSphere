import { FaLightbulb } from "react-icons/fa"
const ActiveChallenges = ({pending, ProgressBar}) => {
    const predictTopCompletableTasks = (pendingTasks, count = 3) => {
        // Calculate completion likelihood for each task
        const tasksWithLikelihood = pendingTasks?.map(task => ({
          ...task,
          completionLikelihood: calculateCompletionLikelihood(task)
        }));
      
        // Sort tasks by completion likelihood in descending order
        const sortedTasks = tasksWithLikelihood?.sort((a, b) => 
          b.completionLikelihood - a.completionLikelihood
        );
      
        // Return top tasks
        return sortedTasks?.slice(0, count);
      };
      
      const calculateCompletionLikelihood = (task) => {
        // Calculate percentage of progress towards milestone
        const progressPercentage = (task.currentProgress / task.nextMilestone) * 100;
        
        // Calculate remaining distance to milestone
        const remainingPercentage = (task.remaining / task.nextMilestone) * 100;
        
        // Combine factors to determine likelihood
        // Higher current progress and lower remaining distance increase likelihood
        return progressPercentage / (remainingPercentage + 1);
      };
      const topCompletableTasks = predictTopCompletableTasks(pending);
    
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
      <FaLightbulb className="text-yellow-500" /> Active Challenges
    </h3>
    <div className="space-y-4">
      {topCompletableTasks?.map((badge) => (
       <div
       key={badge?.name}
       className="
         bg-white 
         border 
         border-gray-200 
         rounded-xl 
         p-4 
         shadow-sm 
         hover:shadow-md 
         transition-all 
         duration-300 
         cursor-pointer 
         transform 
         hover:-translate-y-1
         flex 
         items-center 
         space-x-4
       "
     >
       {/* Icon Section */}
       <div className="text-3xl text-gray-500 opacity-70">
         {badge?.icon || '🏆'}
       </div>

       {/* Badge Details */}
       <div className="flex-grow">
         <h4 className="text-base font-semibold text-gray-800 mb-1">
           {badge?.badge}
         </h4>
         
         <p className="text-xs text-gray-500 mb-2">
           {badge?.currentProgress} / {badge?.nextMilestone}
         </p>
         
         <ProgressBar 
           progress={(badge?.currentProgress / badge?.nextMilestone) * 100} 
         />
       </div>
     </div>
      ))}
    </div>
  </div>
  )
}
export default ActiveChallenges