import React from 'react';
import MetricCard from './MetricCard';
import MacrosDisplay from './MacrosDisplay';
import RecommendationsSection from './RecommendationsSection';
import { FaRunning, FaChartLine, FaWeightHanging } from 'react-icons/fa';

const ResultsSection = ({ metrics, formData, unit, isDarkMode }) => {
  return (
    <div className="results-section">
      <div className="metrics-grid">
        <MetricCard
          icon={<FaRunning className="metric-icon" />}
          title="BMR"
          value={`${metrics.bmr} calories/day`}
          description="Base Metabolic Rate"
        />
        
        <MetricCard
          icon={<FaChartLine className="metric-icon" />}
          title="TDEE"
          value={`${metrics.tdee} calories/day`}
          description="Total Daily Energy Expenditure"
        />
        
        <MetricCard
          icon={<FaWeightHanging className="metric-icon" />}
          title="Ideal Weight Range"
          value={`${metrics.idealWeight.min} to ${metrics.idealWeight.max} ${unit === 'imperial' ? 'lbs' : 'kg'}`}
        />
      </div>
      
      <MacrosDisplay macros={metrics.macros} />
      
      <RecommendationsSection 
        macros={metrics.macros} 
        formData={formData} 
        isDarkMode={isDarkMode} 
      />
    </div>
  );
};

export default ResultsSection;
