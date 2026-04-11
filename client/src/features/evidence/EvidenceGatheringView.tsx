import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { EVIDENCE_SOURCE_GROUPS, EVIDENCE_STATUS_LINES } from './evidenceConstants';

interface Props {
  active: boolean;
}

export const EvidenceGatheringView: React.FC<Props> = ({ active }) => {
  const [statusIndex, setStatusIndex] = useState(0);
  const [groupIndex, setGroupIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!active || reducedMotion) return;
    const id = window.setInterval(() => {
      setStatusIndex(i => (i + 1) % EVIDENCE_STATUS_LINES.length);
      setGroupIndex(i => (i + 1) % EVIDENCE_SOURCE_GROUPS.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [active, reducedMotion]);

  useEffect(() => {
    if (!active) {
      setStatusIndex(0);
      setGroupIndex(0);
    }
  }, [active]);

  return (
    <div
      className="mt-6 space-y-6"
      aria-busy={active}
      aria-live="polite"
      aria-label="Evidence search in progress"
    >
      <div className="rounded-2xl border border-[#e4edf3] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf6fb] text-[#3294c7]">
            <Activity className="h-5 w-5 motion-safe:animate-pulse" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Evidence gathering
            </p>
            <p
              key={statusIndex}
              className="mt-1.5 text-sm font-medium leading-snug text-slate-700"
            >
              {EVIDENCE_STATUS_LINES[statusIndex]}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Searching trusted source classes and synthesising a concise, evidence-informed view. This may take
              a short while for complex questions.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="list">
          {EVIDENCE_SOURCE_GROUPS.map((g, i) => {
            const isActive = reducedMotion ? i === 0 : i === groupIndex;
            return (
              <span
                key={g.id}
                role="listitem"
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-500 ${
                  isActive
                    ? 'border-[#7ec4e0] bg-[#eaf6fb] text-[#1a6f94] shadow-sm'
                    : 'border-slate-200/90 bg-white/90 text-slate-500'
                }`}
              >
                <span
                  className={`mr-2 h-1.5 w-1.5 rounded-full ${
                    isActive ? 'bg-emerald-400 motion-safe:animate-pulse' : 'bg-slate-300'
                  }`}
                  aria-hidden
                />
                {g.label}
              </span>
            );
          })}
        </div>

        <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Search trace</p>
          <ul className="space-y-2">
            {EVIDENCE_SOURCE_GROUPS.map((g, i) => (
              <li
                key={g.id}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs transition-colors ${
                  !reducedMotion && i === groupIndex
                    ? 'border-[#c5e4f3] bg-white text-slate-700'
                    : 'border-transparent bg-slate-50/80 text-slate-500'
                }`}
              >
                <span>{g.label}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  {!reducedMotion && i === groupIndex ? 'Scanning' : 'Queued'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
