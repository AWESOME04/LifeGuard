export const generateHealthReport = (userData) => ({
  userInfo: {
    name: userData?.userName || 'Test User',
    date: new Date().toLocaleDateString(),
    reportId: `LGR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  },
  vitals: {
    temperature: {
      average: "36.5°C",
      min: "36.2°C",
      max: "36.8°C",
      status: "Normal"
    },
    pressure: {
      average: "1000hPa",
      min: "500hPa",
      max: "1500hPa",
      status: "Normal"
    },
    humidity: {
      average: "50%",
      min: "45%",
      max: "55%",
      status: "Normal"
    },
    activityLevel: {
      average: "200 steps",
      min: "100 steps",
      max: "300 steps",
      status: "low"
    }
  },
  environmentalMetrics: {
    airQuality: {
      average: "75 AQI",
      status: "Moderate",
      pollutants: {
        pm25: "15.2 µg/m³",
        pm10: "45.8 µg/m³",
        no2: "25.4 ppb"
      }
    },
    humidity: {
      average: "58.8%",
      status: "Optimal"
    },
    pressure: {
      average: "1013 hPa",
      status: "Normal"
    }
  },
  activityMetrics: {
    dailySteps: {
      average: "8,500",
      goal: "10,000",
      status: "Good"
    },
    caloriesBurned: {
      average: "2,150 kcal",
      goal: "2,500 kcal",
      status: "On Track"
    },
    activeMinutes: {
      average: "45 mins",
      goal: "60 mins",
      status: "Improving"
    }
  },
  recommendations: [
    "Maintain regular physical activity levels",
    "Consider increasing daily water intake",
    "Monitor PM2.5 exposure during outdoor activities",
    "Keep up with the consistent sleep schedule"
  ]
}); 