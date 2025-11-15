import styles from './SubmitButton.module.css';

export const SubmitButton = ({
  text,
  isLoading,
  disabled,
  type = 'submit',
  onClick,
}) => {
  return (
    <button
      type={type}
      className={styles.button}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <span className={styles.spinner} /> : text}
    </button>
  );
};
