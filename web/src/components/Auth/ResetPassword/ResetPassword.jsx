import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaMoon, FaSun } from 'react-icons/fa';
import Button from '../../button/button';
import resetPasswordIllustration from '../../../assets/auth/reset-password.svg';
import { API_ENDPOINTS, fetchApi } from '../../../utils/api';
import { toast } from 'react-toastify';
import './ResetPassword.css';

export default function ResetPassword({ isDarkMode, toggleTheme }) {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get email and token from URL parameters instead of location state
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    useEffect(() => {
        if (!email || !token) {
            toast.error('Invalid reset password link');
            navigate('/forgot-password');
        }
    }, [email, token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await fetchApi(`${API_ENDPOINTS.RESET_PASSWORD}`, {
                method: 'POST',
                body: JSON.stringify({
                    email: searchParams.get('email'),
                    token: searchParams.get('token'),
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                })
            });
            
            toast.success('Password reset successful');
            navigate('/log-in');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`reset-password-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <div className="reset-password-illustration">
                <img src={resetPasswordIllustration} alt="Reset Password" />
            </div>

            <div className="reset-password-form-container">
                <div className="reset-password-form-card">
                    <img src="/images/lifeguard-2.svg" alt="lhp logo" className="logo" />
                    <h2 className="reset-password-heading">Reset Password</h2>
                    <p className="reset-password-subheading">
                        Please enter your new password
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                {!formData.newPassword && <FaLock className="input-icon" />}
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                    minLength={6}
                                />
                                <label htmlFor="newPassword">New Password</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                {!formData.confirmPassword && <FaLock className="input-icon" />}
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                    minLength={6}
                                />
                                <label htmlFor="confirmPassword">Confirm Password</label>
                            </div>
                        </div>

                        <Button 
                            text="Reset Password" 
                            isLoading={isLoading}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
} 