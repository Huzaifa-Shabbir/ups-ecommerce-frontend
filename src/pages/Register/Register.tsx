import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/Form/FormInput';
import { SubmitButton } from '../../components/Form/SubmitButton';
import styles from './Register.module.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email';

    if (!formData.username) errors.username = 'Username is required';
    else if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters';

    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

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
      await register(formData.email, formData.username, formData.password);
      navigate('/login');
    } catch {
      // Error is handled by context
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join Electrify today</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.globalError}>{error}</div>}

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
            placeholder="you@example.com"
            required
          />

          <FormInput
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={validationErrors.username}
            placeholder="johndoe"
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

          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={validationErrors.confirmPassword}
            placeholder="••••••••"
            required
          />

          <SubmitButton text="Create Account" isLoading={isLoading} />
        </form>

        <div className={styles.footer}>
          <p>Already have an account? <Link to="/login" className={styles.link}>Login</Link></p>
        </div>
      </div>
    </div>
  );
};
