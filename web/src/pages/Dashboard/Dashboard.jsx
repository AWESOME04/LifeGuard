import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTemperatureHigh, FaExclamationTriangle, FaChartLine, FaStickyNote, FaBluetooth, FaBluetoothB, FaRobot } from 'react-icons/fa';
import { IoFootstepsOutline } from "react-icons/io5";
import { MdCo2 } from "react-icons/md";
import { WiBarometer, WiHumidity, WiDust } from "react-icons/wi";
import { MdAir } from "react-icons/md";
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS, QUOTE_API_URL } from '../../utils/api';
import './Dashboard.css';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import Spinner from '../../components/Spinner/Spinner';
import FloatingHealthAssistant from '../../components/HealthAssistant/FloatingHealthAssistant';
import { Steps } from 'intro.js-react';
import { dashboardSteps } from '../../utils/tourSteps';
import { useBLE } from '../../contexts/BLEContext';

function Dashboard({ isDarkMode }) {
    const { bleDevice, isConnecting, sensorData, connectToDevice, disconnectDevice } = useBLE();
    const [quote, setQuote] = useState(null);
    const [userData, setUserData] = useState(null);
    const [savedMemos, setSavedMemos] = useState([]);
    const [memosLoading, setMemosLoading] = useState(true);
    const [quotesLoading, setQuotesLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);
    const [showDashboardTour, setShowDashboardTour] = useState(false);
    const dashboardRef = useRef(null);

    const [pollutionData, setPollutionData] = useState({
        temperature: 28.5,
        humidity: 65,
        pressure: 1013.25,
        steps: 1.2,
        aqi: 75,
        pm25: 15.2,
        pm10: 45.8,
        no2: 25.4
    });

    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: 'warning',
            message: 'High PM2.5 levels detected in your area',
            time: '2 hours ago'
        },
        {
            id: 2,
            type: 'info',
            message: 'Air quality has improved since yesterday',
            time: '5 hours ago'
        }
    ]);

    // Fetch data function
    const fetchData = async () => {
        try {
            setDataLoading(true);
            setMemosLoading(true);

            // Fetch user data and memos
            const [userData, memosData] = await Promise.all([
                fetchWithAuth(`${API_ENDPOINTS.GET_USER(localStorage.getItem('userId'))}`),
                fetchWithAuth(API_ENDPOINTS.MEMOS)
            ]);

            if (userData) {
                setUserData({
                    userName: userData.userName,
                    email: userData.email
                });
                localStorage.setItem('userName', userData.userName);
            }

            // Ensure memosData is an array
            setSavedMemos(Array.isArray(memosData) ? memosData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch user data');
            setSavedMemos([]);
        } finally {
            setDataLoading(false);
            setMemosLoading(false);
        }
    };

    // Fetch quote function
    const fetchQuoteData = async () => {
        try {
            setQuotesLoading(true);
            const response = await axios.get(QUOTE_API_URL);
            const quoteData = response.data[0];
            setQuote({
                quote: quoteData.q,
                author: quoteData.a
            });
        } catch (error) {
            console.error('Error fetching quote:', error);
            // toast.error('Failed to fetch quote');
        } finally {
            setQuotesLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchData();
        fetchQuoteData();
    }, []);

    // Tour initialization - only when coming from Help page
    useEffect(() => {
        const shouldShowTour = localStorage.getItem('showTour') === 'true';
        // Only show tour if explicitly set from Help page
        if (shouldShowTour && window.location.pathname === '/dashboard') {
            console.log('Starting tour from Help page redirect');
            setTimeout(() => {
                setShowDashboardTour(true);
            }, 1000);
        }
    }, []);

    const handleTourExit = () => {
        console.log('Tour exited');
        setShowDashboardTour(false);
        localStorage.removeItem('showTour');
    };

    // Update pollutionData when sensorData changes
    useEffect(() => {
        if (sensorData) {
            setPollutionData(prev => ({
                ...prev,
                temperature: sensorData.temperature || prev.temperature,
                humidity: sensorData.humidity || prev.humidity,
                pressure: sensorData.pressure || prev.pressure,
                co2: sensorData.co2 || prev.co2,
                gas: sensorData.gas || prev.gas
            }));
        }
    }, [sensorData]);

    // Safe value formatter
    const formatValue = (value, decimals = 1) => {
        return typeof value === 'number' ? value.toFixed(decimals) : '0.0';
    };

    const getAQIColor = (aqi) => {
        if (aqi <= 50) return '#00e400';
        if (aqi <= 100) return '#ffff00';
        if (aqi <= 150) return '#ff7e00';
        if (aqi <= 200) return '#ff0000';
        if (aqi <= 300) return '#8f3f97';
        return '#7e0023';
    };

    const getFirstName = (fullName) => {
        if (!fullName) return 'User';
        // If it's an email, show just the first part
        if (fullName.includes('@')) {
            return fullName.split('@')[0].charAt(0).toUpperCase() + 
                   fullName.split('@')[0].slice(1).toLowerCase();
        }
        // If it's a full name, show just the first name
        return fullName.split(' ')[0].charAt(0).toUpperCase() + 
               fullName.split(' ')[0].slice(1).toLowerCase();
    };

    return (
        <div ref={dashboardRef} className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <header className="dashboard-header">
                <h1>Welcome {dataLoading ? '...' : getFirstName(userData?.userName)}!</h1>
                <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <div className="dashboard-grid">
                <div className="dashboard-card temperature-card">
                    <h2><FaTemperatureHigh />Atmospheric Temperature</h2>
                    <div className="card-value">
                        {formatValue(pollutionData.temperature)}°C
                    </div>
                </div>

                <div className="dashboard-card humidity-card">
                    <h2><WiHumidity /> Humidity</h2>
                    <div className="card-value">
                        {formatValue(pollutionData.humidity, 0)}%
                    </div>
                </div>

                <div className="dashboard-card pressure-card">
                    <h2><WiBarometer /> Atmospheric Pressure</h2>
                    <div className="card-value">
                        {formatValue(pollutionData.pressure, 0)} hPa
                    </div>
                </div>

                <div className="dashboard-card wind-card">
                    <h2><IoFootstepsOutline /> Activities</h2>
                    <div className="card-value">
                        {formatValue(pollutionData.steps)} K steps
                    </div>
                </div>

                <div className="dashboard-card quote-card">
                    <h2><FaChartLine /> Daily Inspiration</h2>
                    {quotesLoading ? (
                        <Spinner size="medium" color={isDarkMode ? '#4285F4' : '#4285F4'} />
                    ) : (
                        <>
                            {quote ? `"${quote.quote}"` : 'Loading quote...'}
                            <br/>
                            {quote && `– ${quote.author}`}
                        </>
                    )}
                </div>

                <div className="dashboard-card reminders-card">
                    <h2><FaStickyNote /> Reminders</h2>
                    <div className="reminders-content">
                        {memosLoading ? (
                            <Spinner size="medium" color={isDarkMode ? '#4285F4' : '#4285F4'} />
                        ) : (
                            <ul className="reminders-list">
                                {savedMemos?.length === 0 ? (
                                    <li>No reminders at the moment</li>
                                ) : (
                                    savedMemos.slice(0, 3).map((memo) => (
                                        <li 
                                            key={memo.Id} 
                                            className={memo.Done ? 'done' : ''}
                                        >
                                            {memo.Text}
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                    <Link to="/sticky-notes" className="card-link">View All</Link>
                </div>

                <div className="dashboard-card aqi-card">
                    <h2><MdAir /> Air Quality Index</h2>
                    {dataLoading ? (
                        <Spinner size="medium" color={isDarkMode ? '#4285F4' : '#4285F4'} />
                    ) : (
                        <div className="card-value" style={{ color: getAQIColor(pollutionData.aqi) }}>
                            {formatValue(pollutionData.aqi, 0)} ppm
                        </div>
                    )}
                </div>

                <div className="dashboard-card pressure-card">
                    <h2><MdCo2 /> Carbon Dioxide (CO2)</h2>
                    <div className="card-value">
                        {formatValue(pollutionData.co2, 0)} ppm
                    </div>
                </div>

                <div className="dashboard-card pollutants-card">
                    <h2><WiDust /> Pollutants</h2>
                    <div className="pollutants-grid">
                        <div className="pollutant">
                            <span>PM2.5</span>
                            <span>{formatValue(pollutionData.pm25)} µg/m³</span>
                        </div>
                        <div className="pollutant">
                            <span>PM10</span>
                            <span>{formatValue(pollutionData.pm10)} µg/m³</span>
                        </div>
                        <div className="pollutant">
                            <span>NO₂</span>
                            <span>{formatValue(pollutionData.no2)} ppb</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-card alerts-section">
                <h2><FaExclamationTriangle /> Recent Alerts</h2>
                <div className="alerts-list">
                    {alerts.map(alert => (
                        <div key={alert.id} className={`alert-item ${alert.type}`}>
                            <div className="alert-message">{alert.message}</div>
                            <div className="alert-time">{alert.time}</div>
                        </div>
                    ))}
                </div>
            </div>

            <QuickAccess isDarkMode={isDarkMode} />
            
            <FloatingHealthAssistant isDarkMode={isDarkMode} />            

            <Steps
                enabled={showDashboardTour}
                steps={dashboardSteps}
                initialStep={0}
                onExit={handleTourExit}
                options={{
                    dontShowAgain: false,
                    tooltipClass: isDarkMode ? 'dark-mode' : '',
                    nextLabel: 'Next →',
                    prevLabel: '← Back',
                    doneLabel: 'Got it!',
                    showProgress: true,
                    showBullets: true,
                    overlayOpacity: isDarkMode ? 0.5 : 0.3,
                    exitOnOverlayClick: false,
                    exitOnEsc: false,
                    scrollToElement: true,
                    disableInteraction: false,
                    scrollPadding: 100,
                    positionPrecedence: ['bottom', 'top', 'right', 'left'],
                    highlightClass: isDarkMode ? 'introjs-highlight-dark' : 'introjs-highlight',
                    tooltipPosition: 'auto',
                    showStepNumbers: false
                }}
            />

            <div className="ble-connect-button">
                {isConnecting ? (
                    <button className="connect-btn loading" disabled>
                        <Spinner size="small" color="#fff" />
                        Connecting...
                    </button>
                ) : bleDevice ? (
                    <button 
                        className="connect-btn connected" 
                        onClick={disconnectDevice}
                    >
                        <FaBluetoothB />
                        Disconnect
                    </button>
                ) : (
                    <button 
                        className="connect-btn" 
                        onClick={connectToDevice}
                    >
                        <FaBluetooth />
                        Connect Device
                    </button>
                )}
            </div>
        </div>
    );
}

export default Dashboard;