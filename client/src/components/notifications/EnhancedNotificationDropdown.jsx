import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../context/NotificationContext';

// Icons
import {
  IoNotifications,
  IoClose,
  IoTrash,
  IoCheckmarkCircle,
  IoSad,
} from 'react-icons/io5';

// Notification card components (keeping imports same)
import {
  PostLikeNotification,
  PostReplyLikeNotification,
  PostCommentLikeNotification,
  PostCommentNotification,
  PostReplyNotification,
} from './PostNotificationCards';

import {
  QuestionAnsweredNotification,
  AnswerLikedNotification,
  AnswerCommentLikedNotification,
  AnswerCommentNotification,
  AnswerReplyLikedNotification,
  AnswerCommentReplyLikedNotification,
  AnswerReplyNotification,
} from './QaSectionNotificationCards';

import {
  ArticleCommentLikedNotification,
  ArticleCommentNotification,
  ArticleCommentReplyLikedNotification,
  ArticleLikedNotification,
  ArticleReplyNotification,
} from './ArticleNotificationCards';

import { FollowNotification } from './UserNotificationCards';
import { RequestChatNotification } from './RequestChatNotification';
import { IoMdClose } from 'react-icons/io';

// Dropdown animations (keeping same)
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transformOrigin: 'top right'
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  }
};

// Notification item animation (keeping same)
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2
    }
  }),
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: 0.1 }
  }
};

