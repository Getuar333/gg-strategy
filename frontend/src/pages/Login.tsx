import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/axios';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page relative flex min-h-screen items-center justify-center px-4 py-10">
      <section className="auth-card relative z-10 w-full max-w-md rounded-[28px] p-7 sm:p-9">
        <div className="auth-heading mb-7 text-center">
          <p className="auth-brand mb-2 text-xs font-bold uppercase tracking-[0.28em]">G.G Strategy</p>
          <h1 className="text-3xl font-black tracking-tight">Mirë se vini përsëri</h1>
          <p className="mt-2 text-sm">Ju lutem shkruani të dhënat tuaja.</p>
        </div>

        {error && (
          <div className="auth-error mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm" role="alert">
            <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your email"
              />
            </span>
          </label>

          <label className="auth-label block">
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <span className="relative block">
              <FiLock className="auth-field-icon absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="auth-input h-12 w-full rounded-2xl border pl-11 pr-4 outline-none transition"
                placeholder="Enter your password"
              />
            </span>
          </label>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="auth-primary-button w-full">
            Kyçu
          </Button>
        </form>

        <div className="auth-divider mt-6 flex items-center gap-3 text-sm">
          <span className="h-px flex-1" />
          <span>New here?</span>
          <span className="h-px flex-1" />
        </div>

        <Link to="/register" className="auth-secondary-link mt-4 block">
          <Button type="button" variant="secondary" size="lg" className="auth-secondary-button w-full">Krijo Llogari</Button>
        </Link>
      </section>
    </main>
  );
};

export default LoginPage;
