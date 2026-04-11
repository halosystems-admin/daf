import React from 'react';
import { MessageSquareQuote } from 'lucide-react';

interface Props {
  query: string;
  subtle?: boolean;
}

export const EvidenceQueryCard: React.FC<Props> = ({ query, subtle }) => (
  <div
    className={`rounded-2xl border px-5 py-4 shadow-sm transition-colors ${
      subtle
        ? 'border-[#e2edf3] bg-white/80'
        : 'border-[#cfe3ef] bg-white'
    }`}
  >
    <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
      <MessageSquareQuote className="h-3.5 w-3.5 text-[#3294c7]" aria-hidden />
      Your question
    </div>
    <p className="text-[15px] font-medium leading-relaxed text-slate-800 md:text-base">{query}</p>
  </div>
);
