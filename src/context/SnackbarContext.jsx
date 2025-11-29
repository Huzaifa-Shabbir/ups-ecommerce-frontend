import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '../components/Snackbar/Snackbar';

const SnackbarContext = createContext(undefined);

export const SnackbarProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);

  const showSnackbar = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newSnackbar = { id, message, type, duration };
    
    console.log('Showing snackbar:', { message, type, id });
    setSnackbars(prev => {
      console.log('Current snackbars:', prev.length, 'Adding new one');
      return [...prev, newSnackbar];
    });
    
    return id;
  }, []);

  const removeSnackbar = useCallback((id) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return showSnackbar(message, 'success', duration);
  }, [showSnackbar]);

  const showError = useCallback((message, duration) => {
    return showSnackbar(message, 'error', duration);
  }, [showSnackbar]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, showSuccess, showError }}>
      {children}
      {/* Snackbar Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 items-end pointer-events-none" style={{ zIndex: 9999 }}>
        {snackbars.map((snackbar) => (
          <div key={snackbar.id} className="pointer-events-auto">
            <Snackbar
              message={snackbar.message}
              type={snackbar.type}
              duration={snackbar.duration}
              onClose={() => removeSnackbar(snackbar.id)}
            />
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};

