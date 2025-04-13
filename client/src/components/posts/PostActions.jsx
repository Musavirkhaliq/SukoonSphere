import React, { useState, useEffect, useRef } from "react";
import { FaRegComment, FaShare, FaEllipsisH } from "react-icons/fa";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";
import ReactionButton from "../shared/Reactions/ReactionButton";

const PostActions = ({
    postId,
    initialLikesCount,
    isInitiallyLiked,
    totalComments,
    onCommentClick,
    handleEdit,
    handleDelete,
    isEditDeleteOnly = false,
}) => {
    const { user } = useUser();
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const shareMenuRef = useRef(null);
    const moreOptionsMenuRef = useRef(null);

    // Handle reaction change
    const handleReactionChange = (reactionCounts, userReaction) => {
        // This function can be used to update parent components if needed
        console.log('Reaction updated:', { reactionCounts, userReaction });
    };

    // Handle share
    const handleShare = async (platform) => {
        const postUrl = `${window.location.origin}/posts/${postId}`;
        let shareUrl = "";

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent("Check out this post!")}`;
                break;
            case "whatsapp":
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this post: ${postUrl}`)}`;
                break;
            case "copy":
                try {
                    await navigator.clipboard.writeText(postUrl);
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
        // Render only edit/delete options
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
                                Edit Post
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-red-500"
                            >
                                Delete Post
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Render like, comment, share actions
    return (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-4">
                {/* Reaction Button */}
                <ReactionButton
                    contentId={postId}
                    contentType="post"
                    initialReactions={{ like: initialLikesCount }}
                    initialUserReaction={isInitiallyLiked ? 'like' : null}
                    onReactionChange={handleReactionChange}
                />

                {/* Comment Button */}
                <button
                    onClick={onCommentClick}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                >
                    <FaRegComment />
                    <span>{totalComments || 0}</span>
                </button>

                {/* Share Button */}
                <div className="relative" ref={shareMenuRef}>
                    <button
                        onClick={() => setShowShareOptions(!showShareOptions)}
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                        <FaShare />
                        <span>Share</span>
                    </button>

                    {/* Share Options Dropdown */}
                    {showShareOptions && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                            <div className="p-2">
                                <button
                                    onClick={() => handleShare("facebook")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                                >
                                    <span className="w-6 h-6 mr-2 flex items-center justify-center text-blue-600">
                                        <i className="fab fa-facebook-f"></i>
                                    </span>
                                    Facebook
                                </button>

                                <button
                                    onClick={() => handleShare("twitter")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                                >
                                    <span className="w-6 h-6 mr-2 flex items-center justify-center text-blue-400">
                                        <i className="fab fa-twitter"></i>
                                    </span>
                                    Twitter
                                </button>

                                <button
                                    onClick={() => handleShare("whatsapp")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                                >
                                    <span className="w-6 h-6 mr-2 flex items-center justify-center text-green-500">
                                        <i className="fab fa-whatsapp"></i>
                                    </span>
                                    WhatsApp
                                </button>

                                <button
                                    onClick={() => handleShare("copy")}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                                >
                                    <span className="w-6 h-6 mr-2 flex items-center justify-center text-gray-600">
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

export default PostActions;