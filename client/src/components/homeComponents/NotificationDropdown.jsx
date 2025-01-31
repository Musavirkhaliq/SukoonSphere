import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoNotifications,
    IoClose,
    IoHeart,
    IoChatbubble,
    IoArrowUndo,
    IoCalendarOutline,
    IoPersonCircleOutline
} from 'react-icons/io5';
import customFetch from '@/utils/customFetch';
import socket from '@/utils/socket/socket';
import { formatDistanceToNow } from "date-fns";



const NotificationDropdown = ({ user, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const { data } = await customFetch.get(`/notifications/${user?._id}`);
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        socket.emit('join', user._id);

        // Trigger animation after mount
        requestAnimationFrame(() => {
            setIsVisible(true);
        });

        socket.on('notification', (notification) => {
            setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        });

        return () => {
            socket.off('notification');
        };
    }, [user]);

    const handleClose = () => {
        setIsVisible(false);
        // Wait for animation to complete before calling onClose
        setTimeout(onClose, 300);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return <IoHeart className="w-5 h-5 text-red-500" />;
            case 'comment':
                return <IoChatbubble className="w-5 h-5 text-blue-500" />;
            case 'reply':
                return <IoArrowUndo className="w-5 h-5 text-green-500" />;
            default:
                return <IoNotifications className="w-5 h-5 text-gray-500" />;
        }
    };

    const handleNotificationClick = (notification) => {
        handleClose();
        if (notification.postId?._id) {
            navigate(`/posts/${notification.postId._id}`);
        }
    };

    const handleProfileClick = (e, userId) => {
        e.stopPropagation();
        handleClose();
        navigate(`/about/user/${userId}`);
    };
    return (
        <>
            <div className='fixed inset-0 bg-black/40 z-[70] transition-opacity duration-300 custom-scrollbar'></div>
            <div
                className={`fixed top-0 right-0 w-full sm:w-[450px] h-screen bg-white z-[80] transform transition-transform duration-300 ease-in-out custom-scrollbar ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    }`}
            >
                <div className="flex items-center justify-between px-4 py-3 bg-[var(--white-color)] border-b border-[var(--grey--500)]">
                    <h3 className="font-semibold text-[var(--grey--900)] flex items-center gap-2">
                        <IoNotifications className="w-5 h-5" />
                        Notifications
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full transition-colors duration-200"
                    >
                        <IoClose className="w-5 h-5 text-gray-500 hover:text-[var(--primary-foreground)]" />
                    </button>
                </div>

                {notifications.length === 0
                    ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                            <IoNotifications className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    )
                    : (
                        <div className="overflow-y-auto">
                            {notifications.map((notification, index) => (
                                <div
                                    key={notification._id || index}
                                    onClick={() => handleNotificationClick(notification)}
                                    className="flex items-start gap-3 p-4 hover:bg-[var(--grey--200)] transition-colors duration-200 border-b border-gray-100 cursor-pointer group"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {/* User Avatar Sectio */}
                                        <div className="flex items-center gap-2 mb-1">
                                            {notification.userId?.profileImage
                                                ? (
                                                    <img
                                                        src={notification.userId.profileImage}
                                                        alt={notification.userId.name}
                                                        className="w-6 h-6 rounded-full object-cover cursor-pointer hover:ring-2 ring-blue-400"
                                                        onClick={(e) => handleProfileClick(e, notification.userId._id)}
                                                    />
                                                )
                                                : (
                                                    <IoPersonCircleOutline
                                                        className="w-6 h-6 text-gray-400 cursor-pointer hover:text-blue-500"
                                                        onClick={(e) => handleProfileClick(e, notification.userId._id)}
                                                    />
                                                )}
                                            <span
                                                className="font-medium text-sm text-blue-600 hover:underline cursor-pointer"
                                                onClick={(e) => handleProfileClick(e, notification.userId._id)}
                                            >
                                                {notification.userId?.name}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-900">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {notification.postId?.imageUrl && (
                                                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 group-hover:ring-2 ring-blue-400 transition-all duration-200">
                                                    <img
                                                        src={notification.postId.imageUrl}
                                                        alt="Post thumbnail"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    {notification.type === 'comment' || notification.type === 'reply' && (
                                                        <div className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-tl-md">
                                                            <IoChatbubble className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                    {notification.type === 'like' && (
                                                        <div className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-tl-md">
                                                            <IoHeart className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <IoCalendarOutline className="w-3 h-3 mr-1" />
                                                    {formatDistanceToNow(new Date(notification.createdAt))}
                                                </div>
                                                {notification.type === 'comment' || notification.type === 'reply' ? (
                                                    <span className="text-xs text-gray-500 italic">
                                                        Click to view the conversation
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </>
    );
};

export default NotificationDropdown;