import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaMoon, FaSun } from 'react-icons/fa';
import Button from '../../button/button';
import forgotPasswordIllustration from '../../../assets/auth/forgot-password.svg';
import { API_ENDPOINTS, fetchApi } from '../../../utils/api';
import { toast } from 'react-toastify';
import './ForgotPassword.css';

export default function ForgotPassword({ isDarkMode, toggleTheme }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await fetchApi(API_ENDPOINTS.FORGOT_PASSWORD, {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            
            // Don't navigate, just show success message
            toast.success('Password reset instructions sent to your email');
        } catch (error) {
            toast.error(error.message || 'Failed to process request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`forgot-password-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <div className="forgot-password-illustration">
                <img src={forgotPasswordIllustration} alt="Forgot Password" />
            </div>

            <div className="forgot-password-form-container">
                <div className="forgot-password-form-card">
                    <img src="/images/lifeguard-2.svg" alt="lhp logo" className="logo" />
                    <h2 className="forgot-password-heading">Forgot Password?</h2>
                    <p className="forgot-password-subheading">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-icon-wrapper">
                                {!email && <FaEnvelope className="input-icon" />}
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>

                        <Button 
                            text="Send Reset Link" 
                            isLoading={isLoading}
                        />
                    </form>
                    
                    <p className="back-to-login">
                        Remember your password? <Link to="/log-in" className="link">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}