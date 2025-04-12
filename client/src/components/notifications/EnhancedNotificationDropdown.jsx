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
import { IoMdClose } from 'react-icons/io';

// Import notification card components (keeping imports same)
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

// Enhanced dropdown animations
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
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// Enhanced notification item animation
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.25,
      ease: "easeOut"
    }
  }),
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: 0.2 }
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
        className="transform transition-all duration-300 hover:scale-[1.01] z-50"
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
                <div className={`p-3 border-b border-slate-100 cursor-pointer transition-all relative hover:bg-slate-50 z-50 ${!notification.seen ? 'bg-blue-50 hover:bg-blue-100' : ''}`}>
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
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>
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
            fixed top-0 left-0 w-full h-full bg-white overflow-y-auto no-scrollbar z-50
            
            /* Mobile First Approach */
            
            /* Tablet & Above Styling */
            md:absolute md:top-12 md:left-auto md:right-0 md:w-80 md:h-auto
            md:max-h-[80vh] md:rounded-xl md:shadow-2xl md:border md:border-slate-200
            
            /* Laptop Styling */
            lg:w-96 lg:max-h-[85vh]
            
            /* Desktop Styling */
            xl:w-[450px] xl:max-h-[90vh]
            
            /* Large Screen/TV Styling */
            2xl:w-[500px] 2xl:max-h-[95vh]
            

          "
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header Section with improved styling */}
          <div className="sticky top-0  flex justify-between items-center p-4 border-b border-slate-200 bg-white shadow-sm z-50">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full">
                  <IoNotifications className="text-[var(--primary)] text-lg" />
                </div>
                <h3 className="text-base font-semibold m-0 text-slate-800">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h3>
              </div>
              <button
                className="flex items-center justify-center w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors duration-200"
                onClick={closeDropdown}
                aria-label="Close notifications"
              >
                <IoMdClose className="text-slate-700 text-lg" />
              </button>
            </div>
          </div>

          {/* Filter Section with improved styling */}
          <div className="sticky top-[65px] z-50 flex p-3 border-b border-slate-100 bg-white shadow-sm">
            <div className="flex gap-2 w-full overflow-x-auto no-scrollbar">
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${filter === 'all'
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${filter === 'unread'
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${filter === 'read'
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                onClick={() => setFilter('read')}
              >
                Read
              </button>
            </div>
          </div>

          {/* Notification Content Section */}
          <div className={`flex-1 overflow-y-auto  p-3 transition-all duration-300 ${isExpanded ? 'max-h-[calc(100vh-200px)]' : ''}`}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8 text-slate-500">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                <p className="text-slate-600 font-medium">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-slate-500 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <IoSad className="text-3xl text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium mb-2">No notifications found</p>
                <p className="text-slate-500 text-sm mb-4">
                  {filter === 'unread' ? 'You have no unread notifications' :
                    filter === 'read' ? 'You have no read notifications' :
                      'Your notification inbox is empty'}
                </p>
                {filter !== 'all' && (
                  <button
                    className="mt-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-600 font-medium cursor-pointer transition-all hover:bg-blue-100"
                    onClick={() => setFilter('all')}
                  >
                    Show all notifications
                  </button>
                )}
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-2">
                  {filteredNotifications.map((notification, index) =>
                    renderNotification(notification, index)
                  )}
                </div>
              </AnimatePresence>
            )}
          </div>

          {/* Footer Section */}
          {notifications.length > 5 && (
            <div className="sticky bottom-0 p-3 border-t border-slate-200 text-center bg-white shadow-inner z-50">
              <button
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-blue-600 font-medium cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show less" : "Show more "}
              </button>
            </div>
          )}

          {/* Notification Detail View */}
          <AnimatePresence>
            {selectedNotification && (
              <motion.div
                className="absolute inset-0 bg-white z-20 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
              >
                {/* Detail View Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-slate-200 bg-white shadow-sm">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 cursor-pointer transition-all"
                    onClick={() => setSelectedNotification(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <h4 className="text-base font-semibold m-0 text-slate-800">Notification Details</h4>
                  <button
                    className="flex items-center justify-center w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors duration-200"
                    onClick={() => setSelectedNotification(null)}
                    aria-label="Close details"
                  >
                    <IoClose className="text-slate-700" />
                  </button>
                </div>

                {/* Detail Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                    {renderNotification(selectedNotification, 0)}
                  </div>

                  {/* Additional Info Card */}
                  <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h5 className="text-sm font-semibold text-slate-700 mb-3">Notification Information</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Received</span>
                        <span className="text-sm font-medium text-slate-700">
                          {new Date(selectedNotification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Status</span>
                        <span className={`text-sm font-medium ${selectedNotification.seen ? 'text-green-600' : 'text-blue-600'}`}>
                          {selectedNotification.seen ? 'Read' : 'Unread'}
                          <span className={`inline-block ml-2 w-2 h-2 rounded-full ${selectedNotification.seen ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Type</span>
                        <span className="text-sm font-medium text-slate-700 px-2 py-1 bg-slate-100 rounded-full">
                          {selectedNotification.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {!selectedNotification.seen && (
                      <button
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm font-medium text-blue-600 cursor-pointer transition-all hover:bg-blue-100"
                        onClick={() => {
                          markAsRead(selectedNotification._id);
                          setSelectedNotification({
                            ...selectedNotification,
                            seen: true
                          });
                        }}
                      >
                        <IoCheckmarkCircle className="text-lg" />
                        Mark as read
                      </button>
                    )}
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-600 cursor-pointer transition-all hover:bg-red-100"
                      onClick={() => {
                        deleteNotification(selectedNotification._id);
                        setSelectedNotification(null);
                      }}
                    >
                      <IoTrash className="text-lg" />
                      Delete notification
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