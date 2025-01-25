import { useState, useEffect } from 'react';
import { FaHeart } from "react-icons/fa";
import { useUser } from '@/context/UserContext';
import '../../assets/styles/global.css';

const Like = ({ totalLikes = 0, id, likes = [], onLike, onError, }) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const [likeState, setLikeState] = useState({
        isLiked: Array.isArray(likes) && likes.includes(user?._id),
        count: 0,
    });

    useEffect(() => {
        if (!user) return;
        setLikeState({
            isLiked: Array.isArray(likes) && likes.includes(user._id),
            count: totalLikes
        });
    }, [totalLikes, user]);

    const handleLike = async (e) => {
        e.stopPropagation();

        if (!user) {
            onError?.('Please login to like posts');
            return;
        }
        try {
            setIsLoading(true);
            await onLike();

            setLikeState(prev => ({
                isLiked: !prev.isLiked,
                count: prev.isLiked ? prev.count - 1 : prev.count + 1,
            }));
        } catch (error) {
            console.error('Error liking post:', error);
            onError?.('Failed to like post');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center">
            <span className="text-sm sm:text-base mr-1">{likeState.count}</span>
            <button type="submit" className="bg-transparent border-none cursor-pointer" onClick={handleLike} disabled={isLoading}>
                <FaHeart
                    className={`${likeState.isLiked && 'text-red-700'} cursor-pointer size-3 sm:size-5`}
                />
            </button>
        </div>
    );
};

export default Like;
