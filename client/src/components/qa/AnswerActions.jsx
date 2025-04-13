import React, { useState, useEffect, useRef } from "react";
import { FaRegComment, FaShare, FaEllipsisH } from "react-icons/fa";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";
import ReactionButton from "../shared/Reactions/ReactionButton";

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
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const shareMenuRef = useRef(null);
    const moreOptionsMenuRef = useRef(null);

    // Handle reaction change
    const handleReactionChange = (reactionCounts, userReaction) => {
        // Don't update parent state here as ReactionSelector already updates the UI optimistically
        // This prevents the double-counting issue
        console.log('Answer reaction updated:', { reactionCounts, userReaction });

        // If we need to notify parent for other reasons (not for UI updates), we can do it here
        // but we should not pass the reaction counts for UI updates
        if (onLikeUpdate) {
            onLikeUpdate(!!userReaction, null);
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
                {/* Reaction Button */}
                <ReactionButton
                    contentId={answerId}
                    contentType="answer"
                    initialReactions={{ like: initialLikesCount }}
                    initialUserReaction={isInitiallyLiked ? 'like' : null}
                    onReactionChange={handleReactionChange}
                    className={preview ? "scale-90" : ""}
                />

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