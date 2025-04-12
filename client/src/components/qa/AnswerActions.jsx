import React, { useState, useEffect, useRef } from "react";
import { FaRegHeart, FaHeart, FaRegComment, FaShare, FaEllipsisH } from "react-icons/fa";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";

const AnswerActions = ({
    answerId,
    initialLikesCount,
    isInitiallyLiked,
    totalComments,
    onCommentClick,
    handleEdit,
    handleDelete,
    isEditDeleteOnly = false,
    preview = false,
    onLikeUpdate, // Callback to notify parent of like changes
}) => {
    const { user } = useUser();
    const [isLiked, setIsLiked] = useState(isInitiallyLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const shareMenuRef = useRef(null);
    const moreOptionsMenuRef = useRef(null);

    // Handle like
    const handleLike = async () => {
        if (!user) {
            toast.error("Please login to like this answer!");
            return;
        }

        if (isLikeLoading) return;

        try {
            setIsLikeLoading(true);
            const wasLiked = isLiked;

            // Optimistically update UI
            setIsLiked(!wasLiked);
            setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

            // Make API call
            await customFetch.patch(`/qa-section/question/answer/${answerId}/like`);

            // Notify parent of like change
            if (onLikeUpdate) {
                onLikeUpdate(!wasLiked, wasLiked ? likesCount - 1 : likesCount + 1);
            }

            toast.success(wasLiked ? "Answer unliked" : "Answer liked");
        } catch (error) {
            console.error("Error liking answer:", error);
            toast.error("Failed to like answer");
            // No revert, as per original Answer behavior
        } finally {
            setIsLikeLoading(false);
        }
    };

    // Handle share
    const handleShare = async (platform) => {
        const answerUrl = `${window.location.origin}/qa-section/answer/${answerId}`;
        let shareUrl = "";

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(answerUrl)}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(answerUrl)}&text=${encodeURIComponent("Check out this answer!")}`;
                break;
            case "whatsapp":
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this answer: ${answerUrl}`)}`;
                break;
            case "copy":
                try {
                    await navigator.clipboard.writeText(answerUrl);
                    toast.success("Link copied to clipboard!");
                    setShowShareOptions(false);
                    return;
                } catch (err) {
                    toast.error("Failed to copy link");
                    return;
                }
            default:
                return;
        }

        window.open(shareUrl, "_blank", "width=600,height=400");
        setShowShareOptions(false);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareOptions(false);
            }
            if (moreOptionsMenuRef.current && !moreOptionsMenuRef.current.contains(event.target)) {
                setShowMoreOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (isEditDeleteOnly) {
        return (
            <div className="relative" ref={moreOptionsMenuRef}>
                <button
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="More options"
                >
                    <FaEllipsisH className="text-gray-500" />
                </button>

                {showMoreOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                        <div className="p-2">
                            <button
                                onClick={handleEdit}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                            >
                                Edit Answer
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-red-500"
                            >
                                Delete Answer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={`flex items-center justify-between mt-2 pt-2 border-t border-gray-200 ${preview ? "gap-3 text-sm" : "gap-4"
                }`}
        >
            <div className={`flex items-center ${preview ? "gap-3" : "gap-4"}`}>
                {/* Like Button */}
                <button
                    onClick={handleLike}
                    disabled={isLikeLoading}
                    className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-gray-500"
                        } hover:text-red-500 transition-colors relative ${preview ? "text-sm" : ""}`}
                >
                    {isLiked ? (
                        <FaHeart className={`text-red-500 ${preview ? "w-3 h-3" : ""}`} />
                    ) : (
                        <FaRegHeart className={preview ? "w-3 h-3" : ""} />
                    )}
                    <span>{likesCount}</span>
                    {isLikeLoading && (
                        <span className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-30">
                            <div
                                className={`w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin ${preview ? "scale-75" : ""
                                    }`}
                            ></div>
                        </span>
                    )}
                </button>

                {/* Comment Button */}
                <button
                    onClick={onCommentClick}
                    className={`flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors ${preview ? "text-sm" : ""
                        }`}
                >
                    <FaRegComment className={preview ? "w-3 h-3" : ""} />
                    <span>{totalComments || 0}</span>
                </button>

                {/* Share Button */}
                <div className="relative" ref={shareMenuRef}>
                    <button
                        onClick={() => setShowShareOptions(!showShareOptions)}
                        className={`flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors ${preview ? "text-sm" : ""
                            }`}
                    >
                        <FaShare className={preview ? "w-3 h-3" : ""} />
                        <span>Share</span>
                    </button>

                    {/* Share Options Dropdown */}
                    {showShareOptions && (
                        <div
                            className={`absolute left-0 mt-2 ${preview ? "w-40 text-sm" : "w-48"
                                } bg-white rounded-lg shadow-lg z-10 border`}
                        >
                            <div className="p-2">
                                <button
                                    onClick={() => handleShare("facebook")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                                >
                                    <span
                                        className={`w-6 h-6 mr-2 flex items-center justify-center text-blue-600 ${preview ? "scale-75" : ""
                                            }`}
                                    >
                                        <i className="fab fa-facebook-f"></i>
                                    </span>
                                    Facebook
                                </button>

                                <button
                                    onClick={() => handleShare("twitter")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                                >
                                    <span
                                        className={`w-6 h-6 mr-2 flex items-center justify-center text-blue-400 ${preview ? "scale-75" : ""
                                            }`}
                                    >
                                        <i className="fab fa-twitter"></i>
                                    </span>
                                    Twitter
                                </button>

                                <button
                                    onClick={() => handleShare("whatsapp")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                                >
                                    <span
                                        className={`w-6 h-6 mr-2 flex items-center justify-center text-green-500 ${preview ? "scale-75" : ""
                                            }`}
                                    >
                                        <i className="fab fa-whatsapp"></i>
                                    </span>
                                    WhatsApp
                                </button>

                                <button
                                    onClick={() => handleShare("copy")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                                >
                                    <span
                                        className={`w-6 h-6 mr-2 flex items-center justify-center text-gray-600 ${preview ? "scale-75" : ""
                                            }`}
                                    >
                                        <i className="fas fa-link"></i>
                                    </span>
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnswerActions;