// src/components/homeComponents/HeaderComponents/NotificationDropdown.jsx
import customFetch from '@/utils/customFetch';
import socket from '@/utils/socket/socket'; // Import the shared socket instance
import React, { useEffect, useState } from 'react';

const NotificationDropdown = ({ user, onClose }) => {
    const [notifications, setNotifications] = useState([]);
console.log({notifications})  
    const fetchNotifications = async () => {
        try {
            const { data } = await customFetch.get(`/notifications/${user?._id}`);
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

   // In your NotificationDropdown.jsx
useEffect(() => {
    fetchNotifications();

    // Join the user's room
    socket.emit('join', user._id); // Emit join event with user ID

    // Listen for real-time notifications
    socket.on('notification', (notification) => {
        console.log({"socket": notification}); // Log the notification received
        setNotifications((prevNotifications) => [notification,...prevNotifications]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
        socket.off('notification'); // Remove the listener
    };
}, [user]);

    return (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
            <button onClick={onClose} className="text-right px-4 py-2 text-gray-500 hover:text-gray-800">Close</button>
            {notifications.length === 0 ? (
                <p className="px-4 py-2 text-gray-600">No notifications available.</p>
            ) : (
                <ul className="max-h-48 overflow-y-auto">
                    {notifications.map((notification, index) => {
                        if (notification.type === "like") {
                            return (
                                <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <div>{notification.message}</div>
                                </li>
                            );
                        }
                        if (notification.type === "comment") {
                            return (
                                <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <div>{notification.message}</div>
                                </li>
                            );
                        }
                        if (notification.type === "reply") {
                            return (
                                <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <div>{notification.message}</div>
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            )}
        </div>
    );
};

export default NotificationDropdown;