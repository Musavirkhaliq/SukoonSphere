import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaUser, FaCamera, FaTimes, FaSpinner, FaCheck } from 'react-icons/fa';

const UserProfileModel = ({ onClose, user, handleProfileUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(user?.avatar || null);
    const fileInputRef = useRef(null);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target);
        try {
            const response = await handleProfileUpdate(formData);
            window.location.reload();
        } catch (error) {
            console.log({ errorInModel: error })
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const modelContent = (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all relative z-50">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close modal"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                <div className="px-6 sm:px-8 py-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--grey--900)]">
                            Update Your Profile
                        </h2>
                        <p className="text-[var(--grey--800)] mt-2">
                            Customize your profile information
                        </p>
                    </div>

                    <form
                        method="post"
                        encType="multipart/form-data"
                        className="space-y-6"
                        onSubmit={handleSubmit}
                    >
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center">
                            <div
                                onClick={handleImageClick}
                                className="relative group cursor-pointer"
                            >
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--primary)] shadow-lg">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <FaUser className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaCamera className="w-8 h-8 text-white" />
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="avatar"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <p className="text-sm text-[var(--grey--800)] mt-2">
                                Click to change profile picture
                            </p>
                        </div>

                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    name="name"
                                    required
                                    className="p-2 bg-[var(--body)] rounded-lg text-black  border border-gray-300 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all pl-10"
                                    placeholder="Enter your full name"
                                    defaultValue={user?.name}
                                />
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                disabled={isLoading}
                            >
                                <FaTimes className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`btn-2 relative flex items-center gap-2 ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="w-4 h-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FaCheck className="w-4 h-4" />
                                        Update Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    return createPortal(modelContent, document.body);
};

export default UserProfileModel;