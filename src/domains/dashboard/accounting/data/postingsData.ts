import { OPENING_BALANCES } from './openingBalances';
import { generateActivityPostings } from './postingsGenerator';
import { Posting } from '../types/posting';

// Computed once at module load, from the real current date — not a hardcoded
// "today" — so this data spans 1 Jan 2026 through whenever the app actually
// happens to be opened, and regenerates correctly on every reload.
export const DUMMY_POSTINGS: Posting[] = [...OPENING_BALANCES, ...generateActivityPostings(new Date())];

export const EMPTY_POSTINGS: Posting[] = [];
