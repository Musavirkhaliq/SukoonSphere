import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaMicrophone, FaTimes, FaPlus, FaTimesCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import customFetch from "@/utils/customFetch";

const CreateNewPodcast = ({ setShowModal, type = 'single', playlistId = null, fetchData }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [episodeNo, setEpisodeNo] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title ) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!audioFile) {
            toast.error("Please upload an audio file");
            return;
        }

        if (!coverImage) {
            toast.error("Please upload a cover image");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            
            // Append all fields
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            formData.append('episodeNo', episodeNo.toString());
            formData.append('type', type);
            
            // If this is a playlist episode, include the playlist ID
            if (type === 'playlist' && playlistId) {
                formData.append('playlistId', playlistId);
            }
            
            // Append files
            if (audioFile) {
                formData.append('audio', audioFile);
            }
            if (coverImage) {
                formData.append('image', coverImage);
            }

            const response = await customFetch.post("/podcasts", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                toast.success(`${type === 'single' ? 'Podcast' : 'Playlist'} created successfully!`);
                setShowModal(false);
            }
        } catch (error) {
            console.log('Error creating podcast:', error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else if (error.response?.data?.msg) {
                toast.error(error.response.data.msg);
            } else {
                toast.error("Error creating podcast. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Image size should be less than 5MB");
                return;
            }
            setCoverImage(file);
        }
    };

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                toast.error("Audio file size should be less than 50MB");
                return;
            }
            setAudioFile(file);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="p-4 bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all relative z-50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
                        <FaMicrophone className="text-[var(--primary)]" />
                        {type === 'playlist' ? 'Add Episode to Playlist' : 'Create New Podcast'}
                    </h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter podcast title..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary"
                        />
                    </div>

                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter podcast description..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary min-h-[100px]"
                        />
                    </div>

                    {type === 'playlist' && <div>
                        <input
                            type="number"
                            value={episodeNo}
                            onChange={(e) => setEpisodeNo(e.target.value)}
                            placeholder="Episode number..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary"
                        />
                    </div>}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Cover Image (Max 5MB)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Audio File (Max 50MB)
                        </label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioChange}
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="btn-red flex items-center justify-center gap-2"
                        >
                            <FaTimesCircle />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-2"
                        >
                            {isSubmitting ? "Creating..." : type === 'playlist' ? "Add to Playlist" : "Create Podcast"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNewPodcast;