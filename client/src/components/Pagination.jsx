import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-[var(--grey--700)] hover:bg-gray-50 hover:text-[var(--grey--900)]'
        }`}
      >
        Previous
      </button>
      <div className="flex items-center gap-2">
        <span className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
          {currentPage}
        </span>
        <span className="text-[var(--grey--600)]">of</span>
        <span className="text-[var(--grey--900)] font-medium">
          {totalPages}
        </span>
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-[var(--grey--700)] hover:bg-gray-50 hover:text-[var(--grey--900)]'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
