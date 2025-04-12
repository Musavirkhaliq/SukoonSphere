import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import AnswerComments from "./AnswerComments";
import UserAvatar from "../shared/UserAvatar";
import { formatDistanceToNow } from "date-fns";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import AnswerActions from "./AnswerActions";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const AnswerCommentModal = ({ isOpen, onClose, answerId }) => {
    const { user } = useUser();
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContext, setEditedContext] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldTruncate, setShouldTruncate] = useState(false);

    const MAX_CHARS = 300;

    const fetchAnswer = async () => {
        if (!answerId) return;

        try {
            setLoading(true);
            const { data } = await customFetch.get(`/qa-section/answer/${answerId}`);
            setAnswer(data.answer);
            setEditedContext(data.answer.context);

            // Check if truncation is needed
            if (data.answer.context && data.answer.context.length > MAX_CHARS) {
                setShouldTruncate(true);
            }
        } catch (error) {
            console.error("Error fetching answer:", error);
            toast.error("Failed to load answer");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchAnswer();
        }
    }, [answerId, isOpen]);

    const handleLikeUpdate = (newIsLiked, newLikesCount) => {
        setAnswer((prev) => ({
            ...prev,
            likes: newIsLiked
                ? [...(prev.likes || []), user?.id]
                : (prev.likes || []).filter((id) => id !== user?.id),
            totalLikes: newLikesCount,
        }));
        // Refetch to ensure server sync
        fetchAnswer();
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContext(answer.context);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContext(answer.context);
    };

    const handleSaveEdit = async () => {
        if (!editedContext.trim()) {
            toast.error("Answer cannot be empty");
            return;
        }

        try {
            const response = await customFetch.patch(`/qa-section/answer/${answer._id}`, {
                context: editedContext,
            });
            setAnswer(response.data.answer);
            setIsEditing(false);
            toast.success("Answer updated successfully");
            fetchAnswer(); // Refresh data
        } catch (error) {
            console.error("Error updating answer:", error);
            toast.error(error.response?.data?.msg || "Failed to update answer");
        }
    };

    const handleDelete = async () => {
        try {
            await customFetch.delete(`/qa-section/question/answer/${answer._id}`);
            toast.success("Answer deleted successfully");
            onClose(); // Close modal after deletion
        } catch (error) {
            console.error("Error deleting answer:", error);
            toast.error("Failed to delete answer");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/70 z-[90] transition-opacity duration-300 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 animate-modalFadeIn">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-white z-10 rounded-t-xl">
                        <h2 className="text-xl font-bold text-gray-900">Answer & Comments</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close comments"
                        >
                            <FaTimes className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex justify-center items-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {/* Fixed Answer Content */}
                            {answer && (
                                <div className="p-4 border-b bg-gray-50">
                                    <div className="flex items-start justify-between mb-4">
                                        <UserAvatar
                                            username={answer.author.username}
                                            userAvatar={answer.author.userAvatar}
                                            createdBy={answer.createdBy}
                                            createdAt={answer.createdAt}
                                            size="medium"
                                        />
                                        {user?.id && String(user.id) === String(answer.createdBy) && (
                                            <AnswerActions
                                                answerId={answer._id}
                                                handleEdit={handleEdit}
                                                handleDelete={handleDelete}
                                                isEditDeleteOnly={true}
                                            />
                                        )}
                                    </div>

                                    {answer.imageUrl && (
                                        <img
                                            src={answer.imageUrl}
                                            alt="Answer"
                                            className="w-full object-cover rounded-lg mb-4 max-h-[300px]"
                                        />
                                    )}

                                    <div className="text-gray-800 mb-4">
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={editedContext}
                                                    onChange={(e) => setEditedContext(e.target.value)}
                                                    placeholder="Edit your answer..."
                                                    className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 min-h-[100px] resize-none"
                                                />
                                                <div className="flex justify-end gap-3 pt-3 border-t">
                                                    <button onClick={handleCancelEdit} className="btn-red">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        disabled={!editedContext.trim()}
                                                        className="btn-2"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-base leading-relaxed">
                                                    {shouldTruncate && !isExpanded
                                                        ? `${answer.context.substring(0, MAX_CHARS)}...`
                                                        : answer.context}
                                                </p>

                                                {shouldTruncate && (
                                                    <button
                                                        onClick={() => setIsExpanded(!isExpanded)}
                                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors mt-1"
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <FiChevronUp className="w-4 h-4" />
                                                                Show less
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiChevronDown className="w-4 h-4" />
                                                                Read more
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {!isEditing && (
                                        <AnswerActions
                                            answerId={answerId}
                                            initialLikesCount={answer?.totalLikes || 0}
                                            isInitiallyLiked={answer?.likes?.includes(user?._id)}
                                            totalComments={answer?.comments?.length || 0}
                                            onCommentClick={() => { }}
                                            onLikeUpdate={handleLikeUpdate}
                                        />
                                    )}

                                    {answer.editedAt && !isEditing && (
                                        <div className="text-xs text-gray-400 text-right mt-2">
                                            edited{" "}
                                            {formatDistanceToNow(new Date(answer.editedAt), {
                                                addSuffix: true,
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Scrollable Comments Section */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-white">
                                <AnswerComments answerId={answerId} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default AnswerCommentModal;