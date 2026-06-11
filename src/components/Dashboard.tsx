import React, { useState } from 'react';
import { UserProfile, CarbonFootprint, WeeklyChallenge, EmissionHistoryItem } from '../types';
import {
  getEmissionsClassification,
  calculateTransportEmissions,
  calculateDietEmissions,
  calculateEnergyEmissions,
  calculateShoppingEmissions
} from '../utils/carbonCalculator';
import { GLOBAL_BENCHMARKS } from '../utils/presets';
import { Leaf, Calendar, Share2, Plus, TrendingDown, Sparkles, AlertCircle, Trash2, CheckCircle2, HelpCircle, Zap, RotateCw, Award, FileText } from 'lucide-react';
import { generateCarbonReport } from '../utils/pdfGenerator';
import Achievements from './Achievements';
import PeerComparison from './PeerComparison';
import MethodologyModal from './MethodologyModal';
import CalculationSources from './CalculationSources';
import CarbonFootprintArt from './CarbonFootprintArt';
import DashboardWidget from './DashboardWidget';

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
  const [isSimulating, setIsSimulating] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [scoreViewMode, setScoreViewMode] = useState<'gauge' | 'footprint'>('footprint');

  // Quick Win logic
  // Map of static quick wins based on category
  const QUICK_WIN_TIPS: Record<string, { title: string; description: string; actionText: string }[]> = {
    transport: [
      { title: 'Drive 5 km Less Weekly', description: 'Swap one vehicle journey under 5 km with walking or a bike ride per week. Short commutes are prime for carbon offsets.', actionText: 'Swapped transit' },
      { title: 'Optimize Tire Inflation', description: 'Properly inflated tires decrease rolling friction with tarmac, boosting standard fuel mileage by up to 3.3%.', actionText: 'Inflated tires correctly' },
      { title: 'Combine Errands Multi-Trips', description: 'Run all your weekend errands in a single round-trip instead of multiple individual drives to save fuel.', actionText: 'Processed single route' },
    ],
    diet: [
      { title: 'Practice "Meatless Monday"', description: 'Skipping beef or lamb for 24 hours eliminates up to 8 kg of individual carbon emissions equivalents.', actionText: 'Subbed vegan plate' },
      { title: 'Repurpose Leftover Scraps', description: 'Create a scrap broth or freeze raw ingredients before they rot in central landfills generating methane.', actionText: 'Prepped leftover scrap' },
      { title: 'Prioritize Regional Sourcing', description: 'Acquire your seasonal greens from regional co-ops to sidestep global cargo aviation footprints.', actionText: 'Supported local co-op' },
    ],
    energy: [
      { title: 'Adjust Home Thermostat by 1°C', description: 'Lowering winter heating or raising summer air cooling bounds by 1°C reduces utility grid load by nearly 10%.', actionText: 'Adjusted dial' },
      { title: 'Unplug "Vampire" Electronics', description: 'Shut down major gaming rigs, chargers, and television accessories from their physical sockets overnight.', actionText: 'Killed phantom draws' },
      { title: 'Dial Laundry Temperature to 30°C', description: 'Warming water occupies 90% of a laundry machine load resource consumption. Washing cold saves ample grid juice.', actionText: 'Set laundry run cold' },
    ],
    shopping: [
      { title: 'Enforce a 48-Hour Cart Hold', description: 'Hold spec apparel retail shopping in draft for 48 hours to avoid low-utilization fast fashion waste.', actionText: 'Held cart items' },
      { title: 'Extend Device Maintenance Cycle', description: 'Clean computer vents, clear junk files, and purchase screen protectors to prolong current electronics life.', actionText: 'Extended laptop life' },
      { title: 'Bring a Durable Canvas Tote', description: 'Conceal folded cotton canvas carriers inside your commute backpack pocket to safely decline synthetic store plastic.', actionText: 'Supplied own carrier' },
    ],
  };

  const [quickWinIndex, setQuickWinIndex] = useState(0);
  const [hasCompletedQuickWin, setHasCompletedQuickWin] = useState(false);

  // Download carbon history as a JSON file
  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `carbon_wise_coach_history_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Carbon footprint history database exported and downloaded as JSON successfully!');
  };

  // Sandbox State variables initialized dynamically based on real profile values
  const [simTransportDistance, setSimTransportDistance] = useState<number>(profile.transport.distance);
  const [simTransportMethod, setSimTransportMethod] = useState<string>(profile.transport.method);
  const [simDietType, setSimDietType] = useState<string>(profile.diet.type);
  const [simCleanEnergy, setSimCleanEnergy] = useState<string>(profile.energy.cleanEnergy);

  // Live simulation outputs
  const simulatedTransport = calculateTransportEmissions({
    ...profile.transport,
    distance: simTransportDistance,
    method: simTransportMethod as any
  });
  const simulatedDiet = calculateDietEmissions({
    ...profile.diet,
    type: simDietType as any
  });
  const simulatedEnergy = calculateEnergyEmissions({
    ...profile.energy,
    cleanEnergy: simCleanEnergy as any
  });
  const simulatedShopping = footprint.shopping; // remains baseline constant

  const simulatedTotal = simulatedTransport + simulatedDiet + simulatedEnergy + simulatedShopping;
  const simulatedSavings = Math.max(0, footprint.total - simulatedTotal);

  // Apply simulated playground data as the user's permanent profile baseline
  const handleApplySimulatedParameters = () => {
    const updatedProfile: UserProfile = {
      ...profile,
      transport: {
        ...profile.transport,
        distance: simTransportDistance,
        method: simTransportMethod as any
      },
      diet: {
        ...profile.diet,
        type: simDietType as any
      },
      energy: {
        ...profile.energy,
        cleanEnergy: simCleanEnergy as any
      }
    };
    onUpdateProfile(updatedProfile);
    triggerToast("Sandbox settings applied! Your baseline footprint profile has been permanently updated.");
  };

  // Calculations relative to benchmarks
  const classification = getEmissionsClassification(footprint.total);
  
  // Calculate category percentages
  const transportPct = footprint.total > 0 ? (footprint.transport / footprint.total) * 100 : 0;
  const dietPct = footprint.total > 0 ? (footprint.diet / footprint.total) * 100 : 0;
  const energyPct = footprint.total > 0 ? (footprint.energy / footprint.total) * 100 : 0;
  const shoppingPct = footprint.total > 0 ? (footprint.shopping / footprint.total) * 100 : 0;

  // Multiplier relative to 1.5C climate target
  const targetMultiplier = (footprint.total / GLOBAL_BENCHMARKS.target).toFixed(1);

  // Determine primary footprint category based on largest emissions source
  const breakdownCategories = [
    { key: 'transport', label: 'Transportation', value: footprint.transport, colorText: 'text-sky-600', colorBg: 'bg-sky-50', border: 'border-sky-200/60' },
    { key: 'diet', label: 'Diet & Food', value: footprint.diet, colorText: 'text-amber-600', colorBg: 'bg-amber-50', border: 'border-amber-250/50' },
    { key: 'energy', label: 'Home Utilities', value: footprint.energy, colorText: 'text-emerald-600', colorBg: 'bg-emerald-50', border: 'border-emerald-200/60' },
    { key: 'shopping', label: 'Shopping & Retail', value: footprint.shopping, colorText: 'text-indigo-600', colorBg: 'bg-indigo-50', border: 'border-indigo-200/60' },
  ];
  
  const sortedBreakdown = [...breakdownCategories].sort((a, b) => b.value - a.value);
  const primaryCategory = sortedBreakdown[0] || breakdownCategories[0];

  const activeCategoryTips = QUICK_WIN_TIPS[primaryCategory.key] || QUICK_WIN_TIPS.energy;
  const activeTip = activeCategoryTips[quickWinIndex % activeCategoryTips.length];

  const handleCompleteQuickWin = () => {
    setHasCompletedQuickWin(true);
    triggerToast(`Victory! Daily Quick Win completed: "${activeTip.title}". Boosted your daily sustainable streak!`);
  };

  const handleShuffleTip = () => {
    setQuickWinIndex(prev => prev + 1);
    setHasCompletedQuickWin(false);
  };

  // Generate a list of days for tracking weekly challenges (Monday to Sunday)
  const currentWeekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    // Monday as start
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + i;
    const itemDate = new Date(d.setDate(diff));
    return {
      name: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
      dateStr: itemDate.toISOString().split('T')[0],
      display: itemDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    };
  });

  const triggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Simulate reduced consumption (e.g. they drive 30% less, eat 20% cleaner)
      const reducedFootprint: CarbonFootprint = {
        transport: Math.max(200, Math.round(footprint.transport * 0.75)),
        diet: Math.max(500, Math.round(footprint.diet * 0.8)),
        energy: Math.max(400, Math.round(footprint.energy * 0.85)),
        shopping: Math.max(100, Math.round(footprint.shopping * 0.7)),
        total: 0 // Will auto sum below
      };
      reducedFootprint.total = reducedFootprint.transport + reducedFootprint.diet + reducedFootprint.energy + reducedFootprint.shopping;
      
      onAddHistoryLog(reducedFootprint);
      setIsSimulating(false);
      triggerToast('Weekly consumption logged successfully! Progress recorded on carbon trends graph.');
    }, 1000);
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in space-y-10">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-slide-up max-w-sm" role="alert">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 border border-slate-200/60 p-6 sm:p-8 rounded-3xl">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">My Dashboard</span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
            Welcome back, <span className="text-emerald-700 font-extrabold">{profile.name}</span>!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tracking your individual carbon reduction objectives towards the global 1.5°C threshold.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMethodologyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer transition-all"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            Methodology
          </button>

          <button
            id="btn-download-pdf-report"
            type="button"
            onClick={handleGeneratePDFReport}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            PDF Report
          </button>

          <button
            onClick={triggerSimulation}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs sm:text-sm font-semibold rounded-xl shadow cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Calendar className="w-4 h-4" />
            {isSimulating ? 'Recording...' : 'Log Current Week'}
          </button>

          <button
            onClick={() => {
              triggerToast('Temporary share link compiled! Shared to climate network.');
            }}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
            aria-label="Export scorecard"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Daily Quick Win Widget Block */}
      <div 
        id="daily-quick-win-card"
        className="relative bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md transition-all duration-300"
      >
        {/* Subtle background dynamic glow reflecting targeted category */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start gap-4 z-10 w-full md:max-w-[70%]">
          <div className="p-3 bg-slate-800/80 border border-slate-750 text-emerald-400 rounded-2xl shrink-0 mt-0.5 shadow">
            <Zap className="w-5 h-5 animate-pulse text-yellow-400" />
          </div>
          <div className="space-y-1 w-full">
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Daily Sustainability Quick Win
              </span>
              <span className="text-[9px] bg-emerald-950 border border-emerald-800/60 font-semibold text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wide">
                Primary Contributor: {primaryCategory.label}
              </span>
            </div>
            
            <h3 className="text-base sm:text-lg font-black text-white hover:text-emerald-300 transition-colors">
              {activeTip.title}
            </h3>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {activeTip.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto z-10 shrink-0">
          {hasCompletedQuickWin ? (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-bold w-full md:w-auto justify-center animate-fade-in">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Win Completed! (+50 pts)</span>
            </div>
          ) : (
            <button
              id="btn-complete-quick-win"
              type="button"
              onClick={handleCompleteQuickWin}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md hover:shadow-emerald-600/10 cursor-pointer transition-all flex items-center justify-center gap-1.5 w-full md:w-auto hover:-translate-y-0.5 active:translate-y-0 outline-none"
            >
              <span>Done, Check Off</span>
            </button>
          )}

          <button
            id="btn-shuffle-quick-win"
            type="button"
            onClick={handleShuffleTip}
            className="p-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-750/80 shadow-xs focus:outline-none cursor-pointer transition-all focus:ring-1 focus:ring-slate-700"
            title="Suggest another quick win match"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score Grid & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Score Circle Card */}
        {scoreViewMode === 'footprint' ? (
          <div className="lg:col-span-12 xl:col-span-5 lg:col-span-5 flex flex-col justify-between h-full">
            <CarbonFootprintArt 
              footprintTotal={footprint.total} 
              scoreViewMode={scoreViewMode} 
              setScoreViewMode={setScoreViewMode} 
            />
          </div>
        ) : (
          <div className="lg:col-span-12 xl:col-span-5 lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col justify-between relative">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Carbon Footprint Score</h2>
                {/* Elegant, clearly visible segment toggle */}
                <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 shadow-inner">
                  <button
                    onClick={() => setScoreViewMode('footprint')}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer text-slate-500 hover:text-slate-800 transition-all whitespace-nowrap"
                  >
                    Art View
                  </button>
                  <button
                    onClick={() => setScoreViewMode('gauge')}
                    className="px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer bg-white text-slate-950 shadow-sm border border-slate-200/50 whitespace-nowrap animate-fade-in"
                  >
                    Meter View
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center py-6">
                {/* Circular Graphic */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#eaeaea"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Value track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={footprint.total > 10000 ? '#f43f5e' : footprint.total > 6000 ? '#f59e0b' : '#10b981'}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={Math.max(0, 251.2 - (251.2 * Math.min(footprint.total, 15000)) / 15000)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  
                  {/* Score numbers inside */}
                  <div className="absolute text-center">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-mono">
                      {Math.round(footprint.total / 100) / 10}
                    </span>
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                      Tons CO2e / yr
                    </p>
                  </div>
                </div>

                {/* Classification Tag */}
                <div className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${classification.color} text-center max-w-xs mt-2`}>
                  {classification.label}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 mt-4">
              <p className="text-xs text-slate-500 leading-relaxed text-center">
                {classification.description}
              </p>
            </div>
          </div>
        )}

        {/* Categories Breakdown */}
        <div className="lg:col-span-12 xl:col-span-4 lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-6">Emissions Categorisation</h2>
            
            <div className="space-y-5" role="group" aria-label="Carbon category levels">
              
              {/* Category: Transport */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-sky-400 rounded-full" />
                    Transport
                  </span>
                  <span>{footprint.transport.toLocaleString()} kg ({Math.round(transportPct)}%)</span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: `${transportPct}%` }} />
                </div>
              </div>

              {/* Category: Food (Diet) */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
                    Diet & Food
                  </span>
                  <span>{footprint.diet.toLocaleString()} kg ({Math.round(dietPct)}%)</span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${dietPct}%` }} />
                </div>
              </div>

              {/* Category: Utilities (Energy) */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                    Home Utilities
                  </span>
                  <span>{footprint.energy.toLocaleString()} kg ({Math.round(energyPct)}%)</span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${energyPct}%` }} />
                </div>
              </div>

              {/* Category: Shopping */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full" />
                    Shopping & Retail
                  </span>
                  <span>{footprint.shopping.toLocaleString()} kg ({Math.round(shoppingPct)}%)</span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${shoppingPct}%` }} />
                </div>
              </div>

            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 mt-6 flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Scale totals are annual estimations</span>
            <span className="font-mono text-emerald-600">{footprint.total.toLocaleString()} kg / yr</span>
          </div>
        </div>

        {/* Global Target Comparison */}
        <div className="lg:col-span-12 xl:col-span-3 lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-6">Global Targets Context</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">Climate benchmark target (1.5°C Limit)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-emerald-950 font-mono">2,000</span>
                  <span className="text-xs text-emerald-700 font-semibold">kg CO2e / year</span>
                </div>
                <p className="text-xs text-emerald-800/80 leading-relaxed mt-2 font-medium">
                  Your current score is <strong className="text-emerald-950 font-semibold">{targetMultiplier}x</strong> this optimal limit.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-500">
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span>EU Average Individual</span>
                  <span className="text-slate-700 font-mono">8,200 kg CO2e</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span>USA Average Individual</span>
                  <span className="text-slate-700 font-mono">15,500 kg CO2e</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span>World Per Capita Average</span>
                  <span className="text-slate-700 font-mono">4,700 kg CO2e</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 mt-4">
            <button
              onClick={onNavigateToCoach}
              className="w-full flex items-center justify-center gap-1.5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate Coach Insights
            </button>
          </div>
        </div>

      </div>

      {/* Comparative Data and Milestone Achievements Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="sustainability-milestones-grid">
        <PeerComparison footprint={footprint} />
        <Achievements 
          profile={profile} 
          footprint={footprint} 
          challenges={challenges} 
          history={history} 
        />
      </div>

      {/* "What-If" Dynamic Carbon Sandbox Simulator */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8" aria-labelledby="sandbox-title">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6 border-b border-slate-100 pb-5">
          <div>
            <h2 id="sandbox-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
              Real-Time &ldquo;What-If&rdquo; Carbon Sandbox Simulator
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Play with lifestyle sliders to visually model simulated decreases in your annual emissions, before committing.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
            Interactive Playground
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sliders Input Segment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Simulation Parameter 1: Commute Distance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>🚘 Commute Travel Distance</span>
                <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {simTransportDistance} km / week
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={simTransportDistance}
                onChange={(e) => setSimTransportDistance(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-slate-400">Reduce to model closer work-from-home schedules or active cycling commutes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
              
              {/* Parameter 2: Commute Vehicle Options */}
              <div className="space-y-1.5">
                <label htmlFor="sim-transport-method" className="text-xs font-bold text-slate-700 block col-span-1">🚄 Transition Vehicle</label>
                <select
                  id="sim-transport-method"
                  value={simTransportMethod}
                  onChange={(e) => setSimTransportMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
                >
                  <option value="petrol">Petrol Powered Car</option>
                  <option value="diesel">Diesel Powered Car</option>
                  <option value="electric">Electric Vehicle (EV)</option>
                  <option value="transit">Public Rail/Metro</option>
                  <option value="active">Active Walk/Cycle</option>
                </select>
              </div>

              {/* Parameter 3: Dietary Patterns */}
              <div className="space-y-1.5">
                <label htmlFor="sim-diet-type" className="text-xs font-bold text-slate-700 block">🥗 Alternate Diet Choice</label>
                <select
                  id="sim-diet-type"
                  value={simDietType}
                  onChange={(e) => setSimDietType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
                >
                  <option value="heavy-meat">Frequent Meat</option>
                  <option value="medium-meat">Balanced Mix</option>
                  <option value="low-meat">Low Meat / Flexi</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan (100% Plant)</option>
                </select>
              </div>

              {/* Parameter 4: Renewable Grid Supplies */}
              <div className="space-y-1.5">
                <label htmlFor="sim-clean-energy" className="text-xs font-bold text-slate-700 block">⚡ Home Tariff Source</label>
                <select
                  id="sim-clean-energy"
                  value={simCleanEnergy}
                  onChange={(e) => setSimCleanEnergy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
                >
                  <option value="standard">Standard Grid</option>
                  <option value="mixed">Mixed Solar/Wind</option>
                  <option value="solar">100% Solar Tariff</option>
                </select>
              </div>

            </div>

          </div>

          {/* Feedback Outputs Display Segment */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Sandbox Predictions</span>
              
              {/* Score visual comparison */}
              <div className="mt-3">
                <div className="text-3xl font-extrabold font-mono text-emerald-400">
                  {simulatedTotal.toLocaleString()} <span className="text-xs font-sans font-bold text-slate-300 font-semibold text-white">kg/yr</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 leading-normal flex items-center flex-wrap gap-1.5">
                  Proposed carbon score
                  {simulatedSavings > 0 ? (
                    <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      -{simulatedSavings.toLocaleString()} kg delta
                    </span>
                  ) : simulatedTotal > footprint.total ? (
                    <span className="text-[10px] font-bold font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                      +{Math.abs(footprint.total - simulatedTotal).toLocaleString()} kg delta
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-500/10 px-1.5 py-0.5 rounded">
                      No change
                    </span>
                  )}
                </div>
              </div>

              {/* Benchmark compare note */}
              <div className="border-t border-slate-850 pt-4 mt-4 text-xs space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Paris target boundary:</span>
                  <span className="text-slate-300">2,000 kg</span>
                </div>
                {simulatedTotal <= 2000 ? (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300 font-medium">
                    🌟 **Excellent:** This combination completely aligns your footprint with dynamic global limits to curb warming!
                  </div>
                ) : (
                  <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300 font-medium">
                    💡 **Tip:** Shift more options above to solar power or meat-less choice to achieve the 2,000 kg targets.
                  </div>
                )}
              </div>
            </div>

            {/* Persistence button */}
            <button
              type="button"
              onClick={handleApplySimulatedParameters}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-emerald-400"
            >
              Apply Sandbox Options to Profile
            </button>
          </div>

        </div>
      </section>

      {/* Weekly Sustainability Challenges */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8" aria-labelledby="challenges-title">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 id="challenges-title" className="text-xl font-bold text-slate-800">Weekly Habit Challenges Tracker</h2>
            <p className="text-slate-400 text-xs mt-1">Log your active days this week. Each marked grid represents carbon directly saved from your lifestyle.</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-200/50">
            Active Challenges: {challenges.length}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.slice(0, 4).map((challenge) => {
            const completedCount = challenge.daysCompleted.length;
            const pct = Math.round((completedCount / 7) * 100);
            return (
              <div key={challenge.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100/80 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                        challenge.category === 'transport' ? 'bg-sky-100 text-sky-800' :
                        challenge.category === 'diet' ? 'bg-amber-100 text-amber-850' :
                        challenge.category === 'energy' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {challenge.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 mt-2">{challenge.title}</h3>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-600 shrink-0">
                      -{challenge.impactKg} kg/wk
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">{challenge.description}</p>
                </div>

                {/* Day Track Boxes */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-400 mb-2 px-1">
                    <span>Mon - Sun Streak Tracker</span>
                    <span>{completedCount}/7 Days ({pct}%)</span>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1.5 mb-2" role="group" aria-label="Streak days tracker selection">
                    {currentWeekDays.map((day) => {
                      const isSelected = challenge.daysCompleted.includes(day.dateStr);
                      return (
                        <button
                          key={day.dateStr}
                          type="button"
                          onClick={() => {
                            onToggleChallengeDay(challenge.id, day.dateStr);
                            if (!isSelected) {
                              triggerToast(`Logged progress for ${day.display}! Keep up the amazing work!`);
                            }
                          }}
                          className={`py-2 rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer text-center ${
                            isSelected
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                          }`}
                          aria-pressed={isSelected}
                          title={`Toggle ${challenge.title} for ${day.display}`}
                        >
                          {day.name}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Progress Line */}
                  <div className="w-full bg-slate-200 h-1 rounded overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded transition-all duration-300" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Carbon Reduction Trend and Log History */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8" aria-labelledby="history-title">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 id="history-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-500" />
              Historic Performance & Carbon Logs
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Check your carbon decrease history across generated logs. Click &quot;Log Current Week&quot; to test your behavior curves.
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => {
                onClearHistory();
                triggerToast('Logs cleared safely.');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 rounded-xl text-xs font-bold transition-all outline-none cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Logs
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center p-6 text-slate-400">
            <AlertCircle className="w-8 h-8 text-slate-300 mb-3" />
            <h4 className="font-bold text-slate-700 text-sm">No Carbon Progress Logged Yet</h4>
            <p className="text-xs mt-1 leading-relaxed max-w-sm">
              Press the &quot;Log Current Week&quot; button above to record your current footprint metrics into your tracking timeline and simulate decreases.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Visual Recharts Area Trendline Analysis */}
            <div className="lg:col-span-2">
              <DashboardWidget 
                history={history} 
                onDownloadJSON={handleDownloadJSON} 
              />
            </div>

            {/* Logs List widget */}
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {history.map((log, idx) => {
                const diff = idx > 0 ? history[idx-1].emissions.total - log.emissions.total : 0;
                return (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-400">{log.date}</span>
                      <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">
                        {Math.round(log.emissions.total / 100) / 10} t CO2e
                      </h4>
                    </div>

                    {diff > 0 ? (
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-bold font-mono px-2 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        -{diff.toLocaleString()} kg
                      </span>
                    ) : idx > 0 && diff < 0 ? (
                      <span className="text-xs bg-rose-50 text-rose-700 font-bold font-mono px-2 py-1 rounded-lg border border-rose-100">
                        +{(Math.abs(diff)).toLocaleString()} kg
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-50 text-slate-400 font-mono font-bold px-2 py-1 rounded border border-slate-100">
                        Baseline Point
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </section>

      {/* Calculation Sources and specific report version indices displayed in the footer area */}
      <CalculationSources />

      {/* Sources and Scientific Methodology Dialog overlay */}
      <MethodologyModal isOpen={isMethodologyModalOpen} onClose={() => setIsMethodologyModalOpen(false)} />

    </div>
  );
}
