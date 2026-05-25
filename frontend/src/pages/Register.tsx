import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiCheck, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/axios';
import Button from '../components/Button';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordsMatch = formData.confirmPassword === '' || formData.password === formData.confirmPassword;
  const passwordMeetsRules = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!passwordMeetsRules) {
      setError('Password must be at least 8 characters, 1 uppercase letter, 1 number.');
      return;
    }

    setLoading(true);

    try {
      await register(formData.fullName, formData.email, formData.password, formData.confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-floral-bg relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-black/75" />

      <section className="panel-glass relative z-10 w-full max-w-lg rounded-lg p-7 sm:p-8">
        <div className="mb-7 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-slate-500">G.G Strategy</p>
          <h1 className="text-red-300 text-3xl font-black tracking-tight">Krijo Llogari</h1>
          <p className="mt-3 text-sm text-slate-300">Filloni të planifikoni me një qendër komande të qartë dhe të ngjyra.</p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-rose-400/35 bg-rose-950/45 p-4 text-sm text-rose-100">
            <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">Emri dhe Mbiemri</span>
            <span className="relative block">
              <FiUser className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-lg border border-fuchsia-300/20 bg-black/50 pl-11 pr-4 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                placeholder="Shkruani emrin dhe mbiemrin tuaj këtu"
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">Email</span>
            <span className="relative block">
              <FiMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-lg border border-fuchsia-300/20 bg-black/50 pl-11 pr-4 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                placeholder="Shkruani adresën e emailit tuaj"
              />
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Fjalëkalimi</span>
              <span className="relative block">
                <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-12 w-full rounded-lg border border-fuchsia-300/20 bg-black/50 pl-11 pr-4 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                  placeholder="Minimumi 8 karaktere"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Konfirmo Fjalëkalimin</span>
              <span className="relative block">
                <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`h-12 w-full rounded-lg border bg-black/50 pl-11 pr-10 text-white outline-none transition focus:ring-2 ${
                    passwordsMatch
                      ? 'border-fuchsia-300/20 focus:border-cyan-300 focus:ring-cyan-300/20'
                      : 'border-rose-400 focus:border-rose-300 focus:ring-rose-300/20'
                  }`}
                  placeholder="Përsërit fjalëkalimin"
                />
                {formData.confirmPassword && passwordsMatch && (
                  <FiCheck className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-300" />
                )}
              </span>
            </label>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Krijo Llogari
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
          <span className="h-px flex-1 bg-white/10" />
          <span>Already registered?</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <Link to="/login" className="mt-4 block">
          <Button type="button" variant="secondary" size="lg" className="w-full">
            Kyçuni
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default RegisterPage;
