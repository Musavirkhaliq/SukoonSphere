import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaList, FaTimes, FaTimesCircle } from "react-icons/fa";
import customFetch from "@/utils/customFetch";

const CreateNewPodcastPlaylist = ({ setShowModal }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            toast.error("Please fill in all required fields");
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
            
            // Append image file
            if (coverImage) {
                formData.append('image', coverImage);
            }

            // Log formData contents for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await customFetch.post("/podcasts/playlist", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                toast.success("Podcast playlist created successfully!");
                setShowModal(false);
            }
        } catch (error) {
            console.log('Error creating playlist:', error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else if (error.response?.data?.msg) {
                toast.error(error.response.data.msg);
            } else {
                toast.error("Error creating playlist. Please try again.");
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

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="p-4 bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all relative z-50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
                        <FaList className="text-[var(--primary)]" />
                        Create New Podcast Playlist
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
                            placeholder="Enter playlist title..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary"
                        />
                    </div>

                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter playlist description..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Cover Image (Max 5MB)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300"
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
                            {isSubmitting ? "Creating..." : "Create Playlist"}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-sm text-gray-600">
                    <p>After creating the playlist, you can add episodes to it from the podcast list.</p>
                </div>
            </div>
        </div>
    );
};

export default CreateNewPodcastPlaylist;
