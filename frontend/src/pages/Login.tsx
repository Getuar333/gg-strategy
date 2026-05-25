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
    <main className="dashboard-floral-bg relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-black/75" />

      <section className="panel-glass relative z-10 w-full max-w-md rounded-lg p-7 sm:p-8">
        <div className="mb-7 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-slate-500">G.G Strategy</p>
          <h1 className="text-red-300 text-3xl font-black tracking-tight">Mire se vini perseri</h1>
          <p className="mt-2 text-sm text-slate-500">Ju lutem shkruani të dhënat tuaja!</p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-rose-400/35 bg-rose-950/45 p-4 text-sm text-rose-100">
            <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your email"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">Password</span>
            <span className="relative block">
              <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-lg border border-fuchsia-300/20 bg-black/50 pl-11 pr-4 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                placeholder="Enter your password"
              />
            </span>
          </label>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Kyçu
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
          <span className="h-px flex-1 bg-white/10" />
          <span>New here?</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <Link to="/register" className="mt-4 block">
          <Button type="button" variant="secondary" size="lg" className="w-full">Krijo Llogari</Button>
        </Link>
      </section>
    </main>
  );
};

export default LoginPage;
