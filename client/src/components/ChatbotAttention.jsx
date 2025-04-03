import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatbotAttention.css';

const ChatbotAttention = ({ onOpenChatbot }) => {
  const [showAttention, setShowAttention] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasSeenAttention, setHasSeenAttention] = useState(false);

  useEffect(() => {
    // Check if user has seen the attention grabber before
    const hasSeenBefore = localStorage.getItem('chatbotAttentionSeen');
    
    if (!hasSeenBefore) {
      // Wait a moment before showing the attention grabber
      const timer = setTimeout(() => {
        setShowAttention(true);
        
        // Show tooltip after a short delay
        setTimeout(() => {
          setShowTooltip(true);
        }, 1000);
        
        // Auto-open chatbot after a longer delay if user hasn't interacted
        setTimeout(() => {
          if (!hasSeenAttention) {
            onOpenChatbot();
            setHasSeenAttention(true);
            localStorage.setItem('chatbotAttentionSeen', 'true');
            setShowAttention(false);
            setShowTooltip(false);
          }
        }, 8000);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [onOpenChatbot, hasSeenAttention]);

  const handleAttentionClick = () => {
    onOpenChatbot();
    setHasSeenAttention(true);
    localStorage.setItem('chatbotAttentionSeen', 'true');
    setShowAttention(false);
    setShowTooltip(false);
  };

  // If user has seen the attention before, don't show anything
  if (localStorage.getItem('chatbotAttentionSeen')) {
    return null;
  }

  return (
    <AnimatePresence>
      {showAttention && (
        <>
          <motion.div
            className="chatbot-attention-ring"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleAttentionClick}
          />
          
          <motion.div
            className="chatbot-attention-pointer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22L3 10H21L12 22Z" fill="#ffffff"/>
            </svg>
          </motion.div>
          
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                className="chatbot-attention-tooltip"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <p>Hi there! 👋 I'm your AI assistant.</p>
                <p>Click here to chat with me!</p>
                <motion.button 
                  className="tooltip-button"
                  onClick={handleAttentionClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Chatting
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatbotAttention;
