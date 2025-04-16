import React from "react";
import {
    IoArrowUndo,
    IoCalendarOutline,
    IoChatbubble,
    IoHeart,
} from "react-icons/io5";
import { BiSolidUpvote } from "react-icons/bi";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const NOTIFICATION_TYPES = {
    PERSONAL_STORY_LIKED: {
        icon: BiSolidUpvote,
        iconColor: "text-grey-900",
        message: "upvoted your story",
    },
    PERSONAL_STORY_COMMENT: {
        icon: IoChatbubble,
        iconColor: "text-gray-900",
        message: "commented on your story",
    },
    PERSONAL_STORY_REPLY: {
        icon: IoArrowUndo,
        iconColor: "text-blue-500",
        message: "replied to your comment on story",
    },
    PERSONAL_STORY_COMMENT_LIKED: {
        icon: IoHeart,
        iconColor: "text-red-500",
        message: "liked your comment on story",
    },
    PERSONAL_STORY_COMMENT_REPLY_LIKED: {
        icon: IoHeart,
        iconColor: "text-red-500",
        message: "liked your reply on story",
    },
    // New reaction notification types
    REACTION: {
        icon: IoHeart,
        iconColor: "text-red-500",
        message: "reacted to your Story",
    },
    COMMENT_REACTION: {
        icon: IoHeart,
        iconColor: "text-red-500",
        message: "reacted to your comment on story",
    },
    REPLY_REACTION: {
        icon: IoHeart,
        iconColor: "text-red-500",
        message: "reacted to your reply on story",
    },

};

const NotificationItem = ({ item, type }) => {
    const config = NOTIFICATION_TYPES[type];
    const Icon = config.icon;

    const getAvatarUrl = (user) => {
        return (
            user?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "Anonymous")}&background=random`
        );
    };

    return (
        <Link
            to={`/personal-stories/${item._id}`} // Use the computed ID
            className={`px-4 py-2.5 hover:bg-black/5 cursor-pointer flex items-center space-x-3 transition-colors ${!item.seen && "bg-blue-100"}`}
        >
            <div className="flex-shrink-0 relative">
                <Link to={`/about/user/${item.createdBy._id}`}>
                    <img
                        src={getAvatarUrl(item.createdBy)}
                        alt={item.createdBy?.name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </Link>
                <div className="absolute -bottom-2 -right-2 z-10 bg-white/90 p-1 rounded-full">
                    <Icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center space-x-2">
                    <Link to={`/about/user/${item.createdBy._id}`} className="line-clamp-2">
                        <span className="text-sm font-medium text-[var(--ternery)] line-clamp-2 capitalize hover:underline block">
                            {item.createdBy?.name}
                        </span>
                    </Link>
                    <span className="text-[var(--grey--900)] line-clamp-2">
                        {config.message}
                    </span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-[var(--grey--800)]">
                    <IoCalendarOutline className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(item?.createdAt))}</span>
                </div>
            </div>

            {item.postId?.imageUrl && (
                <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                    <img
                        src={item?.postId?.imageUrl}
                        alt="Post thumbnail"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </Link>
    );
};

// Export individual components using the shared NotificationItem component
export const PersonalStoryCommentNotification = ({ item }) => (
    console.log({ item }),
    <NotificationItem item={item} type="PERSONAL_STORY_COMMENT" />
);
export const PersonalStoryLikedNotification = ({ item }) => (
    <NotificationItem item={item} type="PERSONAL_STORY_LIKED" />
);
export const PersonalStoryReplyNotification = ({ item }) => (
    <NotificationItem item={item} type="PERSONAL_STORY_REPLY" />
);
export const PersonalStoryCommentLikedNotification = ({ item }) => (
    <NotificationItem item={item} type="PERSONAL_STORY_COMMENT_LIKED" />
);
export const PersonalStoryCommentReplyLikedNotification = ({ item }) => (
    <NotificationItem item={item} type="PERSONAL_STORY_COMMENT_REPLY_LIKED" />
);

export default NotificationItem;