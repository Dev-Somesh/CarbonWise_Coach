import React from 'react';
import { UserProfile, CarbonFootprint, WeeklyChallenge, EmissionHistoryItem } from '../types';
import { useDashboardState } from '../hooks/useDashboardState';
import Achievements from './Achievements';
import MethodologyModal from './MethodologyModal';
import CalculationSources from './CalculationSources';
import DashboardToast from './dashboard/DashboardToast';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardTabNav from './dashboard/DashboardTabNav';
import DashboardOverviewTab from './dashboard/DashboardOverviewTab';
import QuickWinCard from './dashboard/QuickWinCard';
import WeeklyChallenges from './dashboard/WeeklyChallenges';
import CarbonSandbox from './dashboard/CarbonSandbox';
import CarbonHistory from './dashboard/CarbonHistory';

interface DashboardProps {
  profile: UserProfile;
  footprint: CarbonFootprint;
  challenges: WeeklyChallenge[];
  onToggleChallengeDay: (challengeId: string, dateStr: string) => void;
  history: EmissionHistoryItem[];
  onAddHistoryLog: (emissions: CarbonFootprint) => void;
  onClearHistory: () => void;
  onNavigateToCoach: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

export default function Dashboard({
  profile,
  footprint,
  challenges,
  onToggleChallengeDay,
  history,
  onAddHistoryLog,
  onClearHistory,
  onNavigateToCoach,
  onUpdateProfile,
}: DashboardProps) {
  const state = useDashboardState({
    profile,
    footprint,
    challenges,
    history,
    onAddHistoryLog,
    onUpdateProfile,
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-fade-in space-y-6">
      <DashboardToast message={state.successToast} />

      <DashboardHeader
        profile={profile}
        footprint={footprint}
        classification={state.classification}
        targetMultiplier={state.targetMultiplier}
        isSimulating={state.isSimulating}
        onOpenMethodology={() => state.setIsMethodologyModalOpen(true)}
        onGeneratePDF={state.handleGeneratePDFReport}
        onLogWeek={state.triggerSimulation}
        onShare={() => state.triggerToast('Temporary share link compiled! Shared to climate network.')}
      />

      <DashboardTabNav activeTab={state.activeTab} onTabChange={state.setActiveTab} />

      {state.activeTab === 'overview' && (
        <DashboardOverviewTab
          footprint={footprint}
          classification={state.classification}
          categoryPct={state.categoryPct}
          primaryCategory={state.primaryCategory}
          activeTip={state.activeTip}
          scoreViewMode={state.scoreViewMode}
          onViewModeChange={state.setScoreViewMode}
          onNavigateToCoach={onNavigateToCoach}
          onGoToTab={state.setActiveTab}
        />
      )}

      {state.activeTab === 'action' && (
        <div
          id="dashboard-panel-action"
          role="tabpanel"
          aria-labelledby="dashboard-tab-action"
          className="space-y-6 animate-fade-in"
        >
          <QuickWinCard
            primaryCategory={state.primaryCategory}
            activeTip={state.activeTip}
            hasCompleted={state.hasCompletedQuickWin}
            onComplete={state.handleCompleteQuickWin}
            onShuffle={state.handleShuffleTip}
          />
          <WeeklyChallenges
            challenges={challenges}
            currentWeekDays={state.currentWeekDays}
            onToggleDay={onToggleChallengeDay}
            onDayLogged={(display) => state.triggerToast(`Logged progress for ${display}! Keep up the amazing work!`)}
          />
        </div>
      )}

      {state.activeTab === 'tools' && (
        <div
          id="dashboard-panel-tools"
          role="tabpanel"
          aria-labelledby="dashboard-tab-tools"
          className="animate-fade-in"
        >
          <CarbonSandbox
            footprint={footprint}
            simTransportDistance={state.simTransportDistance}
            simTransportMethod={state.simTransportMethod}
            simDietType={state.simDietType}
            simCleanEnergy={state.simCleanEnergy}
            simulatedTotal={state.simulatedTotal}
            simulatedSavings={state.simulatedSavings}
            onDistanceChange={state.setSimTransportDistance}
            onTransportMethodChange={state.setSimTransportMethod}
            onDietTypeChange={state.setSimDietType}
            onCleanEnergyChange={state.setSimCleanEnergy}
            onApply={state.handleApplySimulatedParameters}
          />
        </div>
      )}

      {state.activeTab === 'progress' && (
        <div
          id="dashboard-panel-progress"
          role="tabpanel"
          aria-labelledby="dashboard-tab-progress"
          className="space-y-6 animate-fade-in"
        >
          <Achievements profile={profile} footprint={footprint} challenges={challenges} history={history} />
          <CarbonHistory
            history={history}
            onClearHistory={() => {
              onClearHistory();
              state.triggerToast('Logs cleared safely.');
            }}
            onDownloadJSON={state.handleDownloadJSON}
          />
          <CalculationSources />
        </div>
      )}

      <MethodologyModal
        isOpen={state.isMethodologyModalOpen}
        onClose={() => state.setIsMethodologyModalOpen(false)}
      />
    </div>
  );
}
