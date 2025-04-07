import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';
import { toast } from 'react-toastify';
import { FaHistory, FaPlus, FaSpinner, FaLightbulb, FaChartLine, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';
import TherapyChat from '@/components/therapyComponents/TherapyChat';
import TherapySessionList from '@/components/therapyComponents/TherapySessionList';
import TherapyAssessment from '@/components/therapyComponents/TherapyAssessment';
import TherapyActionPlan from '@/components/therapyComponents/TherapyActionPlan';
import TherapyInsights from '@/components/therapyComponents/TherapyInsights';
import './Therapy.css';

const SukoonAI = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('chat');
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentType, setAssessmentType] = useState('initial');
  const [actionPlans, setActionPlans] = useState([]);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.error('Please log in to access the SukoonAI');
      navigate('/auth/sign-in');
    } else {
      console.log('Current user:', user);
    }
  }, [user, navigate]);

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching therapy sessions...');
        const response = await customFetch.get('/therapy/sessions');
        console.log('Therapy sessions response:', response.data);
        setSessions(response.data.sessions);

        // If there are sessions, set the active session to the most recent one
        if (response.data.sessions.length > 0) {
          const mostRecentSession = response.data.sessions[0]; // Sessions are sorted by session number in descending order
          console.log('Setting active session:', mostRecentSession);
          setActiveSession(mostRecentSession);
          fetchSessionDetails(mostRecentSession._id);
        } else {
          // If no sessions exist, create a new one
          console.log('No sessions found, creating a new one...');
          startNewSession();
        }
      } catch (error) {
        console.error('Error fetching therapy sessions:', error);
        console.error('Error details:', error.response?.data || error.message);
        toast.error(error.response?.data?.error || 'Failed to load therapy sessions');

        // If there's an authentication error, redirect to auth/sign-in
        if (error.response?.status === 401) {
          toast.error('Please log in to access the SukoonAI');
          navigate('/auth/sign-in');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSessions();
    }
  }, [user, navigate]);

  // Fetch session details when active session changes
  const fetchSessionDetails = async (sessionId) => {
    if (!sessionId) {
      console.error('No session ID provided to fetchSessionDetails');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching session details for ID:', sessionId);
      const response = await customFetch.get(`/therapy/sessions/${sessionId}`);
      console.log('Session details response:', response.data);

      if (!response.data.session) {
        throw new Error('No session data returned from server');
      }

      const sessionData = response.data.session;

      // Update active session with full data
      setActiveSession(sessionData);

      // Set messages and other session data
      setMessages(sessionData.messages || []);
      setActionPlans(sessionData.actionPlans || []);
      setInsights(sessionData.insights || []);
      setRecommendations(sessionData.recommendations || []);

      // Check if this is a new session with no messages yet
      if (sessionData.messages.length === 0) {
        // For new sessions, show the initial assessment
        console.log('New session with no messages, showing initial assessment');
        setShowAssessment(true);
        setAssessmentType('initial');
      } else if (sessionData.messages.length > 0 &&
                (sessionData.assessments?.length === 0 || !sessionData.assessments)) {
        // If there are messages but no assessments, suggest taking the assessment
        console.log('Session has messages but no assessments');
        setShowAssessment(false);
      } else {
        console.log('Session has messages and assessments');
        setShowAssessment(false);
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
      console.error('Error details:', error.response?.data || error.message);

      // Show a more specific error message
      let errorMessage = 'Failed to load session details';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      // If there's an authentication error, redirect to auth/sign-in
      if (error.response?.status === 401) {
        toast.error('Please log in to access the SukoonAI');
        navigate('/auth/sign-in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new therapy session
  const startNewSession = async () => {
    try {
      setIsLoading(true);
      console.log('Starting new therapy session...');
      const response = await customFetch.post('/therapy/sessions/new');
      console.log('New session response:', response.data);

      if (!response.data.sessionId || !response.data.sessionNumber) {
        throw new Error('Invalid session data returned from server');
      }

      // Add the new session to the sessions list
      const newSession = {
        _id: response.data.sessionId,
        sessionNumber: response.data.sessionNumber,
        title: `Therapy Session #${response.data.sessionNumber}`,
        status: 'active',
        startedAt: new Date().toISOString(),
        messageCount: 1,
        messages: [
          { sender: 'therapist', text: response.data.welcomeMessage, timestamp: new Date().toISOString() }
        ]
      };

      console.log('Created new session object:', newSession);

      // Update sessions list and set active session
      setSessions(prevSessions => [newSession, ...prevSessions]);
      setActiveSession(newSession);

      // Set the welcome message
      setMessages([
        { sender: 'therapist', text: response.data.welcomeMessage, timestamp: new Date().toISOString() }
      ]);

      // Reset other session data
      setActionPlans([]);
      setInsights([]);
      setRecommendations([]);

      // Show the initial assessment for new sessions
      setShowAssessment(true);
      setAssessmentType('initial');

      toast.success('New therapy session started');

      // Switch to chat tab
      setActiveTab('chat');
    } catch (error) {
      console.error('Error starting new therapy session:', error);
      console.error('Error details:', error.response?.data || error.message);

      // Show a more specific error message
      let errorMessage = 'Failed to start new therapy session';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      // If there's an authentication error, redirect to auth/sign-in
      if (error.response?.status === 401) {
        toast.error('Please log in to access the SukoonAI');
        navigate('/auth/sign-in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Complete the current therapy session
  const completeSession = async (moodAfter, feedback) => {
    if (!activeSession) return;

    try {
      setIsLoading(true);
      const response = await customFetch.post(`/therapy/sessions/${activeSession._id}/complete`, {
        moodAfter,
        feedback
      });

      // Update the active session status
      const updatedSession = {
        ...activeSession,
        status: 'completed',
        endedAt: new Date().toISOString()
      };

      // Update the sessions list
      setSessions(sessions.map(session =>
        session._id === activeSession._id ? updatedSession : session
      ));

      setActiveSession(updatedSession);

      // Update insights and recommendations
      setInsights(response.data.insights || []);
      setRecommendations(response.data.recommendations || []);

      toast.success('Therapy session completed');

      // Switch to insights tab
      setActiveTab('insights');
    } catch (error) {
      console.error('Error completing therapy session:', error);
      toast.error('Failed to complete therapy session');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (message) => {
    if (!activeSession || !message.trim()) {
      console.log('Cannot send message: No active session or empty message');
      return;
    }

    if (activeSession.status !== 'active') {
      toast.error('Cannot send messages to a completed session');
      return;
    }

    // Check if there are any messages in the session
    // If the first message is from the therapist, we need to ensure there's at least one user message
    // before sending another message to avoid the Gemini API error
    const hasUserMessage = messages.some(msg => msg.sender === 'user');

    if (messages.length > 0 && !hasUserMessage) {
      console.log('Session has messages but no user messages yet, adding a dummy user message');
      // We'll handle this on the backend, so we don't need to do anything here
    }

    // Add user message to the UI immediately
    const userMessage = { sender: 'user', text: message, timestamp: new Date().toISOString() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      console.log('Sending message to API:', {
        message,
        sessionId: activeSession._id
      });

      // Send the message to the API
      const response = await customFetch.post('/therapy/message', {
        message,
        sessionId: activeSession._id
      });

      console.log('API response:', response.data);

      if (!response.data.response) {
        throw new Error('No response received from the therapist');
      }

      // Add therapist response to the UI
      const therapistMessage = {
        sender: 'therapist',
        text: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prevMessages => [...prevMessages, therapistMessage]);

      // Update session in the list
      setSessions(prevSessions => prevSessions.map(session =>
        session._id === activeSession._id
          ? { ...session, messageCount: (session.messageCount || 0) + 2, lastUpdated: new Date().toISOString() }
          : session
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data || error.message);

      // Show a more specific error message
      let errorMessage = 'Failed to send message';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      // Remove the user message if the API call fails
      setMessages(prevMessages => prevMessages.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle assessment completion
  const handleAssessmentComplete = (responses) => {
    if (!activeSession) return;

    // Submit assessment responses
    const submitResponses = async () => {
      try {
        const response = await customFetch.post('/therapy/assessments/submit', {
          sessionId: activeSession._id,
          responses
        });

        // Add therapist message about assessment completion
        const therapistMessage = {
          sender: 'therapist',
          text: response.data.responseMessage,
          timestamp: new Date().toISOString(),
          messageType: 'assessment'
        };

        setMessages(prevMessages => [...prevMessages, therapistMessage]);

        // Hide the assessment
        setShowAssessment(false);

        // Update session in the list
        setSessions(sessions.map(session =>
          session._id === activeSession._id
            ? { ...session, messageCount: (session.messageCount || 0) + 1, lastUpdated: new Date().toISOString() }
            : session
        ));
      } catch (error) {
        console.error('Error submitting assessment:', error);
        toast.error('Failed to submit assessment');
      }
    };

    submitResponses();
  };

  // Handle switching sessions
  const handleSessionChange = (sessionId) => {
    const selectedSession = sessions.find(session => session._id === sessionId);
    if (selectedSession) {
      setActiveSession(selectedSession);
      fetchSessionDetails(sessionId);
      setIsSidebarOpen(false); // Close sidebar on mobile after selection
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return null; // Don't render anything if user is not logged in
  }

  return (
    <div className="therapy-container">
      {/* Mobile header with menu button */}
      <div className="therapy-mobile-header">
        <button className="therapy-menu-button" onClick={toggleSidebar}>
          <FaHistory />
          <span>Sessions</span>
        </button>
        <div className="sukoon-branding">
          <h1>SukoonAI</h1>
          <p className="sukoon-tagline">Where you discover yourself, we help you</p>
        </div>
        <button className="therapy-new-session-button" onClick={startNewSession}>
          <FaPlus />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`therapy-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="therapy-sidebar-header">
          <div className="sukoon-sidebar-branding">
            <h2>SukoonAI</h2>
            <p className="sukoon-sidebar-tagline">Your self-discovery journey</p>
          </div>
          <button className="therapy-new-session-button" onClick={startNewSession}>
            <FaPlus />
            <span>New Journey</span>
          </button>
        </div>

        <TherapySessionList
          sessions={sessions}
          activeSessionId={activeSession?._id}
          onSessionSelect={handleSessionChange}
        />
      </div>

      {/* Main content */}
      <div className="therapy-main">
        {isLoading && !activeSession ? (
          <div className="therapy-loading">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="sukoon-loading-icon"
            >
              <FaRobot className="sukoon-robot-icon" />
            </motion.div>
            <p>Preparing your self-discovery journey...</p>
          </div>
        ) : (
          <>
            {/* Session header */}
            <div className="therapy-session-header">
              <div className="sukoon-session-info">
                <h2>{activeSession?.title?.replace('Therapy Session', 'SukoonAI Journey') || 'SukoonAI Journey'}</h2>
                <p className="sukoon-session-subtitle">Your path to self-discovery</p>
              </div>
              <div className="therapy-tabs">
                <button
                  className={`therapy-tab ${activeTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setActiveTab('chat')}
                >
                  <FaRobot className="tab-icon" />
                  <span>Conversation</span>
                </button>
                <button
                  className={`therapy-tab ${activeTab === 'action-plans' ? 'active' : ''}`}
                  onClick={() => setActiveTab('action-plans')}
                >
                  <FaChartLine className="tab-icon" />
                  <span>Growth Plan</span>
                </button>
                <button
                  className={`therapy-tab ${activeTab === 'insights' ? 'active' : ''}`}
                  onClick={() => setActiveTab('insights')}
                >
                  <FaLightbulb className="tab-icon" />
                  <span>Insights</span>
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="therapy-tab-content">
              {activeTab === 'chat' && (
                <>
                  {showAssessment ? (
                    <TherapyAssessment
                      type={assessmentType}
                      onComplete={handleAssessmentComplete}
                      onSkip={() => setShowAssessment(false)}
                    />
                  ) : (
                    <TherapyChat
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      onCompleteSession={completeSession}
                      sessionStatus={activeSession?.status}
                      isLoading={isLoading}
                      onStartAssessment={() => {
                        setShowAssessment(true);
                        setAssessmentType('progress');
                      }}
                    />
                  )}
                </>
              )}

              {activeTab === 'action-plans' && (
                <TherapyActionPlan
                  actionPlans={actionPlans}
                  sessionId={activeSession?._id}
                  sessionStatus={activeSession?.status}
                />
              )}

              {activeTab === 'insights' && (
                <TherapyInsights
                  insights={insights}
                  recommendations={recommendations}
                  summary={activeSession?.summary}
                  sessionStatus={activeSession?.status}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SukoonAI;
