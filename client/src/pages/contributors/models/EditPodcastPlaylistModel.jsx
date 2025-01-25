import React, { useState } from 'react';
import { FaTimes, FaMusic } from 'react-icons/fa';
import customFetch from '@/utils/customFetch';
import { toast } from 'react-toastify';

const EditPodcastPlaylistModel = ({ setShowModal, playlist, fetchData }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(playlist.title);
    const [description, setDescription] = useState(playlist.description);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(playlist.imageUrl);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                toast.error('Image size should be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!title.trim()) {
            toast.error("Please fill in the title");
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await customFetch.patch(`/podcasts/playlist/${playlist._id}`, formData);
            toast.success('Playlist updated successfully');
    
                window.location.reload();
         
            setShowModal(false);
        } catch (error) {
            console.error('Error updating playlist:', error);
            toast.error(error?.response?.data?.msg || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
            if (fetchData){
                fetchData();
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="p-4 bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all relative z-50">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
                        <FaMusic className="text-{(--primary)}" />
                        Edit Playlist
                    </h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter playlist title..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300 placeholder-ternary"
                        />
                    </div>

                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter playlist description..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300 placeholder-ternary min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cover Image (Max 5MB)
                        </label>
                        <div className="flex items-center space-x-4">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Cover preview"
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="flex-1 px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPodcastPlaylistModel;
