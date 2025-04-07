import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner, FaCheck, FaClipboardList } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './TherapyComponents.css';

const TherapyChat = ({
  messages,
  onSendMessage,
  onCompleteSession,
  sessionStatus,
  isLoading,
  onStartAssessment
}) => {
  const [input, setInput] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [moodRating, setMoodRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (input.trim() && !isLoading && sessionStatus === 'active') {
      console.log('Sending message from TherapyChat:', input);
      onSendMessage(input);
      setInput('');
    } else {
      console.log('Cannot send message:', {
        hasInput: Boolean(input.trim()),
        isLoading,
        sessionStatus
      });

      if (sessionStatus !== 'active') {
        toast.error('Cannot send messages to a completed session');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCompleteSession = () => {
    setIsSubmitting(true);
    onCompleteSession(moodRating, feedback);
    setShowCompletionModal(false);
    setIsSubmitting(false);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determine if we should show the "Take Assessment" button
  const shouldShowAssessmentButton = () => {
    if (sessionStatus !== 'active' || messages.length < 5) return false;

    // Check if there's already an assessment message
    const hasAssessment = messages.some(msg => msg.messageType === 'assessment');
    return !hasAssessment;
  };

  return (
    <div className="therapy-chat">
      <div className="therapy-chat-messages">
        {messages.length === 0 ? (
          <div className="therapy-empty-state">
            <div className="therapy-empty-icon">
              <FaClipboardList />
            </div>
            <h3>Welcome to your therapy session</h3>
            <p>Start by sharing how you're feeling today or take an assessment to help me understand your needs better.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`therapy-message ${message.sender === 'user' ? 'user' : 'therapist'}`}
            >
              <div className="therapy-message-content">
                <div className="therapy-message-text">{message.text}</div>
                <div className="therapy-message-time">{formatTimestamp(message.timestamp)}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="therapy-chat-footer">
        {shouldShowAssessmentButton() && (
          <button
            className="therapy-assessment-button"
            onClick={onStartAssessment}
          >
            Take Progress Assessment
          </button>
        )}

        {sessionStatus === 'active' ? (
          <div className="therapy-chat-input">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <div className="therapy-chat-actions">
              <button
                className="therapy-complete-button"
                onClick={() => setShowCompletionModal(true)}
              >
                Complete Session
              </button>
              <button
                className="therapy-send-button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? <FaSpinner className="spin" /> : <FaPaperPlane />}
              </button>
            </div>
          </div>
        ) : (
          <div className="therapy-session-completed">
            <FaCheck />
            <span>This session has been completed</span>
          </div>
        )}
      </div>

      {/* Session Completion Modal */}
      {showCompletionModal && (
        <div className="therapy-modal-overlay">
          <div className="therapy-modal">
            <h3>Complete Therapy Session</h3>
            <p>Before we end this session, please rate how you're feeling now:</p>

            <div className="therapy-mood-rating">
              <div className="therapy-mood-scale">
                <span>😞</span>
                <div className="therapy-mood-numbers">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <button
                      key={num}
                      className={`therapy-mood-number ${moodRating === num ? 'active' : ''}`}
                      onClick={() => setMoodRating(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <span>😊</span>
              </div>
            </div>

            <div className="therapy-feedback">
              <label htmlFor="feedback">Any feedback about this session?</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about this session..."
              />
            </div>

            <div className="therapy-modal-actions">
              <button
                className="therapy-modal-cancel"
                onClick={() => setShowCompletionModal(false)}
              >
                Cancel
              </button>
              <button
                className="therapy-modal-confirm"
                onClick={handleCompleteSession}
                disabled={isSubmitting}
              >
                {isSubmitting ? <FaSpinner className="spin" /> : 'Complete Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapyChat;
