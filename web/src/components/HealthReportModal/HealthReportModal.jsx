import React, { useRef, useEffect } from 'react';
import { 
  FaTemperatureHigh,  
  FaWalking 
} from 'react-icons/fa';
import { WiHumidity, WiBarometer } from "react-icons/wi";
import { FaTimes, FaDownload, FaFileCsv } from 'react-icons/fa';
import { generateHealthReport } from '../../data/health-report-data';
import './HealthReportModal.css';

export default function HealthReportModal({ isOpen, onClose, userData, isDarkMode }) {
  if (!isOpen) return null;
  const modalRef = useRef(null);
  const report = generateHealthReport(userData);

  const iconMapping = {
    temperature: <FaTemperatureHigh size={32}/>,
    humidity: <WiHumidity size={32} />,
    pressure: <WiBarometer size={42} />,
    activityLevel: <FaWalking size={32}/>
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handlePdfDownload = () => {
    window.print();
  };

  const handleCsvDownload = () => {
    // Convert report data to CSV format
    const csvData = [
      ['Report ID', report.userInfo.reportId],
      ['Date', report.userInfo.date],
      ['Patient', report.userInfo.name],
      [''],
      ['Vital Statistics'],
      ['Metric', 'Average', 'Min', 'Max', 'Status'],
      ...Object.entries(report.vitals).map(([key, value]) => [
        key,
        value.average,
        value.min,
        value.max,
        value.status
      ]),
      [''],
      ['Environmental Metrics'],
      ['Metric', 'Average', 'Status'],
      ...Object.entries(report.environmentalMetrics).map(([key, value]) => [
        key,
        value.average,
        value.status
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and download CSV file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `health_report_${report.userInfo.reportId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="health-report-modal-overlay">
      <div ref={modalRef} className={`health-report-modal ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <div className="download-buttons">
            <button className="download-button pdf" onClick={handlePdfDownload}>
              <FaDownload /> PDF
            </button>
            <button className="download-button csv" onClick={handleCsvDownload}>
              <FaFileCsv /> CSV
            </button>
          </div>
        </div>

        <div className="report-content">
          <div className="report-header">
            <img src="/images/lifeguard-2.svg" alt="LifeGuard Logo" className="report-logo" />
            <div className="report-meta">
              <p>Report ID: {report.userInfo.reportId}</p>
              <p>Date: {report.userInfo.date}</p>
              <p>Patient: {report.userInfo.name}</p>
            </div>
          </div>

          <section className="report-section">
            <h2>Vital Statistics</h2>
            <div className="metrics-grid">
              {Object.entries(report.vitals).map(([key, value]) => (
                <div key={key} className="metric-card">
                  {iconMapping[key] || <FaTemperatureHigh />}
                  <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  <div className="metric-value">{value.average}</div>
                  <div className={`metric-status ${value.status.toLowerCase()}`}>
                    {value.status}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Similar sections for environmental and activity metrics */}
          
          <section className="report-section">
            <h2>Recommendations</h2>
            <ul className="recommendations-list">
              {report.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
} 