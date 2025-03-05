import React from 'react';

const MetricCard = ({ icon, title, value, description }) => {
  return (
    <div className="metric-card">
      {icon}
      <h3>{title}</h3>
      <p className="metric-value">{value}</p>
      {description && <p className="metric-description">{description}</p>}
    </div>
  );
};

export default MetricCard;
