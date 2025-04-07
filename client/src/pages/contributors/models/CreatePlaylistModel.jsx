import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaVideo, FaTimesCircle, FaList } from "react-icons/fa";
import customFetch from "../../../utils/customFetch";

const CreatePlaylistModel = ({ setShowModal, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");

    const handleFileChange = (e) => {
        setCoverImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        if (!description.trim()) {
            toast.error("Please enter a description");
            return;
        }

        if (!coverImage) {
            toast.error("Please upload a cover image");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            formData.append('coverImage', coverImage);
            
            if (category.trim()) {
                formData.append('category', category.trim());
            }
            
            if (tags.trim()) {
                // Split tags by commas and trim whitespace
                const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
                tagArray.forEach(tag => formData.append('tags', tag));
            }

            const response = await customFetch.post("/video-playlists/create", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                toast.success("Playlist created successfully!");
                setShowModal(false);
                if (onSuccess) {
                    onSuccess(response.data.playlist);
                }
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
            toast.error(error.response?.data?.msg || "Error creating playlist");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Create New Playlist</h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimesCircle className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Title*
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter playlist title"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Description*
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter playlist description"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter category (e.g., Mental Health, Anxiety)"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tags
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Enter tags separated by commas"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Cover Image*
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-lg"
                            required
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
                            <FaList className="mr-2" />
                            {isSubmitting ? "Creating..." : "Create Playlist"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistModel;
