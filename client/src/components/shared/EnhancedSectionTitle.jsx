import React from 'react';
import '../../assets/styles/SectionSeparator.css';

const EnhancedSectionTitle = ({ title, subtitle, centered = true, className = '' }) => {
  return (
    <div className={`section-title-enhanced ${centered ? 'text-center' : ''} ${className}`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default EnhancedSectionTitle;
