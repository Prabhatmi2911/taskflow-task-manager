import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../common/Spinner';
import styles from './LoginPage.module.css'; // reuse same styles

export default function RegisterPage() {
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) {
      errs.username = 'Username is required';
    } else if (form.username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      // Map backend field errors if present
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
      }
      setServerError(result.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={styles.brandName}>TaskFlow</h1>
        </div>

        <h2 className={styles.title}>Create account</h2>
        <p className={styles.subtitle}>Sign up to start managing your tasks</p>

        {serverError && (
          <div className={styles.errorBanner} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Username */}
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username" name="username" type="text"
              value={form.username} onChange={handleChange}
              placeholder="Choose a username"
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              autoFocus
            />
            {errors.username && <p className={styles.fieldError}>{errors.username}</p>}
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="Enter your email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            />
            {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password" name="password" type="password"
              value={form.password} onChange={handleChange}
              placeholder="At least 6 characters"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            />
            {errors.password && <p className={styles.fieldError}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword" name="confirmPassword" type="password"
              value={form.confirmPassword} onChange={handleChange}
              placeholder="Re-enter your password"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
            />
            {errors.confirmPassword && <p className={styles.fieldError}>{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <><Spinner size="sm" color="white" /> Creating account…</>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Link to login */}
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}