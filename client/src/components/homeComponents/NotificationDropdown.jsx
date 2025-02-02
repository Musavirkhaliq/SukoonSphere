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

const Dropdown = ({ user, onClose }) => {
    const [items, setItems] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const fetchItems = async () => {
        try {
            const { data } = await customFetch.get(`/notifications/${user?._id}`);
            setItems(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchItems();
        socket.emit('join', user._id);
        requestAnimationFrame(() => setIsVisible(true));
        socket.on('notification', (item) => {
            setItems((prevItems) => [item, ...prevItems]);
        });
        return () => { socket.off('notification'); };
    }, [user]);

    const getIcon = (type) => {
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

    const handleItemClick = (item) => {
        setIsVisible(false);
        setTimeout(onClose, 300);
        if (item.postId?._id) {
            navigate(`/posts/${item.postId._id}`);
        }
    };

    return (
        <>
            <div className='fixed inset-0 bg-black/40 z-[70] transition-opacity duration-300'></div>
            <div
                className={`fixed top-0 right-0 w-full sm:w-[380px] h-screen bg-white z-[80] 
                    transform transition-transform duration-300 ease-in-out 
                    shadow-xl ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <IoNotifications className="w-5 h-5 text-blue-500" />
                        Updates
                    </h3>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <IoClose className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <IoNotifications className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">No updates</p>
                    </div>
                ) : (
                    <div className="h-[calc(100vh-70px)] custom-scrollbar overflow-y-auto pb-4">
                        <div className="divide-y divide-gray-100">
                            {items.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    onClick={() => handleItemClick(item)}
                                    className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors"
                                >
                                    <div className="flex-shrink-0">{getIcon(item.type)}</div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center space-x-2">
                                            {item.userId?.profileImage ? (
                                                <img
                                                    src={item.userId.profileImage}
                                                    alt={item.userId.name}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <IoPersonCircleOutline className="w-6 h-6 text-gray-400" />
                                            )}
                                            <span className="text-sm font-medium text-blue-600 truncate">
                                                {item.createdBy?.name}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-700 truncate max-w-[250px]">
                                            {item.message}
                                        </p>
                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
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
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dropdown;