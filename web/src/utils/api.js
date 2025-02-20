import { toast } from 'react-toastify';

export const FRONTEND_URL = window.location.origin; // Gets the current frontend URL
export const API_BASE_URL = 'https://lifeguard-hiij.onrender.com/api';
export const NODE_API_URL = 'https://lifeguard-node.onrender.com';
export const QUOTE_API_URL = 'https://api.allorigins.win/raw?url=https://zenquotes.io/api/random';

export const API_ENDPOINTS = {
    LOGIN: '/Account/login',
    REGISTER: '/Account/register',
    VERIFY_OTP: '/Account/VerifyOTP',
    RESEND_OTP: '/Account/ResendOTP',
    FORGOT_PASSWORD: '/Account/forgot-password',
    RESET_PASSWORD: '/Account/ResetPassword',
    GET_USER: '/Account/id',
    MEMOS: `${NODE_API_URL}/api/memos`,
    EMERGENCY_CONTACTS: `${NODE_API_URL}/api/emergency-contacts`
};

export const fetchApi = async (endpoint, options = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    try {
        const baseUrl = endpoint.startsWith('http') ? '' : API_BASE_URL;
        const url = `${baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            mode: 'cors',
            credentials: 'omit'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'An error occurred');
        }

        return data;
    } catch (error) {
        toast.error(error.message || 'An error occurred');
        throw error;
    }
};

// List of endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
    API_ENDPOINTS.LOGIN,
    API_ENDPOINTS.REGISTER,
    API_ENDPOINTS.FORGOT_PASSWORD,
    API_ENDPOINTS.RESET_PASSWORD,
    API_ENDPOINTS.VERIFY_OTP,
    API_ENDPOINTS.RESEND_OTP
];

export const fetchWithAuth = async (endpoint, options = {}) => {
    // Check if endpoint is public
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(publicEndpoint => 
        endpoint.includes(publicEndpoint)
    );

    const token = localStorage.getItem('token');
    if (!token && !isPublicEndpoint) {
        throw new Error('No authentication token found');
    }

    return fetchApi(endpoint, {
        ...options,
        headers: {
            ...options.headers,
            ...(token && !isPublicEndpoint && { 'Authorization': `Bearer ${token}` })
        }
    });
};

export const handleApiResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
    }
    
    return data;
};

export const getResetPasswordUrl = (email, token) => {
    return `${FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
}; 