import { useState, useEffect } from 'react';
import { BsPersonPlus, BsPersonDash } from 'react-icons/bs';
import { useUser } from '@/context/UserContext';
import '../../assets/styles/global.css';

const Follow = ({ isFollowed = false, userId, followers = [], onFollow, onError }) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const [followState, setFollowState] = useState({
        isFollowing: false,
    });

    useEffect(() => {
        // Check localStorage first
        const storedFollowState = localStorage.getItem(`follow_${userId}`);
        if (storedFollowState) {
            setFollowState({ isFollowing: JSON.parse(storedFollowState) });
            return;
        }

        // Fall back to prop-based state if no localStorage value
        if (!user) return;
        const isFollowing = Array.isArray(followers) && followers.includes(user._id);
        setFollowState({ isFollowing });
        localStorage.setItem(`follow_${userId}`, JSON.stringify(isFollowing));
    }, [user, userId]);

    const handleFollow = async (e) => {
        e.stopPropagation();

        if (!user) {
            onError?.('Please login to follow users');
            return;
        }
        try {
            setIsLoading(true);
            await onFollow();

            const newFollowState = !followState.isFollowing;
            setFollowState({ isFollowing: newFollowState });
            localStorage.setItem(`follow_${userId}`, JSON.stringify(newFollowState));

        } catch (error) {
            console.error('Error following user:', error);
            onError?.('Failed to follow user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleFollow}
                disabled={isLoading}
                className={`action-button cursor-pointer flex items-center gap-1 btn-sm hover:scale-105 transition-all duration-300 ${followState.isFollowing ? 'bg-gray-200' : ''
                    }`}
            >
                {followState.isFollowing ? 'Unfollow' : 'Follow'}
                {isLoading ? (
                    <span className="like-loader"></span>
                ) : (
                    followState.isFollowing ? (
                        <BsPersonDash className="ml-1" />
                    ) : (
                        <BsPersonPlus className="ml-1" />
                    )
                )}
            </button>
        </div>
    );
};

export default Follow;
