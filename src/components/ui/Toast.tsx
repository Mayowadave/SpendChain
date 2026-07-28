import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'success',
  title,
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/40',
    error: 'border-rose-500/30 bg-rose-950/40',
    info: 'border-blue-500/30 bg-blue-950/40',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 max-w-sm animate-fade-in ${borders[type]}`}>
      {icons[type]}

      <div className="flex-1 space-y-0.5">
        <h5 className="text-xs font-bold text-white">{title}</h5>
        {message && <p className="text-[11px] text-gray-300 leading-normal">{message}</p>}
      </div>

      <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
