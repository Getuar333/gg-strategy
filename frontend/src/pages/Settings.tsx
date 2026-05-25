import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUser } from 'react-icons/fi';
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
    <div className="min-h-screen bg-[linear-gradient(145deg,#000_0%,#170024_48%,#050505_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 border-b border-white/10 pb-6">
        <p className="text-xl font-bold text-cyan-600/75">Profile</p>
        <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">Menagjoni profilit tuaj</p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel-glass max-w-2xl rounded-lg p-6"
      >
        {success && (
          <div className="mb-5 rounded-lg border border-emerald-300/35 bg-emerald-500/15 p-4 text-sm text-emerald-100">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-rose-400/35 bg-rose-950/45 p-4 text-sm text-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <FiUser className="h-4 w-4 text-pink-300" />
              Emri dhe Mbiemri juaj:
            </span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-fuchsia-300/20 bg-black/50 px-4 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <FiMail className="h-4 w-4 text-cyan-300" />
              Email adresa:
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-fuchsia-300/20 bg-black/50 px-4 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            />
          </label>

          <Button type="submit" loading={loading} size="lg" className="w-full">
            Ruaj Ndryshimet
          </Button>
        </form>
      </motion.section>
    </div>
  );
};

export default Settings;
