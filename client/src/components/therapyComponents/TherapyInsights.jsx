import React from 'react';
import { FaLightbulb, FaClipboard, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import './TherapyComponents.css';

const TherapyInsights = ({ insights, recommendations, summary, sessionStatus }) => {
  // If no insights or recommendations exist
  if ((!insights || insights.length === 0) && (!recommendations || recommendations.length === 0) && !summary) {
    return (
      <div className="therapy-empty-insights">
        <div className="therapy-empty-icon">
          <FaLightbulb />
        </div>
        <h3>No Insights Yet</h3>
        <p>
          {sessionStatus === 'active' 
            ? 'Complete this therapy session to see insights and recommendations.'
            : 'No insights were generated for this session.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="therapy-insights">
      {/* Summary Section */}
      {summary && (
        <div className="therapy-summary">
          <div className="therapy-summary-header">
            <h3>Session Summary</h3>
          </div>
          <div className="therapy-summary-content">
            <div className="therapy-quote-marks">
              <FaQuoteLeft className="therapy-quote-left" />
              <FaQuoteRight className="therapy-quote-right" />
            </div>
            <p>{summary}</p>
          </div>
        </div>
      )}
      
      {/* Insights Section */}
      {insights && insights.length > 0 && (
        <div className="therapy-insights-section">
          <div className="therapy-insights-header">
            <FaLightbulb />
            <h3>Key Insights</h3>
          </div>
          <ul className="therapy-insights-list">
            {insights.map((insight, index) => (
              <li key={index} className="therapy-insight-item">
                <div className="therapy-insight-number">{index + 1}</div>
                <div className="therapy-insight-content">{insight}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Recommendations Section */}
      {recommendations && recommendations.length > 0 && (
        <div className="therapy-recommendations-section">
          <div className="therapy-recommendations-header">
            <FaClipboard />
            <h3>Recommendations</h3>
          </div>
          <ul className="therapy-recommendations-list">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="therapy-recommendation-item">
                <div className="therapy-recommendation-bullet"></div>
                <div className="therapy-recommendation-content">{recommendation}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TherapyInsights;
