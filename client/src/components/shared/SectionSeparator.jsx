import React from 'react';
import '../../assets/styles/SectionSeparator.css';

const SectionSeparator = ({ icon, className = '' }) => {
  return (
    <div className={`section-separator ${icon ? 'with-icon' : ''} ${className}`}>
      {icon && <div className="section-separator-icon">{icon}</div>}
    </div>
  );
};

export default SectionSeparator;
