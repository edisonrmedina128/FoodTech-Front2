import { useToasts, type Toast, type ToastType } from '../contexts/ToastContext';

const ICON: Record<ToastType, string> = {
  success: 'check_circle',
  error:   'error',
  warn:    'warning',
  info:    'info',
};

const COLOR: Record<ToastType, { border: string; icon: string; bar: string }> = {
  success: { border: 'border-emerald-500/40', icon: 'text-emerald-400', bar: 'bg-emerald-400' },
  error:   { border: 'border-red-500/40',     icon: 'text-red-400',     bar: 'bg-red-400'     },
  warn:    { border: 'border-yellow-500/40',  icon: 'text-yellow-400',  bar: 'bg-yellow-400'  },
  info:    { border: 'border-primary/40',     icon: 'text-primary',     bar: 'bg-primary'     },
};

function ToastItem({ toast }: { toast: Toast }) {
  const c = COLOR[toast.type];
  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative overflow-hidden flex items-start gap-3 bg-charcoal/95 border ${c.border} 
                  text-white-text text-sm rounded-xl px-4 py-3 shadow-2xl backdrop-blur
                  animate-[slideIn_0.2s_ease-out]`}
    >
      <span className={`material-symbols-outlined text-lg mt-0.5 shrink-0 ${c.icon}`}>
        {ICON[toast.type]}
      </span>
      <span className="leading-snug">{toast.message}</span>
      {/* progress bar */}
      <span
        className={`absolute bottom-0 left-0 h-[2px] ${c.bar} opacity-50`}
        style={{ animation: 'shrinkBar 4s linear forwards' }}
      />
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToasts();
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shrinkBar {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-80 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </>
  );
}
