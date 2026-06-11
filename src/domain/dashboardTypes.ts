export type DashboardTab = 'overview' | 'action' | 'tools' | 'progress';

export type ScoreViewMode = 'gauge' | 'footprint';

export interface QuickWinTip {
  title: string;
  description: string;
  actionText: string;
}

export interface EmissionCategory {
  key: string;
  label: string;
  value: number;
}
