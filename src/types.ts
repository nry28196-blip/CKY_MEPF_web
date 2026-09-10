export type TabType = 'mechanical' | 'electrical' | 'plumbing' | 'fire' | 'bulk' | 'cost';

export interface HistoryItem {
  id: string;
  timestamp: string;
  tab: TabType;
  subType?: string; // e.g. 'ductSizing' or 'cooling'
  title: string;
  summary: string; // Short string showing main results
  parameters: any;
  notes?: string;
}

export enum AuditStatus {
  INPUT_VERIFIED = 'INPUT_VERIFIED',
  INPUT_NOT_VERIFIED = 'INPUT_NOT_VERIFIED',
  DERIVED = 'DERIVED',
  PASS = 'PASS',
  FAIL = 'FAIL',
  BLOCKED = 'BLOCKED',
  ESTIMATED = 'ESTIMATED'
}
