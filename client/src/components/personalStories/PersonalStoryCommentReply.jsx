import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { formatDistanceToNow } from "date-fns";
import { FaReply, FaUserSecret } from "react-icons/fa";
import DeleteModal from "../shared/DeleteModal";
import PostActions from "../shared/PostActions";
import UserAvatar from "../shared/UserAvatar";
import { Link } from "react-router-dom";
import ReactionButton from "../shared/Reactions/ReactionButton";

const PersonalStoryCommentReply = ({ reply, commentId, onReplyUpdate }) => {
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(reply.content);
    const [isEditAnonymous, setIsEditAnonymous] = useState(reply.isAnonymous || false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handleSubmitReply = async () => {
        if (!user) {
            toast.error("Please login to reply!");
            return;
        }
        if (!replyContent.trim()) {
            toast.error("Reply cannot be empty!");
            return;
        }
        try {
            await customFetch.post(`/personal-stories/comments/${commentId}/replies`, {
                content: replyContent,
                replyToUserId: reply.createdBy._id || reply.createdBy,
                isAnonymous,
            });
            setReplyContent("");
            setShowReplyForm(false);
            setIsAnonymous(false);
            onReplyUpdate();
            toast.success("Reply added successfully");
        } catch (error) {
            console.error("Error adding reply:", error);
            toast.error(error.response?.data?.msg || "Failed to add reply");
        }
    };

    const handleReactionChange = (reactionCounts, userReaction) => {
        // When reaction changes, update the parent component
        onReplyUpdate();
    };

    const handleEdit = () => {
        const creatorId = reply.isAnonymous ? reply.realCreator : reply.createdBy._id || reply.createdBy;
        if (!user || String(user._id) !== String(creatorId)) {
            toast.error("You can only edit your own replies!");
            return;
        }
        setIsEditing(true);
        setEditContent(reply.content);
        setIsEditAnonymous(reply.isAnonymous || false);
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) {
            toast.error("Reply cannot be empty!");
            return;
        }
        try {
            await customFetch.patch(`/personal-stories/replies/${reply._id}`, {
                content: editContent,
                isAnonymous: isEditAnonymous,
            });
            setIsEditing(false);
            onReplyUpdate();
            toast.success("Reply updated successfully");
        } catch (error) {
            console.error("Error updating reply:", error);
            toast.error(error.response?.data?.msg || "Failed to update reply");
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await customFetch.delete(`/personal-stories/replies/${reply._id}`);
            onReplyUpdate();
            toast.success("Reply deleted successfully");
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting reply:", error);
            toast.error("Failed to delete reply");
        } finally {
            setIsDeleting(false);
        }
    };


    console.log({ reply })

    return (
        <>
            <div className="bg-gray-50 p-3 rounded-lg">
                {/* Reply Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <UserAvatar
                            createdBy={reply.createdBy._id || reply.createdBy}
                            username={reply.createdBy.name || "user"}
                            userAvatar={reply.createdBy.avatar
                            }
                            createdAt={reply.createdAt}
                            size="verySmall"
                        />
                    </div>

                    {/* Debug info */}
                    {console.log("Reply auth check:", {
                        userId: user?._id,
                        replyCreatedBy: reply.createdBy,
                        replyRealCreator: reply.realCreator,
                        isCreator: String(user?._id) === String(reply.createdBy._id || reply.createdBy),
                        isRealCreator: reply.isAnonymous && String(user?._id) === String(reply.realCreator),
                        isAnonymous: reply.isAnonymous,
                    })}

                    {user &&
                        ((String(user._id) === String(reply.createdBy._id || reply.createdBy)) ||
                            (reply.isAnonymous &&
                                reply.realCreator &&
                                String(user._id) === String(reply.realCreator))) && (
                            <PostActions handleEdit={handleEdit} handleDelete={handleDelete} />
                        )}
                </div>

                {/* Reply Content */}
                {isEditing ? (
                    <div className="mt-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent resize-none text-gray-700"
                            rows="2"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isEditAnonymous}
                                    onChange={() => setIsEditAnonymous(!isEditAnonymous)}
                                    className="form-checkbox h-3 w-3 text-[var(--secondary)] rounded focus:ring-[var(--secondary)]"
                                />
                                <span className="text-xs flex items-center gap-1 text-gray-600">
                                    <FaUserSecret
                                        className={isEditAnonymous ? "text-[var(--secondary)]" : "text-gray-400"}
                                        size={12}
                                    />
                                    Post anonymously
                                </span>
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditContent(reply.content);
                                        setIsEditAnonymous(reply.isAnonymous || false);
                                    }}
                                    className="btn-red !py-1 !px-4 text-sm"
                                >
                                    Cancel
                                </button>
                                <button onClick={handleSaveEdit} className="btn-2 !py-1 !px-4 text-sm">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm mt-1">
                        {reply.replyTo && reply.replyTo._id && (
                            <Link
                                to={`/about/user/${reply.replyTo._id}`}
                                className="font-medium text-[var(--ternery)] hover:underline"
                            >
                                @{reply.replyTo.name || reply.replyTo.username || "user"}{" "}
                            </Link>
                        )}
                        {reply.content}
                    </p>
                )}

                {/* Reply Actions */}
                <div className="flex items-center gap-4 mt-2 text-xs">
                    <ReactionButton
                        contentId={reply._id}
                        contentType="personalStoryReply"
                        initialReactions={{ like: reply.likes.length }}
                        initialUserReaction={user && reply.likes.includes(user._id) ? 'like' : null}
                        onReactionChange={handleReactionChange}
                    />
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="flex items-center gap-1 text-gray-500 hover:text-primary"
                    >
                        <FaReply />
                        Reply
                    </button>
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                    <div className="mt-4">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none text-gray-700"
                            rows="2"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={() => setIsAnonymous(!isAnonymous)}
                                    className="form-checkbox h-3 w-3 text-[var(--secondary)] rounded focus:ring-[var(--secondary)]"
                                />
                                <span className="text-xs flex items-center gap-1 text-gray-600">
                                    <FaUserSecret
                                        className={isAnonymous ? "text-[var(--secondary)]" : "text-gray-400"}
                                        size={12}
                                    />
                                    Post anonymously
                                </span>
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyContent("");
                                        setIsAnonymous(false);
                                    }}
                                    className="btn-red !py-1 !px-4"
                                >
                                    Cancel
                                </button>
                                <button onClick={handleSubmitReply} className="btn-2 !py-1 !px-4">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={confirmDelete}
                title="Delete Reply"
                message="Are you sure you want to delete this reply?"
                itemType="reply"
                isLoading={isDeleting}
            />
        </>
    );
};

export default PersonalStoryCommentReply;