import React from 'react';

const RecommendationsSection = ({ macros, formData, isDarkMode }) => {
  return (
    <div className="recommendations-section">
      <h3>Personalized Recommendations</h3>
      <ul>
        <li className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
          Aim for {macros.calories} calories per day to {formData.goal} weight
        </li>
        <li className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
          Try to get {macros.protein}g of protein to maintain muscle mass
        </li>
        <li className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
          Stay hydrated with {Math.round(formData.weight * 0.5)} oz of water daily
        </li>
        <li className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
          Consider tracking your meals to meet your macro goals
        </li>
      </ul>
    </div>
  );
};

export default RecommendationsSection;
