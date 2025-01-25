import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const UserAvatar = ({ createdBy, username, userAvatar, createdAt, size = "medium" }) => {
  const sizeClasses = {
    small: {
      image: "w-5 h-5 sm:w-6 sm:h-6",
      text: "text-xs sm:text-sm",
      date: "text-xs sm:text-sm ",
      gap: "gap-2",
    },
    medium: {
      image: "w-8 h-8 sm:w-10 sm:h-10",
      text: "text-sm sm:text-base",
      date: "text-sm sm:text-md",
      gap: "gap-3",
    },
    large: {
      image: "w-10 h-10 sm:w-12 sm:h-12",
      text: "text-base sm:text-lg",
      date: "text-xs sm:text-sm",
      gap: "gap-4",
    },
    verySmall: {
      image: "w-7 h-7 sm:w-8 sm:h-8",
      text: "text-[.8rem]",
      date: "text-[0.7rem] ",
      gap: "gap-2",
    },
  };

  return (
    <div className={`flex ${sizeClasses[size].gap}`}>
      <img
        src={
          userAvatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "Anonymous")}&background=random`
        }
        alt={username || "User"}
        className={`${sizeClasses[size].image} rounded-full object-cover mt-1`}
      />
      <div className="cursor-pointer">
        <Link className="hover:text-blue-400" to={`/about/user/${createdBy}`}>
          <p className={`font-semibold  text-[var(--grey--900)] capitalize ${sizeClasses[size].text} m-0 hover:underline `}>
            {username}
          </p>
        </Link>
        <p className={`${sizeClasses[size].date} text-gray-500 mb-0`}>
          {createdAt
            ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
            : ""}
        </p>
      </div>
    </div>
  );
};

export default UserAvatar;
