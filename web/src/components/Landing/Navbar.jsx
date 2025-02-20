import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog, FaChartLine } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ isDarkMode, toggleTheme, isAuthenticated }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.reload();
    };

    const AuthButtons = () => (
        <>
            <Link to="/log-in" className="nav-button login" onClick={() => setIsMobileMenuOpen(false)}>
                Log In
            </Link>
            <Link to="/sign-up" className="nav-button signup" onClick={() => setIsMobileMenuOpen(false)}>
                Get Started
            </Link>
        </>
    );

    const ProfileDropdown = () => {
        const userName = localStorage.getItem('userName') || 'User';
        
        return (
            <div className="profile-dropdown-container" ref={dropdownRef}>
                <button 
                    className="profile-button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label="Toggle profile menu"
                >
                    <img 
                        src={`https://ui-avatars.com/api/?name=${userName}&background=random`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                    />
                </button>

                {isDropdownOpen && (
                    <div className="profile-dropdown">
                        <Link to="/dashboard" className="dropdown-item">
                            <FaChartLine /> Dashboard
                        </Link>
                        <Link to="/profile" className="dropdown-item">
                            <FaUser /> Profile
                        </Link>
                        <Link to="/settings" className="dropdown-item">
                            <FaCog /> Settings
                        </Link>
                        <button onClick={handleLogout} className="dropdown-item logout">
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="/images/lifeguard-2.svg" alt="LifeGuard" />
                </Link>

                <div className="navbar-right">
                    <button 
                        className="mobile-menu-button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                        <button onClick={() => scrollToSection('features')}>Features</button>
                        <button onClick={() => scrollToSection('how-it-works')}>How It Works</button>
                        <button onClick={() => scrollToSection('benefits')}>Benefits</button>
                        <button onClick={() => scrollToSection('download')}>Download</button>
                        {isAuthenticated ? <ProfileDropdown /> : <AuthButtons />}
                    </div>

                    <button className="theme-toggle" onClick={toggleTheme}>
                        {isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 