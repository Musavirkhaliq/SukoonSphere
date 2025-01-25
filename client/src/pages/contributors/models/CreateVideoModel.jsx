import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaVideo, FaTimes, FaPlus, FaTimesCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch";

const CreateVideoModel = ({ setShowModal }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [type, setType] = useState("single");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            formData.append('videoUrl', videoUrl.trim());
            formData.append('type', type);
            formData.append('coverImage', coverImage);

            const response = await customFetch.post("/videos/create-video", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                toast.success("Video created successfully!");
                // window.location.reload();

                setShowModal(false);

            }
        } catch (error) {
            console.error('Error creating video:', error);
            toast.error(error.response?.data?.msg || "Error creating video");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size should be less than 5MB");
                return;
            }

            setCoverImage(file);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden">
            <div className="p-4 bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all relative z-50 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
                        <FaVideo className="text-[var(--primary)]" />
                        Create New Video
                    </h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] p-2">
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter video title..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary"

                        />
                    </div>

                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter video description..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary min-h-[100px]"
                        />
                    </div>

                    <div>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300"
                        >
                            <option value="single">Single Video</option>
                            <option value="playlist">Playlist</option>
                        </select>
                    </div>

                    <div>
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="Enter video embedded URL..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary"

                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2 ">
                            Cover Image*
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="shadow appearance-none border  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-lg"

                        />
                    </div>

                    <div className="flex justify-start gap-3 pt-3 border-t">
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
                            <FaVideo className="mr-2" />
                            {isSubmitting ? "Creating..." : "Create Video"}
                        </button>
                    </div>
                  
                </form>
            </div>
        </div>
    );
};

export default CreateVideoModel;
