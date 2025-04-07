import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { useNotifications } from '../../context/NotificationContext';
import customFetch from '../../utils/customFetch';

// Icons
import {
  IoNotifications,
  IoClose,
  IoCheckmarkDone,
  IoTrash,
  IoCheckmarkCircle,
  IoSad,
  IoRefresh,
  IoEllipsisHorizontal,
  IoChevronDown,
  IoChevronUp,
} from 'react-icons/io5';

// Notification card components
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

// Dropdown animations
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

// Notification item animation
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
    fetchNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    closeDropdown
  } = useNotifications();

  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dropdownRef = useRef(null);

  // Filter notifications based on the selected filter
  const filteredNotifications = Array.isArray(notifications) ? notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.seen;
    if (filter === 'read') return notification.seen;
    return true;
  }) : [];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, closeDropdown]);

  // Handle marking a notification as read when clicked
  const handleNotificationClick = (notification) => {
    if (!notification.seen) {
      markAsRead(notification._id);
    }
  };

  // Handle notification actions
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

  // Render notification based on type
  const renderNotification = (notification, index) => {
    const notificationProps = {
      item: notification,
      onClick: () => handleNotificationClick(notification),
      onAction: (action) => handleAction(event, action, notification),
      isNew: !notification.seen
    };

    // Use motion.div to animate each notification
    return (
      <motion.div
        key={notification._id}
        custom={index}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
      >
        {(() => {
          switch (notification.type) {
            // Post related Notification cases
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

            // Question/Answer related Notification cases
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

            // Article related Notification cases
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

            // User related Notification cases
            case "follow":
              return <FollowNotification {...notificationProps} />;
            case "requestChat":
              return <RequestChatNotification {...notificationProps} />;

            // Default case
            default:
              return (
                <div className={`notification-item ${!notification.seen ? 'unread' : ''}`}>
                  <div className="notification-content">
                    <div className="notification-icon">
                      <IoNotifications />
                    </div>
                    <div className="notification-text">
                      {notification.message}
                    </div>
                  </div>
                  <div className="notification-time">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
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
          className="notification-dropdown"
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="notification-header">
            <div className="notification-title">
              <IoNotifications className="notification-icon" />
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>

            <div className="notification-actions">
              {unreadCount > 0 && (
                <button
                  className="action-button"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <IoCheckmarkDone />
                </button>
              )}

              <button
                className="action-button"
                onClick={fetchNotifications}
                title="Refresh notifications"
              >
                <IoRefresh />
              </button>

              <button
                className="action-button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
              </button>

              <button
                className="action-button close-button"
                onClick={closeDropdown}
                title="Close"
              >
                <IoClose />
              </button>
            </div>
          </div>

          <div className="notification-filters">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-button ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`filter-button ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read
            </button>
          </div>

          <div className={`notification-list ${isExpanded ? 'expanded' : ''}`}>
            {isLoading ? (
              <div className="notification-loading">
                <div className="loading-spinner"></div>
                <p>Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="notification-empty">
                <IoSad className="empty-icon" />
                <p>No notifications found</p>
                {filter !== 'all' && (
                  <button
                    className="empty-action"
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
            <div className="notification-footer">
              <button
                className="view-all-button"
                onClick={() => {
                  // Navigate to notifications page or expand the dropdown
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            </div>
          )}

          {/* Notification detail view */}
          <AnimatePresence>
            {selectedNotification && (
              <motion.div
                className="notification-detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="detail-header">
                  <button
                    className="back-button"
                    onClick={() => setSelectedNotification(null)}
                  >
                    Back
                  </button>
                  <h4>Notification Details</h4>
                  <button
                    className="close-button"
                    onClick={() => setSelectedNotification(null)}
                  >
                    <IoClose />
                  </button>
                </div>

                <div className="detail-content">
                  {renderNotification(selectedNotification, 0)}

                  <div className="detail-info">
                    <div className="detail-item">
                      <span className="detail-label">Received:</span>
                      <span className="detail-value">
                        {new Date(selectedNotification.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">
                        {selectedNotification.seen ? 'Read' : 'Unread'}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">
                        {selectedNotification.type}
                      </span>
                    </div>
                  </div>

                  <div className="detail-actions">
                    {!selectedNotification.seen && (
                      <button
                        className="detail-button"
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
                      className="detail-button delete-button"
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
