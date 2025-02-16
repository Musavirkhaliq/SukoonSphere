import React from "react";
import { Link } from "react-router-dom";

const SearchChatPersons = ({ person, handlePersonClick }) => {
  return (
    <Link
      key={person._id}
      onClick={() => handlePersonClick(person._id)}
      className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="relative flex-shrink-0 mr-3">
        <img
          src={
            person?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              person?.name || "Anonymous"
            )}&background=random`
          }
          alt={person.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 pr-1">
        <span className="font-medium truncate">{person?.name}</span>
      </div>
    </Link>
  );
};

export default SearchChatPersons;
