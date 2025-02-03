import { Link } from 'react-router-dom';
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { IoCalendarOutline, IoChatbubble, IoHeart } from 'react-icons/io5';
import { FcAnswers } from "react-icons/fc";

const NOTIFICATION_TYPES = {
    QUESTION_ANSWERED: {
        icon: FcAnswers,
        iconColor: 'text-red-500',
        message: 'answered your question'
    },
    ANSWER_COMMENT: {
        icon: IoChatbubble,
        iconColor: 'text-blue-500',
        message: 'commented on your answer'
    },
    ANSWER_LIKED: {
        icon: IoHeart,
        iconColor: 'text-red-500',
        message: 'liked your answer'
    },
    ANSWER_COMMENT_LIKED: {
        icon: IoHeart,
        iconColor: 'text-red-500',
        message: 'liked your comment on answer'
    },
    ANSWER_COMMENT_REPLY_LIKED: {
        icon: IoHeart,
        iconColor: 'text-red-500',
        message: 'liked your reply on answer'
    }
};

const NotificationItem = ({ item, type }) => {
    const config = NOTIFICATION_TYPES[type];
    const Icon = config.icon;

    return (
        <Link to={`/QA-section/question/${item?.questionId}`}
            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors"
        >
            <div className="flex-shrink-0">
                <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                    <img
                        src={item?.createdBy?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.createdBy.name || "Anonymous")}&background=random`}
                        alt={item?.createdBy?.name}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <Link to={`/about/user/${item.createdBy._id}`} className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-blue-600 line-clamp-2 capitalize hover:underline">
                            {item.createdBy?.name} {" "}
                        </span>
                    </Link>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className='text-[var(--grey--900)]'>
                        {config.message}
                    </span>
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

export const QuestionAnsweredNotification = ({ item }) => (
    <NotificationItem item={item} type="QUESTION_ANSWERED" />
);

export const AnswerCommentNotification = ({ item }) => (
    <NotificationItem item={item} type="ANSWER_COMMENT" />
);

export const AnswerLikedNotification = ({ item }) => (
    <NotificationItem item={item} type="ANSWER_LIKED" />
);

export const AnswerCommentLikedNotification = ({ item }) => (
    <NotificationItem item={item} type="ANSWER_COMMENT_LIKED" />
);
export const AnswerReplyLikedNotification = ({ item }) => (
    <NotificationItem item={item} type="ANSWER_REPLY_LIKED" />
);

export const AnswerCommentReplyLikedNotification = ({ item }) => (
    <NotificationItem item={item} type="ANSWER_COMMENT_REPLY_LIKED" />
);