import { FaCrown } from "react-icons/fa"

const Challenges = ({pending, ProgressBar}) => {
  return (
    <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
      <FaCrown className="text-purple-500" /> Challenges
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {pending?.map((badge) => (
<div
key={badge?.badge}
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
  {badge.icon || '🏆'}
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
export default Challenges