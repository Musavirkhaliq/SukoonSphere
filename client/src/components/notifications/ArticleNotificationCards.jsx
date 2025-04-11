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
  ARTICLE_LIKED: {
    icon: BiSolidUpvote,
    iconColor: "text-grey-900",
    message: "upvoted your article",
  },
  ARTICLE_COMMENT: {
    icon: IoChatbubble,
    iconColor: "text-gray-900",
    message: "commented on your article",
  },
  ARTICLE_REPLY: {
    icon: IoArrowUndo,
    iconColor: "text-blue-500",
    message: "replied to your comment on article",
  },
  ARTICLE_COMMENT_LIKED: {
    icon: IoHeart,
    iconColor: "text-red-500",
    message: "liked your comment on article",
  },
  ARTICLE_COMMENT_REPLY_LIKED: {
    icon: IoHeart,
    iconColor: "text-red-500",
    message: "liked your reply on article",
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

  // Determine the correct article ID
  const getArticleId = () => {
    // Check if postId exists and has an _id
    if (item.articleId?._id) {
      return item.articleId._id.toString(); // Ensure it's a string
    }
    // Fallback to item._id if available
    if (item?._id) {
      return item._id.toString();
    }
    // Default fallback to avoid breaking the URL
    return "default-id";
  };

  return (
    <Link
      to={`/articles/article/${getArticleId()}`} // Use the computed ID
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
export const ArticleLikedNotification = ({ item }) => (
  <NotificationItem item={item} type="ARTICLE_LIKED" />
);
export const ArticleCommentNotification = ({ item }) => (
  <NotificationItem item={item} type="ARTICLE_COMMENT" />
);
export const ArticleReplyNotification = ({ item }) => (
  <NotificationItem item={item} type="ARTICLE_REPLY" />
);
export const ArticleCommentLikedNotification = ({ item }) => (
  <NotificationItem item={item} type="ARTICLE_COMMENT_LIKED" />
);
export const ArticleCommentReplyLikedNotification = ({ item }) => (
  <NotificationItem item={item} type="ARTICLE_COMMENT_REPLY_LIKED" />
);

export default NotificationItem;