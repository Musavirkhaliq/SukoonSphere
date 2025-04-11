import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner, FaCheck, FaClipboardList, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
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
  const [isListening, setIsListening] = useState(false);
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

  // Speech recognition setup
  useEffect(() => {
    // Initialize speech recognition if available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setInput(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error('Speech recognition failed. Please try again or type your message.');
      };

      // Store the recognition instance in a ref
      window.speechRecognition = recognition;
    }

    // Cleanup
    return () => {
      if (window.speechRecognition) {
        window.speechRecognition.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      window.speechRecognition.stop();
      setIsListening(false);
    } else {
      setInput('');
      window.speechRecognition.start();
      setIsListening(true);
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
        {/* {shouldShowAssessmentButton() && (
          <button
            className="therapy-assessment-button"
            onClick={onStartAssessment}
          >
            Take Progress Assessment
          </button>
        )} */}

        {sessionStatus === 'active' ? (
          <div className="therapy-chat-input">
            <div className="therapy-chat-input-group">
              <div className="therapy-chat-input-container">
                <textarea
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening... (speak now)" : "Type your message..."}
                  disabled={isLoading || isListening}
                  className={`therapy-input ${isListening ? 'listening' : ''}`}
                  rows={"2"}
                />
                <button
                  className={`therapy-mic-button ${isListening ? 'listening' : ''}`}
                  onClick={toggleListening}
                  disabled={isLoading}
                  title={isListening ? "Stop listening" : "Speak your message"}
                >
                  {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
              </div>
              <button
                className="btn-2"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                title="Send message"
              >
                {isLoading ? <FaSpinner className="spin" /> : <FaPaperPlane />}
              </button>
            </div>
            <div className="therapy-chat-actions">
              <button
                className="therapy-complete-button"
                onClick={() => setShowCompletionModal(true)}
                title="Complete session"
              >
                Complete Session
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
      {
        showCompletionModal && (
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
                  style={{ resize: "none", maxHeight: "120px" }}
                  className="bg-[var(--white-color)] py-2 px-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  rows={"1"}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts about this session..."
                />
              </div>

              <div className="therapy-modal-actions">
                <button
                  className="btn-red"
                  onClick={() => setShowCompletionModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-2"
                  onClick={handleCompleteSession}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <FaSpinner className="spin" /> : 'Complete Session'}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default TherapyChat;
