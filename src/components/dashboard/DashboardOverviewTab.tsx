import { Sparkles, Target } from 'lucide-react';
import type { CarbonFootprint } from '../../types';
import CarbonFootprintArt from '../CarbonFootprintArt';
import PeerComparison from '../PeerComparison';
import CarbonScoreGauge from './CarbonScoreGauge';
import EmissionsBreakdown from './EmissionsBreakdown';
import QuickWinCard from './QuickWinCard';
import type { DashboardTab, EmissionCategory, QuickWinTip, ScoreViewMode } from '../../types';

interface Classification {
  label: string;
  description: string;
  color: string;
}

interface DashboardOverviewTabProps {
  footprint: CarbonFootprint;
  classification: Classification;
  categoryPct: { transport: number; diet: number; energy: number; shopping: number };
  primaryCategory: EmissionCategory;
  activeTip: QuickWinTip;
  scoreViewMode: ScoreViewMode;
  onViewModeChange: (mode: ScoreViewMode) => void;
  onNavigateToCoach: () => void;
  onGoToTab: (tab: DashboardTab) => void;
}

export default function DashboardOverviewTab({
  footprint,
  classification,
  categoryPct,
  primaryCategory,
  activeTip,
  scoreViewMode,
  onViewModeChange,
  onNavigateToCoach,
  onGoToTab,
}: DashboardOverviewTabProps) {
  return (
    <div
      id="dashboard-panel-overview"
      role="tabpanel"
      aria-labelledby="dashboard-tab-overview"
      className="space-y-6 animate-fade-in"
    >
      <QuickWinCard
        variant="teaser"
        primaryCategory={primaryCategory}
        activeTip={activeTip}
        onTeaserClick={() => onGoToTab('action')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scoreViewMode === 'footprint' ? (
          <CarbonFootprintArt
            footprintTotal={footprint.total}
            scoreViewMode={scoreViewMode}
            setScoreViewMode={onViewModeChange}
            compact
          />
        ) : (
          <CarbonScoreGauge
            footprintTotal={footprint.total}
            classification={classification}
            scoreViewMode={scoreViewMode}
            onViewModeChange={onViewModeChange}
          />
        )}

        <EmissionsBreakdown footprint={footprint} categoryPct={categoryPct} />
      </div>

      <PeerComparison footprint={footprint} />

      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
        <div className="flex items-start gap-3 flex-1">
          <Target className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-emerald-900">Ready for personalised advice?</p>
            <p className="text-xs text-emerald-700/80 mt-0.5">Smart Coach analyses your profile and suggests next steps.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateToCoach}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Open Smart Coach
        </button>
      </div>
    </div>
  );
}
