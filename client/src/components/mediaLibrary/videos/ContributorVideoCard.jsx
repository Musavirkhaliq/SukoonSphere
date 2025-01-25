import DeleteModal from "@/components/shared/DeleteModal";
import PostActions from "@/components/shared/PostActions";
import EditVideoModel from "@/pages/contributors/models/EditVideoModel";
import customFetch from "@/utils/customFetch";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ContributorVideoCard = ({ video, refetchVideos }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
            try {
                await customFetch.delete(`/videos/delete-video/${video._id}`);
                toast.success("Video deleted successfully");
                refetchVideos();
            } catch (error) {
                console.error("Error deleting video:", error);
                toast.error(error.response?.data?.msg || "Error deleting video");
            }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                    <img
                        src={video.coverImage}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-2 bg-gray-200 rounded-full p-2">
                    <PostActions
                        handleEdit={() => setShowEditModal(true)}
                        handleDelete={ () => setShowDeleteModal(true)}
                      />
                     
                    </div>
                </div>
                <div className="p-4">
                    <Link
                    to={`/all-videos/video/${video._id}`}
                    >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-[var(--ternery)]">{video.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">
                        Created: {formatDate(video.createdAt)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {video?.tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-sm text-gray-600 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            {showEditModal && (
                <EditVideoModel
                    video={video}
                    setShowModal={setShowEditModal}
                    refetchVideos={refetchVideos}
                />
            )}
            {showDeleteModal && (
             <DeleteModal
             isOpen={showDeleteModal}
             onClose={() => setShowDeleteModal(false)}
             onDelete={handleDelete}
             title="Delete Video"
             message="Are you sure you want to delete this video?"
           />
            )}
        </>
    );
};

export default ContributorVideoCard;