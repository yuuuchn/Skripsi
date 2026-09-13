import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    remove: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[999999] flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl shadow-xl backdrop-blur-xl border transition-all duration-300 animate-fade-in-down ${
                isSuccess
                  ? 'bg-white/95 dark:bg-slate-800/95 border-emerald-200/80 dark:border-emerald-800/60 text-slate-800 dark:text-slate-100 shadow-emerald-500/5'
                  : isError
                  ? 'bg-white/95 dark:bg-slate-800/95 border-rose-200/80 dark:border-rose-900/60 text-slate-800 dark:text-slate-100 shadow-rose-500/5'
                  : 'bg-white/95 dark:bg-slate-800/95 border-indigo-200/80 dark:border-indigo-800/60 text-slate-800 dark:text-slate-100 shadow-indigo-500/5'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isSuccess
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500'
                    : isError
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-500'
                    : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500'
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-4.5 h-4.5" />}
                {isError && <AlertCircle className="w-4.5 h-4.5" />}
                {!isSuccess && !isError && <Info className="w-4.5 h-4.5" />}
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs font-bold leading-snug">{t.message}</p>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
                title="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
