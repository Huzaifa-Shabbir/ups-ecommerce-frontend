import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/Form/FormInput';
import { SubmitButton } from '../../components/Form/SubmitButton';
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await register(formData.email, formData.username, formData.password);
      navigate('/login');
    } catch {
      // handled in context
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.brand}>
          <div className={styles.brandInner}>
            <div className={styles.logo}>⚡</div>
            <h2 className={styles.brandTitle}>Electrify</h2>
            <p className={styles.brandTag}>Create your Electrify account</p>
          </div>
        </aside>

        <main className={styles.formPanel}>
          <div className={styles.formWrap}>
            <h1 className={styles.title}>Create account</h1>
            <p className={styles.subtitle}>Join the Electrify network</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.globalError}>{error}</div>}

              <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={validationErrors.email} placeholder=" " required />
              <FormInput label="Username" type="text" name="username" value={formData.username} onChange={handleChange} error={validationErrors.username} placeholder=" " required />
              <FormInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={validationErrors.password} placeholder=" " required />
              <FormInput label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={validationErrors.confirmPassword} placeholder=" " required />

              <SubmitButton text="Create Account" isLoading={isLoading} />
            </form>

            <p className={styles.footerText}>
              Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;
