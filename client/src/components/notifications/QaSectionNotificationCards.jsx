import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import {
  IoCalendarOutline,
  IoChatbubble,
  IoHeart,
  IoArrowUndo,
} from "react-icons/io5";
import { RiQuestionAnswerFill } from "react-icons/ri";



const NOTIFICATION_TYPES = {
  QUESTION_ANSWERED: {
    icon: RiQuestionAnswerFill,
    iconColor: "text-grey-900",
    message: "answered your question",
  },
  ANSWER_COMMENT: {
    icon: IoChatbubble,
    iconColor: "text-gray-900",
    message: "commented on your answer",
  },
  ANSWER_LIKED: {
    icon: IoHeart,
    iconColor: "text-red-500",
    message: "liked your answer",
  },
  ANSWER_COMMENT_LIKED: {
    icon: IoHeart,
    iconColor: "text-red-500",
    message: "liked your comment on answer",
  },
  ANSWER_COMMENT_REPLY_LIKED: {
    icon: IoHeart,
    iconColor: "text-red-500",
    message: "liked your reply on answer",
  },
  ANSWER_COMMENT_REPLY: {
    icon: IoArrowUndo,
    iconColor: "text-blue-500",
    message: "replied to your comment on answer",
  },
};

const NotificationItem = ({ item, type, link }) => {
  console.log({time:item.createdAt})
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
      to={link}
      className="px-4 py-2.5 hover:bg-black/5 cursor-pointer flex items-center space-x-3 transition-colors"
    >
      <div className="flex-shrink-0 relative">
      <Link to={`/about/user/${item.createdBy._id}`}>
              <img
                src={getAvatarUrl(item.createdBy)}
                alt={item.createdBy?.name}
                className=" w-10 h-10 rounded-full object-cover"              />
            </Link>
      <div className="absolute  -bottom-2 -right-2 z-10  bg-white/90   p-1 rounded-full ">
          <Icon className={`w-4 h-4 ${config.iconColor}  `} />
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
           
            <Link to={`/about/user/${item.createdBy._id}`}>
              <span className="text-sm font-medium text-[var(--ternery)] line-clamp-2 capitalize hover:underline block">
                {item.createdBy?.name}{" "}
              </span>
            </Link>
            <span className="text-[var(--grey--900)]">{config.message}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[var(--grey--800)] pl-2">
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
  <NotificationItem
    item={item}
    type="QUESTION_ANSWERED"
    link={`/QA-section/question/${item?.questionId}`}
  />
);

export const AnswerCommentNotification = ({ item }) => (
  <NotificationItem
    item={item}
    type="ANSWER_COMMENT"
    link={`/QA-section/question/answer/${item?.answerId}/comments`}
  />
);

export const AnswerLikedNotification = ({ item }) => (
  <NotificationItem
    item={item}
    type="ANSWER_LIKED"
    link={`/QA-section/question/${item?.questionId}`}
  />
);

export const AnswerCommentLikedNotification = ({ item }) => (
  <NotificationItem
    item={item}
    type="ANSWER_COMMENT_LIKED"
    link={`/QA-section/question/${item?.questionId}`}
  />
);
export const AnswerReplyLikedNotification = ({ item }) => (
  <NotificationItem
    item={item}
    type="ANSWER_REPLY_LIKED"
    link={`/QA-section/question/answer/${item?.answerId}/comments/${item?.commentId}/reply`}
  />
);

export const AnswerCommentReplyLikedNotification = ({ item }) => (
  <NotificationItem
    item={item}
    type="ANSWER_COMMENT_REPLY_LIKED"
    link={`/QA-section/question/answer/${item?.answerId}/comments/${item?.commentId}/reply`}
  />
);
export const AnswerReplyNotification = ({ item }) => (
  <NotificationItem
    item={item}
    type="ANSWER_COMMENT_REPLY"
    link={`/QA-section/question/answer/${item?.answerId}/comments/${item?.commentId}/reply`}
  />
);
