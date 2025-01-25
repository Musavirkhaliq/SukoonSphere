import React, { useState } from 'react'
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa'

const PostActions = ({ handleDelete, handleEdit }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaEllipsisV size={15} />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-100">
            <button
              onClick={() => {
                handleEdit();
                setShowDropdown(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              <FaEdit className="inline mr-2" /> Edit 
            </button>
            <button
              onClick={() => {
                handleDelete();
                setShowDropdown(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium"
            >
              <FaTrash className="inline mr-2" /> Delete
            </button>
          </div>
        )}
      </div>
    );
}

export default PostActions
