import React from 'react';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import './TherapyComponents.css';

const TherapySessionList = ({ sessions, activeSessionId, onSessionSelect }) => {
  // Format date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };
  
  // Format time to display in a readable format
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="therapy-session-list">
      {sessions.length === 0 ? (
        <div className="therapy-no-sessions">
          <p>No therapy sessions yet</p>
        </div>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li 
              key={session._id}
              className={`therapy-session-item ${session._id === activeSessionId ? 'active' : ''}`}
              onClick={() => onSessionSelect(session._id)}
            >
              <div className="therapy-session-icon">
                {session.status === 'completed' ? (
                  <FaCheckCircle className="therapy-session-completed-icon" />
                ) : (
                  <FaCircle className="therapy-session-active-icon" />
                )}
              </div>
              <div className="therapy-session-info">
                <div className="therapy-session-title">
                  {session.title}
                </div>
                <div className="therapy-session-meta">
                  <span className="therapy-session-date">
                    {formatDate(session.startedAt)}
                  </span>
                  <span className="therapy-session-time">
                    {formatTime(session.startedAt)}
                  </span>
                  <span className="therapy-session-count">
                    {session.messageCount || 0} messages
                  </span>
                </div>
              </div>
              <div className="therapy-session-status">
                {session.status === 'active' ? (
                  <span className="therapy-status-badge active">Active</span>
                ) : (
                  <span className="therapy-status-badge completed">Completed</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TherapySessionList;
