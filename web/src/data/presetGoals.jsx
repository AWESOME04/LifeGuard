import { FaWeight, FaHeart, FaRunning, FaDumbbell } from 'react-icons/fa';
import { GiMuscleUp } from 'react-icons/gi';

export const presetGoals = [
    { id: 'strength', label: 'Build Strength', icon: GiMuscleUp, color: 'bg-blue-500' },
    { id: 'weightloss', label: 'Weight Loss', icon: FaWeight, color: 'bg-green-500' },
    { id: 'cardio', label: 'Improve Cardio', icon: FaHeart, color: 'bg-red-500' },
    { id: 'endurance', label: 'Build Endurance', icon: FaRunning, color: 'bg-yellow-500' },
    { id: 'muscle', label: 'Muscle Gain', icon: FaDumbbell, color: 'bg-purple-500' }
];
