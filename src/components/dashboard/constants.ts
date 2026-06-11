import type { ElementType } from 'react';
import { LayoutGrid, Sparkles, TrendingDown, Zap } from 'lucide-react';
import type { DashboardTab } from '../../types';

export interface DashboardTabConfig {
  id: DashboardTab;
  label: string;
  icon: ElementType;
  hint: string;
}

export const DASHBOARD_TABS: DashboardTabConfig[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid, hint: 'Score & benchmarks' },
  { id: 'action', label: 'Take Action', icon: Zap, hint: 'Quick wins & habits' },
  { id: 'tools', label: 'Simulator', icon: Sparkles, hint: 'What-if modeling' },
  { id: 'progress', label: 'Progress', icon: TrendingDown, hint: 'History & badges' },
];
