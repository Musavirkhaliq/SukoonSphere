import React, { useState, useEffect } from "react";
import { FaTimes, FaRegHeart, FaHeart, FaRegComment, FaShare } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import AnswerComments from "./AnswerComments";
import UserAvatar from "../shared/UserAvatar";
import { formatDistanceToNow } from "date-fns";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

const AnswerCommentModal = ({ isOpen, onClose, answerId }) => {
    const { user } = useUser();
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // State for expand/collapse
    const [shouldTruncate, setShouldTruncate] = useState(false); // State to determine if truncation is needed

    const MAX_CHARS = 300; // Character limit for truncation, matching Answer component

    const handleLike = async () => {
        if (!user) {
            toast.error("Please login to like this answer!");
            return;
        }
        try {
            setIsLikeLoading(true);
            await customFetch.patch(`/qa-section/question/answer/${answerId}/like`);
            setIsLiked(!isLiked);
            setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        } catch (error) {
            console.error("Error liking answer:", error);
            toast.error("Failed to like answer");
        } finally {
            setIsLikeLoading(false);
        }
    };

    useEffect(() => {
        const fetchAnswer = async () => {
            if (!answerId) return;

            try {
                setLoading(true);
                const { data } = await customFetch.get(`/qa-section/answer/${answerId}`);
                setAnswer(data.answer);

                // Set initial like state
                if (user && data.answer.likes) {
                    setIsLiked(data.answer.likes.includes(user._id));
                    setLikesCount(data.answer.totalLikes || data.answer.likes.length || 0);
                } else {
                    setLikesCount(data.answer.totalLikes || data.answer.likes?.length || 0);
                }

                // Check if truncation is needed
                if (data.answer.context && data.answer.context.length > MAX_CHARS) {
                    setShouldTruncate(true);
                }
            } catch (error) {
                console.error("Error fetching answer:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchAnswer();
        }
    }, [answerId, isOpen, user]);

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
                                    </div>

                                    {answer.imageUrl && (
                                        <img
                                            src={answer.imageUrl}
                                            alt="Answer"
                                            className="w-full object-cover rounded-lg mb-4 max-h-[300px]"
                                        />
                                    )}

                                    <div className="text-gray-800 mb-4">
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
                                    </div>

                                    {/* Answer Reactions */}
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={handleLike}
                                                disabled={isLikeLoading}
                                                className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-gray-500"
                                                    } hover:text-red-500 transition-colors`}
                                            >
                                                {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                                                <span>{likesCount}</span>
                                            </button>

                                            <div className="flex items-center gap-1 text-gray-500">
                                                <FaRegComment />
                                                <span>{answer.comments?.length || 0}</span>
                                            </div>

                                            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                                                <FaShare />
                                                <span>Share</span>
                                            </button>
                                        </div>

                                        {answer.editedAt && (
                                            <span className="text-xs text-gray-400">
                                                edited{" "}
                                                {formatDistanceToNow(new Date(answer.editedAt), { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>
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