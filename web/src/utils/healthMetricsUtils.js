export const calculateBMR = (weight, height, age, gender) => {
    const weightInKg = parseFloat(weight) * 0.453592;
    const heightInCm = parseFloat(height) * 2.54;
    const ageValue = parseInt(age);

    if (gender === 'male') {
        return 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * ageValue);
    }
    return 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * ageValue);
};

export const calculateTDEE = (bmr, activityLevel) => {
    const activityMultipliers = {
        sedentary: 1.2,      // Little or no exercise
        light: 1.375,        // Light exercise 1-3 days/week
        moderate: 1.55,      // Moderate exercise 3-5 days/week
        active: 1.725,       // Heavy exercise 6-7 days/week
        veryActive: 1.9      // Very heavy exercise, physical job
    };
    return bmr * activityMultipliers[activityLevel];
};

export const calculateMacros = (tdee, goal) => {
    const macroRatios = {
        lose: { protein: 0.4, carbs: 0.3, fat: 0.3 },
        maintain: { protein: 0.3, carbs: 0.4, fat: 0.3 },
        gain: { protein: 0.3, carbs: 0.45, fat: 0.25 }
    };

    const calorieAdjustment = {
        lose: -500,    // Caloric deficit
        maintain: 0,   // Maintenance calories
        gain: 500      // Caloric surplus
    };

    const adjustedTDEE = tdee + calorieAdjustment[goal];
    const ratios = macroRatios[goal];

    return {
        calories: Math.round(adjustedTDEE),
        protein: Math.round((adjustedTDEE * ratios.protein) / 4), // 4 calories per gram
        carbs: Math.round((adjustedTDEE * ratios.carbs) / 4),
        fat: Math.round((adjustedTDEE * ratios.fat) / 9)  // 9 calories per gram
    };
};

export const calculateIdealWeight = (height, gender) => {
    const heightInCm = parseFloat(height) * 2.54;
    if (gender === 'male') {
        return {
            min: Math.round((heightInCm - 100) * 0.9),
            max: Math.round((heightInCm - 100) * 1.1)
        };
    }
    return {
        min: Math.round((heightInCm - 100) * 0.85),
        max: Math.round((heightInCm - 100) * 1.05)
    };
}; 