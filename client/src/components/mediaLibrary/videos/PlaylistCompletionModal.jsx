import React, { useEffect } from 'react';
import { FaTrophy, FaTimes, FaShare } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const PlaylistCompletionModal = ({ playlist, onClose }) => {
  useEffect(() => {
    // Trigger confetti effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };
    
    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }
      
      const particleCount = 50 * (timeLeft / duration);
      
      // Launch confetti from both sides
      confetti({
        particleCount,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 }
      });
      
      confetti({
        particleCount,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.6, x: 1 }
      });
    }, 250);
    
    return () => clearInterval(confettiInterval);
  }, []);
  
  const handleShare = (platform) => {
    const shareText = `I just completed the "${playlist.title}" playlist on SukoonSphere! 🎉`;
    const shareUrl = `${window.location.origin}/all-videos/playlist/${playlist._id}`;
    
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank');
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-bounce-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrophy className="text-4xl text-yellow-500" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
          <p className="text-gray-600 mb-6">
            You've completed all videos in the "{playlist.title}" playlist! 
            Keep up the great work on your learning journey.
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="text-sm text-gray-700 mb-2">Share your achievement:</div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => handleShare('twitter')}
                className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
              >
                <i className="fab fa-twitter"></i>
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                <i className="fab fa-facebook-f"></i>
              </button>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                <i className="fab fa-whatsapp"></i>
              </button>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCompletionModal;
