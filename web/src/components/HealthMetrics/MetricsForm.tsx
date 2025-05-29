import React, { ReactNode } from 'react';

interface FormData {
  age: string | number;
  weight: string | number;
  height: string | number;
  gender: string;
  activityLevel: string;
  goal: string;
}

interface MetricsFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  unit: 'metric' | 'imperial';
  isDarkMode: boolean;
  isLoading: boolean;
  children: ReactNode;
}

const MetricsForm: React.FC<MetricsFormProps> = ({ 
  formData, 
  handleInputChange, 
  unit, 
  isDarkMode, 
  isLoading, 
  children 
}) => {
  return (
    <div className="metrics-form">
      <div className={`input-section ${isLoading ? 'loading-pulse' : ''}`}>
        <div className="input-group">
          <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Age</div>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="Years"
            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
          />
        </div>

        <div className="input-group">
          <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
            Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
          </div>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder={unit === 'imperial' ? 'Pounds' : 'Kilograms'}
            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
          />
        </div>

        <div className="input-group">
          <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
            Height ({unit === 'imperial' ? 'inches' : 'cm'})
          </div>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder={unit === 'imperial' ? 'Inches' : 'Centimeters'}
            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
          />
        </div>

        <div className="input-group">
          <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Gender</div>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="input-group">
          <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Activity Level</div>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleInputChange}
            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Light (exercise 1-3 days/week)</option>
            <option value="moderate">Moderate (exercise 3-5 days/week)</option>
            <option value="active">Active (exercise 6-7 days/week)</option>
            <option value="veryActive">Very Active (intense exercise daily)</option>
          </select>
        </div>

        <div className="input-group">
          <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Goal</div>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            <option value="lose">Weight Loss</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Weight Gain</option>
          </select>
        </div>
      </div>

      {children}
    </div>
  );
};

export default MetricsForm;
