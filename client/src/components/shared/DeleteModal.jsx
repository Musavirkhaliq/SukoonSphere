import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteModal = ({
    isOpen,
    onClose,
    onDelete,
    title = "Delete Confirmation",
    message = "Are you sure you want to delete this item?",
    itemType = "item",
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto ">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen p-4 ">
                <div className="relative bg-white rounded-[8px] shadow-xl max-w-md w-full p-6">
                    {/* Header */}
                    <div className="flex items-center justify-center mb-4">
                        <FaExclamationTriangle className="text-red-500 text-3xl" />
                        <h3 className="text-lg font-semibold ml-2">{title}</h3>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="text-gray-600 text-center">
                            {message}
                        </p>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            This action cannot be undone.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onDelete}
                            disabled={isLoading}
                            className="btn-red transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Deleting...' : `Delete ${itemType}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal; 