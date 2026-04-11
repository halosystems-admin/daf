import React, { useState } from 'react';
import { Loader2, Search, Sparkles } from 'lucide-react';
import type { EvidenceQueryResponse } from '../../../../shared/types';
import type { Patient } from '../../../../shared/types';
import { evidenceQuery } from '../../services/api';
import { getErrorMessage } from '../../utils/formatting';
import { EvidenceQueryCard } from './EvidenceQueryCard';
import { EvidenceGatheringView } from './EvidenceGatheringView';
import { EvidenceResultShell } from './EvidenceResultShell';

interface Props {
  patient: Patient | null;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type Phase = 'idle' | 'searching' | 'ready' | 'error';

export const EvidencePanel: React.FC<Props> = ({ patient, onToast }) => {
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [lastQuery, setLastQuery] = useState('');
  const [result, setResult] = useState<EvidenceQueryResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasPatient = Boolean(patient?.id);
  const searching = phase === 'searching';
  const canSubmit = input.trim().length > 0 && !searching;

  const submit = async () => {
    const q = input.trim();
    if (!q || searching) return;

    setLastQuery(q);
    setPhase('searching');
    setErrorMessage(null);
    setResult(null);

    try {
      const res = await evidenceQuery({
        query: q,
        patientId: patient?.id,
        patientName: patient?.name,
      });
      setResult(res);
      setPhase('ready');
      setInput('');
    } catch (err) {
      setPhase('error');
      setErrorMessage(getErrorMessage(err));
      onToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[linear-gradient(180deg,#fbfdff_0%,#f5fbfe_100%)]">
      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 pb-28 pt-6 md:px-8">
        <div className="mx-auto max-w-3xl">
          {phase === 'idle' && !lastQuery && (
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf6fb] text-[#3294c7] shadow-sm">
                <Sparkles className="h-6 w-6" aria-hidden />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-800">Evidence</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                Ask a clinical question. HALO will synthesise an evidence-informed view with transparent sources.
              </p>
            </div>
          )}

          {lastQuery && <EvidenceQueryCard query={lastQuery} subtle={phase === 'ready'} />}

          {searching && <EvidenceGatheringView active />}

          {phase === 'error' && errorMessage && (
            <div
              className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-800"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {phase === 'ready' && result && (
            <EvidenceResultShell data={result} hasPatient={hasPatient} />
          )}
        </div>
      </div>

      <div className="border-t border-[#e6eff5] bg-white/95 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <label htmlFor="evidence-input" className="sr-only">
            Clinical question
          </label>
          <textarea
            id="evidence-input"
            rows={2}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
            disabled={searching}
            placeholder={
              hasPatient
                ? 'Ask an evidence question (patient context will be included when relevant)…'
                : 'Ask an evidence question…'
            }
            className="w-full resize-none rounded-2xl border border-[#d8e7ef] bg-white px-4 py-3 text-sm text-slate-800 shadow-inner outline-none ring-0 transition placeholder:text-slate-400 focus:border-[#7ec4e0] focus:ring-2 focus:ring-[#b8dff0]/60 disabled:opacity-60"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400">
              {hasPatient ? (
                <>
                  Patient: <span className="font-medium text-slate-600">{patient?.name}</span>
                </>
              ) : (
                'No patient selected — answers are general evidence only.'
              )}
            </p>
            <button
              type="button"
              onClick={() => void submit()}
              disabled={!canSubmit}
              className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center gap-2 rounded-2xl bg-[#3f9fcc] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3589b3] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {searching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Searching
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" aria-hidden />
                  Search evidence
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
