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
    <main className="auth-page relative flex min-h-screen items-center justify-center px-4 py-10">
      <section className="auth-card relative z-10 w-full max-w-lg rounded-[28px] p-7 sm:p-9">
        <div className="auth-heading mb-7 text-center">
          <p className="auth-brand mb-2 text-xs font-bold uppercase tracking-[0.28em]">G.G Strategy</p>
          <h1 className="text-3xl font-black tracking-tight">Krijo llogari</h1>
          <p className="mt-3 text-sm">Filloni të planifikoni me një qendër komande të qartë dhe me ngjyra.</p>
        </div>

        {error && (
          <div className="auth-error mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm" role="alert">
            <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="auth-label block">
            <span className="mb-2 block text-sm font-semibold">Emri dhe Mbiemri</span>
            <span className="relative block">
              <FiUser className="auth-field-icon absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="auth-input h-12 w-full rounded-2xl border pl-11 pr-4 outline-none transition"
                placeholder="Shkruani emrin dhe mbiemrin tuaj këtu"
              />
            </span>
          </label>

          <label className="auth-label block">
            <span className="mb-2 block text-sm font-semibold">Email</span>
            <span className="relative block">
              <FiMail className="auth-field-icon absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input h-12 w-full rounded-2xl border pl-11 pr-4 outline-none transition"
                placeholder="Shkruani adresën e emailit tuaj"
              />
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="auth-label block">
              <span className="mb-2 block text-sm font-semibold">Fjalëkalimi</span>
              <span className="relative block">
                <FiLock className="auth-field-icon absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="auth-input h-12 w-full rounded-2xl border pl-11 pr-4 outline-none transition"
                  placeholder="Minimumi 8 karaktere"
                />
              </span>
            </label>
            <label className="auth-label block">
              <span className="mb-2 block text-sm font-semibold">Konfirmo Fjalëkalimin</span>
              <span className="relative block">
                <FiLock className="auth-field-icon absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`auth-input h-12 w-full rounded-2xl border pl-11 pr-10 outline-none transition ${passwordsMatch ? '' : 'is-invalid'}`}
                  placeholder="Përsërit fjalëkalimin"
                />
                {formData.confirmPassword && passwordsMatch && (
                  <FiCheck className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-300" />
                )}
              </span>
            </label>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="auth-primary-button w-full">
            Krijo Llogari
          </Button>
        </form>

        <div className="auth-divider mt-6 flex items-center gap-3 text-sm">
          <span className="h-px flex-1" />
          <span>Already registered?</span>
          <span className="h-px flex-1" />
        </div>

        <Link to="/login" className="auth-secondary-link mt-4 block">
          <Button type="button" variant="secondary" size="lg" className="auth-secondary-button w-full">Kyçuni</Button>
        </Link>
      </section>
    </main>
  );
};

export default RegisterPage;
