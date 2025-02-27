import { FaUserPlus, FaMobile, FaHeartbeat, FaBell } from 'react-icons/fa';

export const steps = [
    {
        icon: <FaUserPlus />,
        title: 'Create Account',
        description: 'Sign up and complete your health profile with basic information.'
    },
    {
        icon: <FaMobile />,
        title: 'Connect Device',
        description: 'Pair your LifeGuard device with our mobile app.'
    },
    {
        icon: <FaHeartbeat />,
        title: 'Monitor Health',
        description: 'Track your vital signs and environmental conditions in real-time.'
    },
    {
        icon: <FaBell />,
        title: 'Get Alerts',
        description: 'Receive instant notifications for any health concerns.'
    }
];