import { FaSearch } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

const SearchAndFilterBar = ({
  searchInput,
  setSearchInput,
  setSearchParams,
  filterOptions,
  currentFilter,
  handleFilterChange,
}) => {
  return (
    <>
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search articles..."
          className="w-full md:w-1/3 lg:w-1/4 bg-[var(--white-color)] py-2 px-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput("");
              setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.delete("search");
                return newParams;
              });
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 md:mt-0">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-2 ${
                currentFilter === option.value
                  ? "bg-[var(--primary)] text-white"
                  : " text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchAndFilterBar;
