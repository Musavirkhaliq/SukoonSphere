import React, { useState, useEffect } from 'react';
import { FaTimes, FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import VideoTracker from '@/utils/videoTracker';
import confetti from 'canvas-confetti';

const VideoBadgePopup = ({ badge, onClose }) => {
  const [badgeDetails, setBadgeDetails] = useState(null);
  
  useEffect(() => {
    const fetchBadgeDetails = async () => {
      const details = await VideoTracker.getBadgeDetails();
      setBadgeDetails(details[badge.type] || {
        title: 'New Badge',
        description: 'You earned a new badge!',
        icon: '🏆',
        color: '#4CAF50'
      });
      
      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
    
    fetchBadgeDetails();
  }, [badge]);
  
  if (!badgeDetails) {
    return null;
  }
  
  // Get the icon component based on the badge type
  const getIconComponent = () => {
    if (badge.type.includes('video_watcher')) {
      return <FaTrophy className="text-5xl" />;
    } else if (badge.type.includes('playlist')) {
      return <FaMedal className="text-5xl" />;
    } else if (badge.type.includes('streak')) {
      return <FaAward className="text-5xl" />;
    } else {
      return <FaTrophy className="text-5xl" />;
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all animate-bounce-in">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        
        <div className="text-center">
          <div 
            className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${badgeDetails.color}20` }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: badgeDetails.color }}
            >
              {badgeDetails.icon ? (
                <span className="text-3xl">{badgeDetails.icon}</span>
              ) : (
                getIconComponent()
              )}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{badgeDetails.title}</h2>
          <p className="text-gray-600 mb-4">{badgeDetails.description}</p>
          
          <div className="text-sm text-gray-500">
            Earned {new Date(badge.earnedAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoBadgePopup;
