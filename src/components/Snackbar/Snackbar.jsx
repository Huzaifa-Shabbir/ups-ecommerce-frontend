import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Snackbar = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-600' : 'bg-green-600';
  const borderColor = isError ? 'border-red-700' : 'border-green-700';
  const icon = isError ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />;

  return (
    <div
      className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl border-2 ${borderColor} flex items-center space-x-3 min-w-[300px] max-w-md snackbar-animate`}
      role="alert"
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Snackbar;

