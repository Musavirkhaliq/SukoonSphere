import React from "react";
import {
  IoArrowUndo,
  IoCalendarOutline,
  IoChatbubble,
  IoHeart,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const NOTIFICATION_TYPES = {
  POST_LIKE: {
    icon: IoHeart,
    iconColor: "text-red-500",
    message: "Liked your post",
  },
  POST_COMMENT: {
    icon: IoChatbubble,
    iconColor: "text-gray-900",
    message: "commented on your post",
  },
  POST_REPLY: {
    icon: IoArrowUndo,
    iconColor: "text-blue-500",
    message: "replied to your comment",
  },
  COMMENT_LIKE: {
    icon: IoHeart,
    iconColor: "text-red-500",
    message: "liked your comment",
  },
  REPLY_LIKE: {
    icon: IoHeart,
    iconColor: "text-red-500",
    message: "liked your reply",
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
  console.log({item});

  return (
    <Link
      to={`/posts/${item?.postId?._id}`}
      className="px-4 py-2.5 hover:bg-black/5 cursor-pointer flex items-center space-x-3 transition-colors"
    >
      <div className="flex-shrink-0 relative">
        <Link to={`/about/user/${item.createdBy._id}`}>
          <img
            src={getAvatarUrl(item.createdBy)}
            alt={item.createdBy?.name}
            className=" w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div className="absolute  -bottom-2 -right-2 z-10  bg-white/90   p-1 rounded-full ">
          <Icon className={`w-4 h-4 ${config.iconColor}  `} />
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-[var(--grey--900)]">
          <Link to={`/about/user/${item.createdBy._id}`}>
            <span className="text-sm font-medium text-[var(--ternery)] line-clamp-2 capitalize hover:underline block">
              {item.createdBy?.name}{" "}
            </span>
          </Link>
            {config.message}
            </span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[var(--grey--800)]">
          <IoCalendarOutline className="w-3 h-3" />
          <span>{formatDistanceToNow(new Date(item.createdAt))}</span>
        </div>
      </div>

      {item.postId?.imageUrl && (
        <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={item.postId.imageUrl}
            alt="Post thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </Link>
  );
};

// Export individual components using the shared NotificationItem component
export const PostLikeNotification = ({ item }) => (
  <NotificationItem item={item} type="POST_LIKE" />
);

export const PostCommentNotification = ({ item }) => (
  <NotificationItem item={item} type="POST_COMMENT" />
);

export const PostReplyNotification = ({ item }) => (
  <NotificationItem item={item} type="POST_REPLY" />
);

export const PostCommentLikeNotification = ({ item }) => (
  <NotificationItem item={item} type="COMMENT_LIKE" />
);

export const PostReplyLikeNotification = ({ item }) => (
  <NotificationItem item={item} type="REPLY_LIKE" />
);
