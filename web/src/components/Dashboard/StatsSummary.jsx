import React from 'react';
import { FaChartLine, FaExclamationTriangle, FaBell, FaClipboardCheck } from 'react-icons/fa';
import './StatsSummary.css';

const StatsSummary = ({ isDarkMode, stats = {} }) => {
  const defaultStats = {
    readings: stats.readings || 124,
    alerts: stats.alerts || 2,
    notifications: stats.notifications || 5,
    tasks: stats.tasks || 3
  };
  
  return (
    <div className={`stats-summary ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="stat-item">
        <div className="stat-icon readings">
          <FaChartLine />
        </div>
        <div className="stat-content">
          <h3>{defaultStats.readings}</h3>
          <p>Readings Today</p>
        </div>
      </div>
      
      <div className="stat-item">
        <div className="stat-icon alerts">
          <FaExclamationTriangle />
        </div>
        <div className="stat-content">
          <h3>{defaultStats.alerts}</h3>
          <p>Active Alerts</p>
        </div>
      </div>
      
      <div className="stat-item">
        <div className="stat-icon notifications">
          <FaBell />
        </div>
        <div className="stat-content">
          <h3>{defaultStats.notifications}</h3>
          <p>Notifications</p>
        </div>
      </div>
      
      <div className="stat-item">
        <div className="stat-icon tasks">
          <FaClipboardCheck />
        </div>
        <div className="stat-content">
          <h3>{defaultStats.tasks}</h3>
          <p>Tasks Due</p>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
