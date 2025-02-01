import React from 'react'
import { IoArrowUndo, IoCalendarOutline, IoChatbubble, IoHeart, IoPersonCircleOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from "date-fns";
export const PostLikeNotification = ({ item }) => {
    return (

        <Link to={`/posts/${item?.postId?._id}`}
            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors"
        >
            <div className="flex-shrink-0"><IoHeart className="w-5 h-5 text-red-500" /></div>
            <div className="flex-1 min-w-0 space-y-1">
                <Link to={`/about/user/${item.createdBy._id}`} className="flex items-center space-x-2">
                    <img
                        src={item?.createdBy?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.createdBy.name || "Anonymous")}&background=random`}
                        alt={item?.createdBy?.name}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-blue-600 truncate capitalize">
                        {item.createdBy?.name} <span className='text-[var(--grey--900)]'>
                            Liked your post
                        </span>
                    </span>
                </Link>

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
        </Link>
    )
}
export const PostCommentNotification = ({ item }) => {
    return (
        <Link to={`/posts/${item?.postId?._id}`}
            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors"
        >
            <div className="flex-shrink-0"><IoChatbubble className="w-5 h-5 text-blue-500" /></div>
            <div className="flex-1 min-w-0 space-y-1">
                <Link to={`/about/user/${item.createdBy._id}`} className="flex items-center space-x-2">
                    <img
                        src={item?.createdBy?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.createdBy.name || "Anonymous")}&background=random`}
                        alt={item?.createdBy?.name}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-blue-600 truncate capitalize">
                        {item.createdBy?.name} <span className='text-[var(--grey--900)]'>
                            commented on your post
                        </span>
                    </span>
                </Link>

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
        </Link>
    )
}
export const PostReplyNotification = ({ item }) => {
    return (
        <Link to={`/posts/${item?.postId?._id}`}
            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors"
        >
            <div className="flex-shrink-0"><IoArrowUndo className="w-5 h-5 text-green-500" /></div>
            <div className="flex-1 min-w-0 space-y-1">
                <Link to={`/about/user/${item.createdBy._id}`} className="flex items-center space-x-2">
                    <img
                        src={item?.createdBy?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.createdBy.name || "Anonymous")}&background=random`}
                        alt={item?.createdBy?.name}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-blue-600 truncate capitalize">
                        {item.createdBy?.name} <span className='text-[var(--grey--900)]'>
                            replied to your comment
                        </span>
                    </span>
                </Link>

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
        </Link>
    )
}
export const PostCommentLikeNotification = ({ item }) => {
    console.log(item)
    return (
        <Link to={`/posts/${item?.postId?._id}`}
            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors"
        >
            <div className="flex-shrink-0"><IoHeart className="w-5 h-5 text-red-500" /></div>
            <div className="flex-1 min-w-0 space-y-1">
                <Link to={`/about/user/${item.createdBy._id}`} className="flex items-center space-x-2">
                    <img
                        src={item?.createdBy?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.createdBy.name || "Anonymous")}&background=random`}
                        alt={item?.createdBy?.name}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-blue-600 truncate capitalize">
                        {item.createdBy?.name} <span className='text-[var(--grey--900)]'>
                            liked your comment
                        </span>
                    </span>
                </Link>

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
        </Link>
    )
}

export const PostReplyLikeNotification = ({ item }) => {
    return (
        <Link to={`/posts/${item?.postId?._id}`}
            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors"
        >
            <div className="flex-shrink-0"><IoHeart className="w-5 h-5 text-red-500" /></div>
            <div className="flex-1 min-w-0 space-y-1">
                <Link to={`/about/user/${item.createdBy._id}`} className="flex items-center space-x-2">
                    <img
                        src={item?.createdBy?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.createdBy.name || "Anonymous")}&background=random`}
                        alt={item?.createdBy?.name}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-blue-600 truncate capitalize">
                        {item.createdBy?.name} <span className='text-[var(--grey--900)]'>
                            liked your reply
                        </span>
                    </span>
                </Link>

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
        </Link>
    )
}

