import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaClock } from 'react-icons/fa';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import { toast } from 'react-toastify';
import Spinner from '../Spinner/Spinner';

const NotificationPreferences = ({ isDarkMode, onClose }) => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    reminderLeadTime: 15,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.USER_PREFERENCES.NOTIFICATIONS);
      const dbPrefs = response.data || {};
      setPreferences({
        emailNotifications: dbPrefs.EmailNotifications ?? true,
        reminderLeadTime: dbPrefs.ReminderLeadTime ?? 15,
      });
    } catch (error) {
      toast.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchWithAuth(API_ENDPOINTS.USER_PREFERENCES.NOTIFICATIONS, {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      toast.success('Preferences saved successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  // const handleTestEmail = async () => {
  //   setSaving(true);
  //   try {
  //     await fetchWithAuth(API_ENDPOINTS.USER_PREFERENCES.NOTIFICATIONS + '/test', {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         emailNotifications: true,
  //         reminderLeadTime: 5,
  //         medication: {
  //           Name: 'Demo Med',
  //           Dosage: '100mg',
  //           Time: [new Date(Date.now() + 1 * 60 * 1000).toTimeString().substring(0, 5)],
  //           Notes: 'This is a test notification.',
  //         },
  //       }),
  //     });
  //     toast.success('Test email triggered! Check your inbox.');
  //   } catch (error) {
  //     toast.error('Failed to send test email');
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Spinner size="medium" color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaBell className="text-blue-500" />
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Receive email reminders for your medications
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            id="emailNotifications"
            checked={preferences.emailNotifications}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                emailNotifications: e.target.checked,
              }))
            }
            className={`w-5 h-5 rounded border cursor-pointer ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-blue-500'
                : 'bg-white border-gray-300 text-blue-600'
            }`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaClock className="text-blue-500" />
            <div>
              <h3 className="font-medium">Reminder Lead Time</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Minutes before scheduled time
              </p>
            </div>
          </div>
          <select
            value={preferences.reminderLeadTime}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                reminderLeadTime: Number(e.target.value),
              }))
            }
            className={`rounded-lg px-3 py-2 border ${
              isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
            }`}
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-lg ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          Cancel
        </button>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      {/* <div className="flex items-center justify-between">
        <button
          onClick={handleTestEmail}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow"
          disabled={saving}
        >
          Send Test Email
        </button>
      </div> */}
    </div>
  );
};

export default NotificationPreferences;
