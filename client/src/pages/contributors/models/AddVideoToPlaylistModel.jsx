import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTimesCircle, FaPlus, FaSearch } from "react-icons/fa";
import customFetch from "../../../utils/customFetch";

const AddVideoToPlaylistModel = ({ setShowModal, playlistId, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user's videos
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setIsLoading(true);
                const { data } = await customFetch.get("/videos/user-videos");
                // Filter out videos that are already in playlists
                const singleVideos = data.videos.filter(video => video.type === "single");
                setVideos(singleVideos);
                setFilteredVideos(singleVideos);
            } catch (error) {
                console.error("Error fetching videos:", error);
                toast.error("Failed to load videos");
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // Filter videos based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredVideos(videos);
        } else {
            const filtered = videos.filter(
                video =>
                    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    video.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredVideos(filtered);
        }
    }, [searchTerm, videos]);

    const handleAddVideo = async () => {
        if (!selectedVideo) {
            toast.error("Please select a video to add");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await customFetch.post("/video-playlists/add-video", {
                playlistId,
                videoId: selectedVideo
            });

            if (response.status === 200) {
                toast.success("Video added to playlist successfully!");
                setShowModal(false);
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error) {
            console.error("Error adding video to playlist:", error);
            toast.error(error.response?.data?.msg || "Error adding video to playlist");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Add Video to Playlist</h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimesCircle className="text-xl" />
                    </button>
                </div>

                <div className="p-4">
                    {/* Search bar */}
                    <div className="mb-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search videos by title or description"
                            className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Video list */}
                    <div className="max-h-60 overflow-y-auto mb-4 border rounded-lg">
                        {isLoading ? (
                            <div className="flex justify-center items-center p-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                            </div>
                        ) : filteredVideos.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No videos found
                            </div>
                        ) : (
                            filteredVideos.map((video) => (
                                <div
                                    key={video._id}
                                    className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-50 ${
                                        selectedVideo === video._id ? "bg-blue-50" : ""
                                    }`}
                                    onClick={() => setSelectedVideo(video._id)}
                                >
                                    <div className="flex-shrink-0 w-16 h-12 mr-3">
                                        <img
                                            src={video.coverImage}
                                            alt={video.title}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800 line-clamp-1">
                                            {video.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-1">
                                            {video.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="btn-red flex items-center justify-center gap-2"
                        >
                            <FaTimesCircle />
                            Cancel
                        </button>
                        <button
                            onClick={handleAddVideo}
                            disabled={isSubmitting || !selectedVideo}
                            className="btn-2"
                        >
                            <FaPlus className="mr-2" />
                            {isSubmitting ? "Adding..." : "Add to Playlist"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddVideoToPlaylistModel;
