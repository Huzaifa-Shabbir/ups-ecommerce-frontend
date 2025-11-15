import styles from './FormInput.module.css';

export const FormInput = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  placeholder,
  required,
}) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
