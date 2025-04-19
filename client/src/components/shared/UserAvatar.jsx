import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import {
  FaUserSecret,
  FaUserCircle,
  FaMedal,
  FaTrophy,
  FaGem,
  FaCrown,
  FaStar,
  FaCheck,
} from "react-icons/fa";

// Avatar frames data
const avatarFrames = [
  { id: "default", name: "Default", minPoints: 0, color: "ring-gray-200", icon: <FaUserCircle /> },
  { id: "bronze", name: "Bronze", minPoints: 50, color: "ring-amber-700", icon: <FaMedal className="text-amber-700" /> },
  { id: "silver", name: "Silver", minPoints: 300, color: "ring-gray-600", icon: <FaMedal className="text-gray-400" /> },
  { id: "gold", name: "Gold", minPoints: 1200, color: "ring-yellow-400", icon: <FaTrophy className="text-yellow-500" /> },
  { id: "diamond", name: "Diamond", minPoints: 2000, color: "ring-blue-400", icon: <FaGem className="text-blue-400" /> },
  { id: "elite", name: "Elite", minPoints: 5000, color: "ring-purple-500", icon: <FaCrown className="text-purple-500" /> },
];

// Avatar accessories data
const avatarAccessories = [
  { id: "star", name: "Star Badge", minPoints: 100, icon: <FaStar className="text-yellow-400" />, position: "top-0 right-0", size: "medium" },
  { id: "verified", name: "Verified Mark", minPoints: 500, icon: <FaCheck className="text-blue-500" />, position: "bottom-0 right-0", size: "medium" },
  { id: "crown", name: "Crown", minPoints: 1500, icon: <FaCrown className="text-yellow-500" />, position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2", size: "large" },
  { id: "gem", name: "Gem", minPoints: 2500, icon: <FaGem className="text-purple-500" />, position: "bottom-0 left-0", size: "medium" },
];


const getAccessorySize = (size) => {
  const sizes = {
    small: "w-3 h-3",
    medium: "w-4 h-4",
    large: "w-6 h-6",
  };
  return sizes[size] || "w-4 h-4"; // Default to medium
};

const UserAvatar = ({
  createdBy,
  username = "Anonymous",
  userAvatar,
  createdAt,
  size = "medium",
  compact = false,
  userAvatarFrame = "default",
  userAvatarAccessories = [],
}) => {
  // Determine effective size based on compact mode
  const effectiveSize = compact ? "verySmall" : size;

  // Size classes configuration
  const sizeClasses = {
    verySmall: { image: "w-7 h-7 sm:w-8 sm:h-8", text: "text-[0.7rem] sm:text-[0.8rem]", date: "text-[0.6rem] sm:text-[0.7rem]", gap: "gap-1" },
    small: { image: "w-5 h-5 sm:w-6 sm:h-6", text: "text-xs sm:text-sm", date: "text-xs sm:text-sm", gap: "gap-2", accessoryPosition: "top-[0px] -right-[6px] -translate-x-1/2 -translate-y-1/2" },
    medium: { image: "w-8 h-8 sm:w-10 sm:h-10", text: "text-sm sm:text-base", date: "text-sm sm:text-md", gap: "gap-3" , accessoryPosition: "top-[0px] -right-[8px] -translate-x-1/2 -translate-y-1/2"},
    large: { image: "w-10 h-10 sm:w-12 sm:h-12", text: "text-base sm:text-lg", date: "text-xs sm:text-sm", gap: "gap-4" , accessoryPosition: "top-[0px] -right-[4px] -translate-x-1/2 -translate-y-1/2"},
  };

  // Determine current frame
  const currentFrame = avatarFrames.find((f) => f.id === userAvatarFrame) || avatarFrames[0];

  // Map and filter accessories
  const eligibleAccessories = userAvatarAccessories
    .map((accId) => avatarAccessories.find((a) => a.id === accId))
    .filter((accessory) => accessory); // Remove null/undefined accessories

  return (
    <div className={`flex items-center ${sizeClasses[effectiveSize]?.gap || "gap-2"}`}>
      <div
        className={`relative inline-block ${currentFrame.color} ring-2 rounded-full shadow-sm`}
        style={{
          width: sizeClasses[effectiveSize].image.split(" ")[0],
          height: sizeClasses[effectiveSize].image.split(" ")[1] || sizeClasses[effectiveSize].image.split(" ")[0],
        }}
      >
        <img
          src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`}
          alt={`${username}'s profile`}
          className={`object-cover rounded-full transition-opacity duration-300 ${sizeClasses[effectiveSize].image}`}
        />
        {eligibleAccessories.length > 0 && (
          <>
            {eligibleAccessories.map((accessory) => (
              <div
                key={accessory.id}
                className={`absolute flex items-center bg-white justify-center rounded-full shadow-md z-10  ${sizeClasses[effectiveSize]?.accessoryPosition} ${getAccessorySize(accessory.size)}`}
              >
                {accessory.icon}
              </div>
            ))}
          </>
        )}
      </div>
      <div className="flex flex-col cursor-pointer">
        <Link to={`/about/user/${createdBy}`} className="hover:text-blue-500 transition-colors duration-200">
          <p className={`font-semibold text-gray-900 ${sizeClasses[effectiveSize].text} m-0 flex items-center gap-1 capitalize hover:underline`}>
            {username === "Anonymous" ? (
              <>
                <FaUserSecret className="text-gray-500" />
                {username}
              </>
            ) : (
              username
            )}
          </p>
        </Link>
        {!compact && createdAt && (
          <p className={`${sizeClasses[effectiveSize].date} text-gray-500`}>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;