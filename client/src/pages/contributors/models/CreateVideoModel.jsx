import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaVideo, FaTimes, FaPlus, FaTimesCircle, FaMagic } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch";
import { getYoutubeId, getCompleteYoutubeMetadata } from "../../../utils/youtubeApi";

const CreateVideoModel = ({ setShowModal }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [type, setType] = useState("single");

    // Fetch YouTube metadata when URL changes
    useEffect(() => {
        const fetchYoutubeMetadata = async () => {
            // Only proceed if the URL looks like a YouTube URL
            const videoId = getYoutubeId(videoUrl);
            if (!videoId) return;

            try {
                setIsLoadingMetadata(true);
                const metadata = await getCompleteYoutubeMetadata(videoUrl);

                if (metadata) {
                    // Only update fields if they're empty or if user confirms
                    const shouldUpdate =
                        (!title && !description) ||
                        window.confirm("Do you want to replace the current title and description with the YouTube video details?");

                    if (shouldUpdate) {
                        setTitle(metadata.title || "");
                        setDescription(metadata.description || "");
                        setThumbnailUrl(metadata.thumbnailUrl || "");
                        toast.success("YouTube video details loaded successfully!");
                    }
                }
            } catch (error) {
                console.error("Error fetching YouTube metadata:", error);
                toast.error("Failed to load YouTube video details");
            } finally {
                setIsLoadingMetadata(false);
            }
        };

        // Debounce the API call to avoid too many requests
        const timeoutId = setTimeout(() => {
            if (videoUrl) {
                fetchYoutubeMetadata();
            }
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [videoUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            formData.append('videoUrl', videoUrl.trim());
            formData.append('type', type);

            // If we have a file upload, use that; otherwise try to use the YouTube thumbnail
            if (coverImage) {
                formData.append('coverImage', coverImage);
            } else if (thumbnailUrl) {
                // If we have a thumbnail URL but no file, we need to tell the backend to fetch it
                formData.append('thumbnailUrl', thumbnailUrl);
            }

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
            // Clear thumbnail URL if user uploads a file
            setThumbnailUrl("");
        }
    };

    const handleVideoUrlChange = (e) => {
        const url = e.target.value;
        setVideoUrl(url);
    };

    const handleFetchMetadata = async () => {
        if (!videoUrl) {
            toast.error("Please enter a YouTube URL first");
            return;
        }

        const videoId = getYoutubeId(videoUrl);
        if (!videoId) {
            toast.error("Invalid YouTube URL");
            return;
        }

        try {
            setIsLoadingMetadata(true);
            const metadata = await getCompleteYoutubeMetadata(videoUrl);

            if (metadata) {
                setTitle(metadata.title || "");
                setDescription(metadata.description || "");
                setThumbnailUrl(metadata.thumbnailUrl || "");
                toast.success("YouTube video details loaded successfully!");
            } else {
                toast.error("Could not fetch video details");
            }
        } catch (error) {
            console.error("Error fetching YouTube metadata:", error);
            toast.error("Failed to load YouTube video details");
        } finally {
            setIsLoadingMetadata(false);
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
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={handleVideoUrlChange}
                                placeholder="Enter YouTube URL..."
                                className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary"
                            />
                            <button
                                type="button"
                                onClick={handleFetchMetadata}
                                disabled={isLoadingMetadata || !videoUrl}
                                className="px-4 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-300 disabled:opacity-50"
                                title="Fetch video details from YouTube"
                            >
                                <FaMagic />
                            </button>
                        </div>
                        {isLoadingMetadata && (
                            <p className="text-sm text-gray-500 mt-1">Loading video details...</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2 ">
                            Cover Image{thumbnailUrl ? ' (YouTube thumbnail available)' : '*'}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="shadow appearance-none border  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-lg"
                        />
                        {thumbnailUrl && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">YouTube thumbnail:</p>
                                <img
                                    src={thumbnailUrl}
                                    alt="YouTube thumbnail"
                                    className="w-full max-h-40 object-cover rounded-lg"
                                />
                            </div>
                        )}
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
