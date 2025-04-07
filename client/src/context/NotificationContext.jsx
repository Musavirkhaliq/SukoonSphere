import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import socket from '../utils/socket/socket';
import customFetch from '../utils/customFetch';
import { useUser } from './UserContext';

// Create the context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Initialize notifications as an empty array
  useEffect(() => {
    if (!notifications) {
      setNotifications([]);
    }
  }, [notifications]);

  // Fetch notifications from the server
  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;

    try {
      setIsLoading(true);
      const { data } = await customFetch.get(`/notifications/${user._id}`);

      // Ensure data is an array
      const notificationsArray = Array.isArray(data) ? data : [];
      setNotifications(notificationsArray);

      // Calculate unread count
      const unreadNotifications = notificationsArray.filter(notification => !notification.seen);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Set empty array on error
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch unread count only
  const fetchUnreadCount = useCallback(async () => {
    if (!user?._id) return;

    try {
      const { data } = await customFetch.get(`/notifications/total/${user._id}`);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  }, [user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?._id) return;

    try {
      await customFetch.patch('/notifications/mark-as-seen');

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, seen: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }, [user]);

  // Mark a single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!user?._id) return;

    try {
      await customFetch.patch(`/notifications/${notificationId}/mark-as-seen`);

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, seen: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [user]);

  // Delete a notification
  const deleteNotification = useCallback(async (notificationId) => {
    if (!user?._id) return;

    try {
      await customFetch.delete(`/notifications/${notificationId}`);

      // Update local state
      setNotifications(prev =>
        prev.filter(notification => notification._id !== notificationId)
      );

      // Update unread count if needed
      const deletedNotification = notifications.find(n => n._id === notificationId);
      if (deletedNotification && !deletedNotification.seen) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  }, [user, notifications]);

  // Toggle notification dropdown
  const toggleDropdown = useCallback(() => {
    setShowDropdown(prev => !prev);

    // If opening the dropdown, mark notifications as read
    if (!showDropdown) {
      markAllAsRead();
    }
  }, [showDropdown, markAllAsRead]);

  // Close notification dropdown
  const closeDropdown = useCallback(() => {
    setShowDropdown(false);
  }, []);

  // Handle new notification
  const handleNewNotification = useCallback((notification) => {
    // Add the new notification to the list
    setNotifications(prev => [notification, ...prev]);

    // Increment unread count
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    const message = notification.message || 'You have a new notification';
    toast.info(message, {
      onClick: () => {
        // Mark as read and navigate to the relevant page if clicked
        markAsRead(notification._id);
        // Navigation logic would depend on notification type
      }
    });
  }, [markAsRead]);

  // Set up socket connection and event listeners
  useEffect(() => {
    if (!user?._id) return;

    // Join user's room
    socket.emit('join', user._id);

    // Listen for new notifications
    socket.on('notification', handleNewNotification);
    socket.on('newNotification', () => {
      // Legacy event name
      setUnreadCount(prev => prev + 1);
    });

    // Listen for notification count updates
    socket.on('notificationCount', (count) => {
      setUnreadCount(count);
    });

    // Clean up listeners on unmount
    return () => {
      socket.off('notification');
      socket.off('newNotification');
      socket.off('notificationCount');
    };
  }, [user, handleNewNotification]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    } else {
      // Reset state when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  // Provide the context value
  const value = {
    notifications,
    unreadCount,
    isLoading,
    showDropdown,
    fetchNotifications,
    fetchUnreadCount,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    toggleDropdown,
    closeDropdown
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
