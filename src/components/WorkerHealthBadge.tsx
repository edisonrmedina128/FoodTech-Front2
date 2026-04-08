import { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';

const WORKER_URL = import.meta.env.VITE_WORKER_HEALTH_URL || 'http://localhost:8081';
const POLL_INTERVAL = 10_000;

type HealthStatus = 'UP' | 'WARN' | 'DOWN' | 'UNKNOWN';

interface WorkerHealth {
  status: HealthStatus;
  details?: {
    pendingEvents?: number;
    failedEvents?: number;
    lastProcessedAt?: string;
  };
}

async function fetchHealth(): Promise<WorkerHealth> {
  const res = await fetch(`${WORKER_URL}/actuator/health`, { signal: AbortSignal.timeout(4000) });
  const data = await res.json();
  const details = data.components?.worker?.details ?? {};
  return { status: data.status as HealthStatus, details };
}

const STATUS_STYLE: Record<HealthStatus, { dot: string; text: string; label: string }> = {
  UP:      { dot: 'bg-emerald-400', text: 'text-emerald-400', label: 'Worker UP' },
  WARN:    { dot: 'bg-yellow-400 animate-pulse', text: 'text-yellow-400', label: 'Worker WARN' },
  DOWN:    { dot: 'bg-red-500 animate-pulse', text: 'text-red-400', label: 'Worker DOWN' },
  UNKNOWN: { dot: 'bg-silver-text/50', text: 'text-silver-text', label: 'Worker ?' },
};

export function WorkerHealthBadge() {
  const [health, setHealth] = useState<WorkerHealth>({ status: 'UNKNOWN' });
  const [showTooltip, setShowTooltip] = useState(false);
  const prevStatus = useRef<HealthStatus>('UNKNOWN');
  const initialized = useRef(false);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      const next = await fetchHealth().catch(() => ({ status: 'UNKNOWN' as HealthStatus }));
      setHealth(next);

      const prev = prevStatus.current;
      const cur = next.status;

      // Only notify on real transitions after first load
      if (initialized.current && prev !== cur) {
        if (cur === 'DOWN' || (cur === 'UNKNOWN' && prev !== 'UNKNOWN')) {
          toast.error('Worker caído — los eventos quedan en cola');
        } else if (cur === 'WARN') {
          toast.warn('Worker en alerta: eventos fallidos acumulados');
        } else if (cur === 'UP' && (prev === 'DOWN' || prev === 'UNKNOWN')) {
          toast.success('Worker recuperado y procesando eventos');
        }
      }

      prevStatus.current = cur;
      initialized.current = true;
    };

    load();
    const id = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(id);
  // toast is stable (useCallback), safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s = STATUS_STYLE[health.status];
  const d = health.details;

  return (
    <div className="relative flex items-center" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
        <span className={`size-2 rounded-full ${s.dot}`} />
        <span className={`text-xs font-semibold hidden md:inline ${s.text}`}>{s.label}</span>
      </button>

      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-charcoal border border-white/10 rounded-xl p-4 shadow-2xl z-50 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-silver-text mb-3">Worker Health</p>
          <div className="space-y-2">
            <Row label="Status" value={health.status} valueClass={s.text} />
            {d?.pendingEvents !== undefined && <Row label="Pending" value={String(d.pendingEvents)} />}
            {d?.failedEvents  !== undefined && <Row label="Failed"  value={String(d.failedEvents)} valueClass={d.failedEvents > 0 ? 'text-red-400' : 'text-emerald-400'} />}
            {d?.lastProcessedAt && (
              <Row label="Último proceso" value={new Date(d.lastProcessedAt).toLocaleTimeString()} />
            )}
          </div>
          <p className="text-[9px] text-silver-text/50 mt-3">Se actualiza cada 10s</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, valueClass = 'text-white-text' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-silver-text">{label}</span>
      <span className={`text-[11px] font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
