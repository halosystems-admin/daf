import type { EvidenceSourceType } from '../../../../shared/types';

export const EVIDENCE_STATUS_LINES = [
  'Searching guidelines and consensus statements',
  'Reviewing primary literature',
  'Checking drug and safety sources',
  'Comparing relevant studies',
  'Ranking the most applicable evidence',
  'Synthesising a balanced answer',
  'Tailoring evidence to clinical context',
] as const;

export const EVIDENCE_SOURCE_GROUPS = [
  { id: 'guidelines', label: 'Guidelines' },
  { id: 'pubmed', label: 'PubMed & trials' },
  { id: 'drug', label: 'Drug & safety' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'public_health', label: 'Public health' },
] as const;

export const SOURCE_TYPE_LABEL: Record<EvidenceSourceType, string> = {
  guideline: 'Guideline',
  trial: 'Trial',
  review: 'Review',
  drug_label: 'Drug label',
  public_health: 'Public health',
  other: 'Source',
};
