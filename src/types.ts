export type TabType = 'mechanical' | 'electrical' | 'plumbing' | 'fire' | 'bulk';

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
