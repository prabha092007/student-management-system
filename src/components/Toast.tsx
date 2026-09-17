import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles: Record<ToastType, { bg: string; border: string; icon: ReactNode }> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/40',
    border: 'border-emerald-200 dark:border-emerald-700',
    icon: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/40',
    border: 'border-red-200 dark:border-red-700',
    icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/40',
    border: 'border-blue-200 dark:border-blue-700',
    icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  const showSuccess = useCallback((m: string) => add('success', m), [add]);
  const showError = useCallback((m: string) => add('error', m), [add]);
  const showInfo = useCallback((m: string) => add('info', m), [add]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => {
          const s = styles[toast.type];
          return (
            <div
              key={toast.id}
              className={`${s.bg} ${s.border} border rounded-xl px-4 py-3 shadow-lg flex items-start gap-3 animate-slide-in`}
            >
              <div className="flex-shrink-0 mt-0.5">{s.icon}</div>
              <p className="text-sm text-gray-800 dark:text-gray-100 flex-1 leading-relaxed">{toast.message}</p>
              <button
                onClick={() => remove(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
