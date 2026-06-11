import { useState } from 'react';
import type {
  UserProfile,
  CarbonFootprint,
  WeeklyChallenge,
  EmissionHistoryItem,
  CommuteMethod,
  DietType,
  CleanEnergyType,
} from '../types';
import {
  getEmissionsClassification,
  calculateTransportEmissions,
  calculateDietEmissions,
  calculateEnergyEmissions,
} from '../utils/carbonCalculator';
import { GLOBAL_BENCHMARKS } from '../utils/presets';
import { getPrimaryEmissionCategory, getCategoryPercentages } from '../utils/footprintBreakdown';
import { getCurrentWeekDays } from '../utils/weekDays';
import { generateCarbonReport } from '../utils/pdfGenerator';
import type { DashboardTab, ScoreViewMode } from '../types';
import { QUICK_WIN_TIPS } from '../utils/quickWinTips';

interface UseDashboardStateArgs {
  profile: UserProfile;
  footprint: CarbonFootprint;
  challenges: WeeklyChallenge[];
  history: EmissionHistoryItem[];
  onAddHistoryLog: (emissions: CarbonFootprint) => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

export function useDashboardState({
  profile,
  footprint,
  challenges,
  history,
  onAddHistoryLog,
  onUpdateProfile,
}: UseDashboardStateArgs) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [scoreViewMode, setScoreViewMode] = useState<ScoreViewMode>('footprint');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [quickWinIndex, setQuickWinIndex] = useState(0);
  const [hasCompletedQuickWin, setHasCompletedQuickWin] = useState(false);
  const [simTransportDistance, setSimTransportDistance] = useState(profile.transport.distance);
  const [simTransportMethod, setSimTransportMethod] = useState<string>(profile.transport.method);
  const [simDietType, setSimDietType] = useState<string>(profile.diet.type);
  const [simCleanEnergy, setSimCleanEnergy] = useState<string>(profile.energy.cleanEnergy);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const classification = getEmissionsClassification(footprint.total);
  const categoryPct = getCategoryPercentages(footprint);
  const targetMultiplier = (footprint.total / GLOBAL_BENCHMARKS.target).toFixed(1);
  const primaryCategory = getPrimaryEmissionCategory(footprint);
  const activeCategoryTips = QUICK_WIN_TIPS[primaryCategory.key] ?? QUICK_WIN_TIPS.energy;
  const activeTip = activeCategoryTips[quickWinIndex % activeCategoryTips.length];
  const currentWeekDays = getCurrentWeekDays();

  const simulatedTransport = calculateTransportEmissions({
    ...profile.transport,
    distance: simTransportDistance,
    method: simTransportMethod as CommuteMethod,
  });
  const simulatedDiet = calculateDietEmissions({
    ...profile.diet,
    type: simDietType as DietType,
  });
  const simulatedEnergy = calculateEnergyEmissions({
    ...profile.energy,
    cleanEnergy: simCleanEnergy as CleanEnergyType,
  });
  const simulatedTotal = simulatedTransport + simulatedDiet + simulatedEnergy + footprint.shopping;
  const simulatedSavings = Math.max(0, footprint.total - simulatedTotal);

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `carbon_wise_coach_history_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    triggerToast('Carbon footprint history database exported and downloaded as JSON successfully!');
  };

  const handleApplySimulatedParameters = () => {
    onUpdateProfile({
      ...profile,
      transport: { ...profile.transport, distance: simTransportDistance, method: simTransportMethod as CommuteMethod },
      diet: { ...profile.diet, type: simDietType as DietType },
      energy: { ...profile.energy, cleanEnergy: simCleanEnergy as CleanEnergyType },
    });
    triggerToast('Sandbox settings applied! Your baseline footprint profile has been permanently updated.');
  };

  const handleCompleteQuickWin = () => {
    setHasCompletedQuickWin(true);
    triggerToast(`Victory! Daily Quick Win completed: "${activeTip.title}". Boosted your daily sustainable streak!`);
  };

  const handleShuffleTip = () => {
    setQuickWinIndex((prev) => prev + 1);
    setHasCompletedQuickWin(false);
  };

  const triggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const reduced: CarbonFootprint = {
        transport: Math.max(200, Math.round(footprint.transport * 0.75)),
        diet: Math.max(500, Math.round(footprint.diet * 0.8)),
        energy: Math.max(400, Math.round(footprint.energy * 0.85)),
        shopping: Math.max(100, Math.round(footprint.shopping * 0.7)),
        total: 0,
      };
      reduced.total = reduced.transport + reduced.diet + reduced.energy + reduced.shopping;
      onAddHistoryLog(reduced);
      setIsSimulating(false);
      triggerToast('Weekly consumption logged successfully! Progress recorded on carbon trends graph.');
    }, 1000);
  };

  const handleGeneratePDFReport = () => {
    try {
      generateCarbonReport({ profile, footprint, challenges, history });
      triggerToast('Custom PDF Carbon Journey Report compiling complete. Initiating download!');
    } catch (err) {
      console.error(err);
      triggerToast('Encountered an issue compiling PDF document. Please retry.');
    }
  };

  return {
    activeTab,
    setActiveTab,
    successToast,
    triggerToast,
    isMethodologyModalOpen,
    setIsMethodologyModalOpen,
    scoreViewMode,
    setScoreViewMode,
    isSimulating,
    classification,
    categoryPct,
    targetMultiplier,
    primaryCategory,
    activeTip,
    hasCompletedQuickWin,
    handleCompleteQuickWin,
    handleShuffleTip,
    currentWeekDays,
    simTransportDistance,
    setSimTransportDistance,
    simTransportMethod,
    setSimTransportMethod,
    simDietType,
    setSimDietType,
    simCleanEnergy,
    setSimCleanEnergy,
    simulatedTotal,
    simulatedSavings,
    handleApplySimulatedParameters,
    handleDownloadJSON,
    triggerSimulation,
    handleGeneratePDFReport,
  };
}