const EnhancedNotificationDropdown = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    showDropdown,
    markAsRead,
    deleteNotification,
    closeDropdown
  } = useNotifications();

  const [filter, setFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dropdownRef = useRef(null);

  const filteredNotifications = Array.isArray(notifications) ? notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.seen;
    if (filter === 'read') return notification.seen;
    return true;
  }) : [];

  const handleNotificationClick = (notification) => {
    if (!notification.seen) {
      markAsRead(notification._id);
    }
  };

  const handleAction = (e, action, notification) => {
    e.stopPropagation();
    e.preventDefault();

    switch (action) {
      case 'delete':
        deleteNotification(notification._id);
        break;
      case 'markAsRead':
        markAsRead(notification._id);
        break;
      case 'viewDetails':
        setSelectedNotification(notification);
        break;
      default:
        break;
    }
  };

  const renderNotification = (notification, index) => {
    const notificationProps = {
      item: notification,
      onClick: () => handleNotificationClick(notification),
      onAction: (action) => handleAction(event, action, notification),
      isNew: !notification.seen
    };

    return (
      <motion.div
        key={notification._id}
        custom={index}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        onClick={closeDropdown}
      >
        {(() => {
          switch (notification.type) {
            case "like":
              return <PostLikeNotification {...notificationProps} />;
            case "comment":
              return <PostCommentNotification {...notificationProps} />;
            case "reply":
              return <PostReplyNotification {...notificationProps} />;
            case "commentLiked":
              return <PostCommentLikeNotification {...notificationProps} />;
            case "replyLiked":
              return <PostReplyLikeNotification {...notificationProps} />;
            case "answered":
              return <QuestionAnsweredNotification {...notificationProps} />;
            case "answerLiked":
              return <AnswerLikedNotification {...notificationProps} />;
            case "answerComment":
              return <AnswerCommentNotification {...notificationProps} />;
            case "answerReply":
              return <AnswerReplyNotification {...notificationProps} />;
            case "answerCommentLiked":
              return <AnswerCommentLikedNotification {...notificationProps} />;
            case "answerReplyLiked":
              return <AnswerReplyLikedNotification {...notificationProps} />;
            case "answerCommentReplyLiked":
              return <AnswerCommentReplyLikedNotification {...notificationProps} />;
            case "articleLiked":
              return <ArticleLikedNotification {...notificationProps} />;
            case "articleComment":
              return <ArticleCommentNotification {...notificationProps} />;
            case "articleReply":
              return <ArticleReplyNotification {...notificationProps} />;
            case "articleCommentLiked":
              return <ArticleCommentLikedNotification {...notificationProps} />;
            case "articleCommentReplyLiked":
              return <ArticleCommentReplyLikedNotification {...notificationProps} />;
            case "follow":
              return <FollowNotification {...notificationProps} />;
            case "requestChat":
              return <RequestChatNotification {...notificationProps} />;
            default:
              return (
                <div className={`p-3 border-b border-slate-50 cursor-pointer transition-all relative hover:bg-slate-50 ${!notification.seen ? 'bg-blue-50 hover:bg-blue-100' : ''}`}>
                  <div className="flex gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg text-slate-500">
                      <IoNotifications />
                    </div>
                    <div className="text-sm text-slate-700 leading-6 flex-1">
                      {notification.message}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
                  {!notification.seen && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 rounded-r"></div>
                  )}
                </div>
              );
          }
        })()}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {showDropdown && (
        <motion.div
          ref={dropdownRef}
          className="
          fixed top-0 left-0 w-full h-full bg-white z-[1000] overflow-y-auto 
          md:absolute md:top-[45px] md:left-auto md:right-0 md:w-[380px] md:h-[80vh] md:rounded-xl md:shadow-2xl 
          lg:w-[420px] lg:max-h-[85vh] 
          xl:w-[450px] xl:max-h-[90vh]
          no-scrollbar
        "
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <IoNotifications className="mr-2 text-xl md:text-2xl" />
                <h3 className="text-base md:text-xl font-semibold m-0 text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="flex items-center justify-center min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button className="bg-transparent border-none p-0 cursor-pointer" onClick={closeDropdown}>
                <IoMdClose className="text-black text-2xl" />
              </button>
            </div>
          </div>

          <div className="flex p-2 border-b border-slate-100 bg-white">
            <button
              className={`px-3 !py-[6px] border-none rounded-[6px] text-sm text-slate-500 cursor-pointer transition-all ${filter === 'all' ? 'bg-[var(--primary)] text-white font-medium' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-[6px]  border-none rounded-[6px] text-sm text-slate-500 cursor-pointer transition-all ${filter === 'unread' ? 'bg-[var(--primary)] text-white font-medium' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`px-3 py-[6px]  border-none rounded-[6px] text-sm text-slate-500 cursor-pointer transition-all ${filter === 'read' ? 'bg-[var(--primary)] text-white font-medium' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read
            </button>
          </div>

          <div className={`flex-1 overflow-y-auto max-h-[400px] p-2 transition-all ${isExpanded ? 'max-h-[600px]' : ''}`}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8 text-slate-500">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                <p>Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-slate-500 text-center">
                <IoSad className="text-4xl text-slate-400 mb-3" />
                <p>No notifications found</p>
                {filter !== 'all' && (
                  <button
                    className="mt-3 px-3 py-1.5 bg-slate-100 border-none rounded-full text-sm text-blue-500 cursor-pointer transition-all hover:bg-blue-50"
                    onClick={() => setFilter('all')}
                  >
                    Show all notifications
                  </button>
                )}
              </div>
            ) : (
              <AnimatePresence>
                {filteredNotifications.map((notification, index) =>
                  renderNotification(notification, index)
                )}
              </AnimatePresence>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-100 text-center">
              <button
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm text-blue-500 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            </div>
          )}

          <AnimatePresence>
            {selectedNotification && (
              <motion.div
                className="absolute inset-0 bg-white z-10 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                  <button
                    className="px-3 py-1.5 bg-transparent border-none text-sm text-blue-500 cursor-pointer transition-all hover:underline"
                    onClick={() => setSelectedNotification(null)}
                  >
                    Back
                  </button>
                  <h4 className="text-base font-semibold m-0 text-slate-800">Notification Details</h4>
                  <button
                    className="bg-transparent border-none cursor-pointer"
                    onClick={() => setSelectedNotification(null)}
                  >
                    <IoClose />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {renderNotification(selectedNotification, 0)}

                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500 font-medium">Received:</span>
                      <span className="text-sm text-slate-700">
                        {new Date(selectedNotification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500 font-medium">Status:</span>
                      <span className="text-sm text-slate-700">
                        {selectedNotification.seen ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 font-medium">Type:</span>
                      <span className="text-sm text-slate-700">
                        {selectedNotification.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {!selectedNotification.seen && (
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-blue-500 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200"
                        onClick={() => {
                          markAsRead(selectedNotification._id);
                          setSelectedNotification({
                            ...selectedNotification,
                            seen: true
                          });
                        }}
                      >
                        <IoCheckmarkCircle />
                        Mark as read
                      </button>
                    )}
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-red-500 cursor-pointer transition-all hover:bg-red-50 hover:border-red-200"
                      onClick={() => {
                        deleteNotification(selectedNotification._id);
                        setSelectedNotification(null);
                      }}
                    >
                      <IoTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedNotificationDropdown;