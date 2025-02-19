import React from 'react';
import Navbar from '../../components/Landing/Navbar';
import Hero from '../../components/Landing/Hero';
import Features from '../../components/Landing/Features';
import HowItWorks from '../../components/Landing/HowItWorks';
import Benefits from '../../components/Landing/Benefits';
import DownloadSection from '../../components/Landing/DownloadSection';
import Footer from '../../components/Landing/Footer';
import './LandingPage.css';

const LandingPage = ({ isDarkMode, toggleTheme }) => {
    return (
        <div className={`landing-page ${isDarkMode ? 'dark-mode' : ''}`}>
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <section id="hero">
                <Hero />
            </section>
            <section id="features">
                <Features />
            </section>
            <section id="how-it-works">
                <HowItWorks />
            </section>
            <section id="benefits">
                <Benefits />
            </section>
            <section id="download">
                <DownloadSection />
            </section>
            <Footer />
        </div>
    );
};

export default LandingPage; 