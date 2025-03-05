import React from 'react';

const UnitToggle = ({ unit, setUnit }) => {
  return (
    <div className="unit-toggle">
      <button 
        className={unit === 'imperial' ? 'active' : ''}
        onClick={() => setUnit('imperial')}
      >
        Imperial
      </button>
      <button 
        className={unit === 'metric' ? 'active' : ''}
        onClick={() => setUnit('metric')}
      >
        Metric
      </button>
    </div>
  );
};

export default UnitToggle;
