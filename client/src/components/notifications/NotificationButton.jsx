import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoNotificationsOutline, IoNotifications } from 'react-icons/io5';
import { useNotifications } from '../../context/NotificationContext';
import EnhancedNotificationDropdown from './EnhancedNotificationDropdown';
import './NotificationButton.css';

const NotificationButton = () => {
  const {
    unreadCount,
    showDropdown,
    toggleDropdown
  } = useNotifications();

  // Animation for the notification badge
  const badgeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 15
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  // Animation for the bell shake
  const bellVariants = {
    initial: { rotate: 0 },
    shake: {
      rotate: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.6,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="notification-button-container">
      <motion.button
        className={`notification-button ${showDropdown ? 'active' : ''}`}
        onClick={toggleDropdown}
        variants={bellVariants}
        initial="initial"
        animate={unreadCount > 0 ? "shake" : "initial"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {unreadCount > 0 ? (
          <IoNotifications className=" text-[1.7rem] text-black" />
        ) : (
          <IoNotificationsOutline className=" text-[1.7rem] text-black" />
        )}

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              className="notification-count"
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <EnhancedNotificationDropdown />
    </div>
  );
};

export default NotificationButton;
