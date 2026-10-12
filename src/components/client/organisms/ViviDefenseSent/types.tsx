import type { DefenseResponse } from '@/lib/vivi/types';
export type DefenseSentProps = Partial<DefenseResponse> & { caseNumber: string; token?: string; onVolver?: () => void };
