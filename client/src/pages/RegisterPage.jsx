import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const inputCls =
  'w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '6+ characters', pass: password.length >= 6 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="flex items-center gap-3 mt-2">
      {checks.map(({ label, pass }) => (
        <div key={label} className={`flex items-center gap-1 text-[11px] font-medium ${pass ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          <CheckCircle className={`w-3 h-3 ${pass ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
          {label}
        </div>
      ))}
    </div>
  );
};

export const RegisterPage = () => {
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Full name must be at least 2 characters.';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = 'Please enter a valid email address.';
    if (!form.password || form.password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    const result = await register(form);
    if (!result.error) {
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-white">TaskFlow</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Join your team on<br />
            <span className="text-indigo-300">TaskFlow</span>
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-sm">
            Create your account to start managing tasks, collaborating with your team, and shipping projects on time.
          </p>
          <div className="mt-8 space-y-3">
            {['Register in seconds', 'Assign and track tasks', 'Real-time dashboard analytics', 'Priority & status tracking'].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right registration form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                Create your account
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Fill in the details to get started for free
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-5 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="reg-name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputCls}
                />
                {formErrors.name && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="reg-email">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputCls}
                />
                {formErrors.email && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="reg-password">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={`${inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
                {formErrors.password && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="reg-confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={inputCls}
                />
                {formErrors.confirmPassword && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
