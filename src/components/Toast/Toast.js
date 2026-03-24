import React from 'react';
import { useApp } from '../../context/AppContext';
import './Toast.css';

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{t.type === 'error' ? '⚠' : '✓'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
