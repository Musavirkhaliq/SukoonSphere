import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaFire, FaChevronRight } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';
import VideoTracker from '@/utils/videoTracker';
import VideoBadgePopup from './VideoBadgePopup';

const VideoAchievements = () => {
  const { user } = useUser();
  const [achievements, setAchievements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unseenBadges, setUnseenBadges] = useState([]);
  const [currentBadge, setCurrentBadge] = useState(null);
  const [showAllBadges, setShowAllBadges] = useState(false);
  
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const achievementsData = await VideoTracker.getUserAchievements();
        setAchievements(achievementsData);
        
        // Check for unseen badges
        const unseenBadgesData = await VideoTracker.getUnseenBadges();
        setUnseenBadges(unseenBadgesData);
        
        // Show the first unseen badge if any
        if (unseenBadgesData.length > 0) {
          setCurrentBadge(unseenBadgesData[0]);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAchievements();
  }, [user]);
  
  const handleCloseBadge = async () => {
    // Remove the current badge from unseen badges
    const newUnseenBadges = unseenBadges.filter(badge => badge._id !== currentBadge._id);
    setUnseenBadges(newUnseenBadges);
    
    // Show the next badge if any
    if (newUnseenBadges.length > 0) {
      setCurrentBadge(newUnseenBadges[0]);
    } else {
      setCurrentBadge(null);
      
      // Mark all badges as seen
      await VideoTracker.markBadgesAsSeen();
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 text-center">
        <p className="text-gray-600">Sign in to track your achievements</p>
      </div>
    );
  }
  
  if (!achievements) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-[var(--primary)] text-white p-4 flex justify-between items-center">
        <h3 className="text-xl font-bold">Your Achievements</h3>
        <FaTrophy className="text-xl" />
      </div>
      
      <div className="p-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--primary)]">
              {achievements.videosWatched.count}
            </div>
            <div className="text-sm text-gray-600">Videos Watched</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--primary)]">
              {achievements.playlistsCompleted.count}
            </div>
            <div className="text-sm text-gray-600">Playlists Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--primary)]">
              {achievements.watchStreak.current}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
        </div>
        
        {/* Recent Badges */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-800">Recent Badges</h4>
            <button 
              onClick={() => setShowAllBadges(!showAllBadges)}
              className="text-sm text-[var(--primary)] flex items-center"
            >
              {showAllBadges ? 'Show Less' : 'Show All'}
              <FaChevronRight className={`ml-1 transition-transform ${showAllBadges ? 'rotate-90' : ''}`} />
            </button>
          </div>
          
          {achievements.badges.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No badges earned yet. Keep watching videos to earn badges!
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {(showAllBadges ? achievements.badges : achievements.badges.slice(0, 4)).map((badge, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setCurrentBadge(badge)}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                    style={{ 
                      backgroundColor: getBadgeColor(badge.type),
                      opacity: badge.seen ? 1 : 0.7
                    }}
                  >
                    {getBadgeIcon(badge.type)}
                  </div>
                  <div className="text-xs text-center text-gray-600 truncate w-full">
                    {getBadgeTitle(badge.type)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Watch Streak */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Watch Streak</h4>
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <FaFire className="text-orange-500 mr-2" />
              <div className="text-sm">
                <span className="font-medium">{achievements.watchStreak.current} day{achievements.watchStreak.current !== 1 ? 's' : ''}</span>
                {' '}current streak
              </div>
            </div>
            <div className="text-xs text-gray-600">
              Longest streak: {achievements.watchStreak.longest} day{achievements.watchStreak.longest !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
      
      {/* Badge Popup */}
      {currentBadge && (
        <VideoBadgePopup 
          badge={currentBadge} 
          onClose={handleCloseBadge} 
        />
      )}
    </div>
  );
};

// Helper functions for badge display
const getBadgeColor = (type) => {
  if (type.includes('video_watcher')) return '#2196F3';
  if (type.includes('playlist')) return '#9C27B0';
  if (type.includes('streak')) return '#FF5722';
  return '#4CAF50';
};

const getBadgeIcon = (type) => {
  if (type.includes('video_watcher')) return <FaTrophy className="text-white" />;
  if (type.includes('playlist')) return <FaMedal className="text-white" />;
  if (type.includes('streak')) return <FaFire className="text-white" />;
  return <FaTrophy className="text-white" />;
};

const getBadgeTitle = (type) => {
  switch (type) {
    case 'first_video': return 'First Step';
    case 'video_watcher_5': return 'Video Enthusiast';
    case 'video_watcher_10': return 'Video Explorer';
    case 'video_watcher_25': return 'Video Connoisseur';
    case 'video_watcher_50': return 'Video Master';
    case 'video_watcher_100': return 'Video Legend';
    case 'first_playlist': return 'Playlist Pioneer';
    case 'playlist_master_5': return 'Playlist Adept';
    case 'playlist_master_10': return 'Playlist Champion';
    case 'streak_3': return 'Consistent Learner';
    case 'streak_7': return 'Weekly Warrior';
    case 'streak_14': return 'Dedicated Student';
    case 'streak_30': return 'Knowledge Seeker';
    default: return 'Achievement';
  }
};

export default VideoAchievements;
