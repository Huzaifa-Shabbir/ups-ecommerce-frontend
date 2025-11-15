import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/Form/FormInput';
import { SubmitButton } from '../../components/Form/SubmitButton';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, user } = useAuth();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.identifier) errors.identifier = 'Email or username is required';
    if (!formData.password) errors.password = 'Password is required';
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
      await login(formData.identifier, formData.password);
      navigate('/dashboard');
    } catch {
      // error handled by context
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.brand}>
          <div className={styles.brandInner}>
            <div className={styles.logo}>⚡</div>
            <h2 className={styles.brandTitle}>Electrify</h2>
            <p className={styles.brandTag}>UPS e‑commerce — fast. safe. green.</p>
            <div className={styles.hero}>{/* optional illustrative svg background via CSS */}</div>
          </div>
        </aside>

        <main className={styles.formPanel}>
          <div className={styles.formWrap}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to your Electrify account</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.globalError}>{error}</div>}

              <FormInput
                label="Email or Username"
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                error={validationErrors.identifier}
                placeholder=" "
                required
              />

              <FormInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={validationErrors.password}
                placeholder=" "
                required
              />

              <div className={styles.row}>
                <label className={styles.remember}>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className={styles.forgot}>Forgot?</Link>
              </div>

              <SubmitButton text="Sign In" isLoading={isLoading} />
            </form>

            <p className={styles.footerText}>
              New to Electrify? <Link to="/register" className={styles.link}>Create an account</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
