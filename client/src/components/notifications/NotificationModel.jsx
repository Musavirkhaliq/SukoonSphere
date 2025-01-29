import React from "react";
import { FaTimes } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";

const NotificationModel = ({ onclose }) => {
  const notifications = [
    {
      id: 1,
      type: "follow",
      user: "Brigid Dawson",
      action: "followed you",
      time: "4 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "like",
      user: "John Dwyer",
      action: "liked your post",
      time: "Yesterday",
      read: false,
    },
    {
      id: 3,
      type: "like",
      user: "Tim Hellman",
      action: "liked your post",
      time: "Tuesday",
      read: true,
    },
    {
      id: 4,
      type: "storage",
      message: "Running low on storage space",
      time: "Monday",
      icon: <MdNotificationsActive className="text-[var(--indigo-600)]" />,
    },
    {
      id: 5,
      type: "comment",
      user: "Shannon Shaw",
      action: "commented on your post",
      time: "4 days ago",
      read: true,
    },
  ];

  return (
    <div className="absolute top-12 right-8 w-80 bg-[var(--white-color)] rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-[var(--primary)] text-[var(--white-color)] px-4 py-3">
        <div className="flex items-center space-x-3">
          <MdNotificationsActive className="text-xl" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <button
          className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
          onClick={onclose}
        >
          <FaTimes className="text-lg" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center p-4 hover:bg-[var(--grey-50)] transition-colors duration-200 ${
              !notification.read ? "bg-[var(--grey-50)]" : ""
            }`}
          >
            {/* Avatar or Icon */}
            <div className="flex-shrink-0">
              {notification.type === "storage" ? (
                <div className="h-10 w-10 rounded-full bg-[var(--indigo-100)] flex items-center justify-center">
                  {notification.icon}
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[var(--grey-700)]">
                    {notification.user?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Notification Content */}
            <div className="ml-3 flex-grow">
              {notification.type === "storage" ? (
                <p className="text-sm font-semibold text-[var(--grey-800)]">
                  {notification.message}
                </p>
              ) : (
                <p className="text-sm text-[var(--grey-800)]">
                  <span className="font-semibold">{notification.user}</span>{" "}
                  {notification.action}
                </p>
              )}
              <p className="text-xs text-[var(--grey-500)] mt-1">
                {notification.time}
              </p>
            </div>

            {/* Unread Indicator */}
            {!notification.read && (
              <div className="w-2 h-2 bg-[var(--green-400)] rounded-full ml-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-[var(--grey-50)] border-t border-[var(--grey-100)]">
        <button className="w-full text-center text-sm text-[var(--teal-500)] hover:text-[var(--teal-600)] font-semibold transition-colors duration-200">
          See all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationModel;
