import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/Form/FormInput';
import { SubmitButton } from '../../components/Form/SubmitButton';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, user } = useAuth();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.identifier) errors.identifier = 'Email or username is required';
    if (!formData.password) errors.password = 'Password is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData.identifier, formData.password);
      navigate('/');
    } catch {
      // Error is handled by context
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Login to Electrify</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.globalError}>{error}</div>}

          <FormInput
            label="Email or Username"
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            error={validationErrors.identifier}
            placeholder="you@example.com or username"
            required
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={validationErrors.password}
            placeholder="••••••••"
            required
          />

          <div className={styles.rememberForgot}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className={styles.link}>Forgot password?</Link>
          </div>

          <SubmitButton text="Login" isLoading={isLoading} />
        </form>

        <div className={styles.footer}>
          <p>Don't have an account? <Link to="/register" className={styles.link}>Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};
