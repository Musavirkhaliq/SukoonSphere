import React from "react";
import { Link } from "react-router-dom";

const SearchChatPersons = ({ searchResults, onPersonClick }) => {
  if (!searchResults || !Array.isArray(searchResults) || searchResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      {searchResults.map(person => {
        // Skip rendering if person is undefined or doesn't have an _id
        if (!person || !person._id) return null;

        return (
          <Link
            key={person._id}
            onClick={() => onPersonClick(person._id)}
            className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md"
          >
            <div className="relative flex-shrink-0 mr-3">
              <img
                src={
                  person?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    person?.name || "Anonymous"
                  )}&background=random`
                }
                alt={person?.name || "User"}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <span className="font-medium truncate">{person?.name}</span>
              {person?.email && (
                <p className="text-xs text-gray-500 truncate">{person?.email}</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SearchChatPersons;
