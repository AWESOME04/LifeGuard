import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { calculateBMR, calculateTDEE, calculateMacros, calculateIdealWeight } from '../../utils/healthMetricsUtils';
import UnitToggle from '../../components/HealthMetrics/UnitToggle';
import MetricsForm from '../../components/HealthMetrics/MetricsForm';
import ResultsSection from '../../components/HealthMetrics/ResultsSection';
import './HealthMetrics.css';

function HealthMetrics({ isDarkMode }) {
    const [formData, setFormData] = useState({
        age: '',
        weight: '',
        height: '',
        gender: 'male',
        activityLevel: 'sedentary',
        goal: 'maintain'
    });

    const [metrics, setMetrics] = useState({
        bmr: 0,
        tdee: 0,
        macros: null,
        idealWeight: null
    });

    const [showResults, setShowResults] = useState(false);
    const [unit, setUnit] = useState('imperial'); // imperial or metric

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setShowResults(false);
    };

    const calculateMetrics = () => {
        if (!formData.age || !formData.weight || !formData.height) {
            toast.info('Please fill in all fields');
            return;
        }

        const bmr = Math.round(calculateBMR(formData.weight, formData.height, formData.age, formData.gender));
        const tdee = Math.round(calculateTDEE(bmr, formData.activityLevel));
        const macros = calculateMacros(tdee, formData.goal);
        const idealWeight = calculateIdealWeight(formData.height, formData.gender);

        setMetrics({
            bmr,
            tdee,
            macros,
            idealWeight
        });
        setShowResults(true);
    };

    return (
        <div className={`health-metrics-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="health-metrics-content">
                <div className="header-section">
                    <h2>Health Metrics Calculator</h2>
                    <UnitToggle unit={unit} setUnit={setUnit} />
                </div>

                <MetricsForm 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    unit={unit} 
                    isDarkMode={isDarkMode} 
                    calculateMetrics={calculateMetrics} 
                />

                {showResults && (
                    <ResultsSection 
                        metrics={metrics} 
                        formData={formData} 
                        unit={unit} 
                        isDarkMode={isDarkMode} 
                    />
                )}
            </div>
        </div>
    );
}

export default HealthMetrics;