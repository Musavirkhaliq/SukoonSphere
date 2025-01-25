import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ActionButtons = ({ onEdit, onDelete, isAuthor }) => {
    if (!isAuthor) return null;

    return (
        <div className="flex space-x-2">
            <button
                onClick={onEdit}
                className="text-gray-500 hover:text-blue-500"
            >
                <FaEdit className="w-4 h-4" />
            </button>
            <button
                onClick={onDelete}
                className="text-gray-500 hover:text-red-500"
            >
                <FaTrash className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ActionButtons; 