import React from 'react';
import styles from './FormInput.module.css';

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  placeholder = ' ',
  required,
}) => {
  return (
    <div className={styles.formGroup}>
      {/* floating input */}
      <div className={styles.floatingWrap}>
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          autoComplete="off"
        />
        <label htmlFor={name} className={styles.floatingLabel}>
          {label}{required && <span className={styles.required}>*</span>}
        </label>
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
