import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiMail, FiShield, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/axios';
import { authService } from '../services/api';
import Button from '../components/Button';

const Settings: React.FC = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
    });
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await authService.updateProfile(formData.fullName, formData.email);
      setUser(updatedUser);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update profile.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page min-h-screen px-4 py-7 sm:px-6 lg:px-8">
      <header className="settings-heading">
        <div className="settings-heading-mark"><FiUser /></div>
        <div>
          <h1>Your profile</h1>
          <p>Your account details.</p>
        </div>
      </header>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="settings-card">
        <div className="settings-card-heading">
          <div className="settings-avatar">{(user?.fullName || 'U').trim().charAt(0).toUpperCase()}</div>
          <span className="settings-secure-badge"><FiShield />Statusi - Private</span>
        </div>
        {success && (
          <div className="settings-feedback settings-feedback--success">
            <FiCheckCircle />
            {success}
          </div>
        )}

        {error && (
          <div className="settings-feedback settings-feedback--error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="settings-form">
          <label className="settings-field">
            <span>
              <FiUser />
              Emri dhe Mbiemri juaj:
            </span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="settings-input"
            />
          </label>

          <label className="settings-field">
            <span>
              <FiMail />
              Email adresa:
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="settings-input"
            />
          </label>

          <Button type="submit" loading={loading} size="lg" className="settings-save-button">
            Ruaj Ndryshimet
          </Button>
        </form>
      </motion.section>
    </div>
  );
};

export default Settings;
