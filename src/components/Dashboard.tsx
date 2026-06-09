import React, { useState } from 'react';
import { UserProfile, CarbonFootprint, WeeklyChallenge, EmissionHistoryItem } from '../types';
import { getEmissionsClassification } from '../utils/carbonCalculator';
import { GLOBAL_BENCHMARKS } from '../utils/presets';
import { Leaf, Calendar, Share2, Plus, TrendingDown, Sparkles, AlertCircle, Trash2, CheckCircle2, HelpCircle } from 'lucide-react';
import SourcesModal from './SourcesModal';

interface DashboardProps {
  profile: UserProfile;
  footprint: CarbonFootprint;
  challenges: WeeklyChallenge[];
  onToggleChallengeDay: (challengeId: string, dateStr: string) => void;
  history: EmissionHistoryItem[];
  onAddHistoryLog: (emissions: CarbonFootprint) => void;
  onClearHistory: () => void;
  onNavigateToCoach: () => void;
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
}: DashboardProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

  // Calculations relative to benchmarks
  const classification = getEmissionsClassification(footprint.total);
  
  // Calculate category percentages
  const transportPct = footprint.total > 0 ? (footprint.transport / footprint.total) * 100 : 0;
  const dietPct = footprint.total > 0 ? (footprint.diet / footprint.total) * 100 : 0;
  const energyPct = footprint.total > 0 ? (footprint.energy / footprint.total) * 100 : 0;
  const shoppingPct = footprint.total > 0 ? (footprint.shopping / footprint.total) * 100 : 0;

  // Multiplier relative to 1.5C climate target
  const targetMultiplier = (footprint.total / GLOBAL_BENCHMARKS.target).toFixed(1);

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
            onClick={() => setIsSourcesModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer transition-all"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            Methodology & Sources
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

      {/* Score Grid & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Score Circle Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Carbon Footprint Score</h2>
              <Leaf className="w-5 h-5 text-emerald-500" />
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

        {/* Categories Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
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
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
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
            
            {/* Visual Bar Columns */}
            <div className="lg:col-span-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-6">Emissions Trend Curve (kg CO2e/yr)</h3>
                
                {/* Custom Graph */}
                <div className="w-full flex items-end justify-between gap-4 h-48 pb-2 px-4" role="img" aria-label="Emissions trend graph">
                  {history.map((item, idx) => {
                    const maxEmissionVal = 15000;
                    const fillPct = Math.min(100, (item.emissions.total / maxEmissionVal) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group">
                        {/* Hover card value */}
                        <span className="text-[10px] font-mono font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                          {item.emissions.total.toLocaleString()} kg
                        </span>
                        
                        {/* Segment Column */}
                        <div className="w-full bg-slate-200/50 group-hover:bg-slate-200 rounded-lg h-32 flex items-end overflow-hidden transition-all border border-slate-200/10">
                          <div
                            className={`w-full ${
                              idx === history.length - 1 ? 'bg-emerald-500' : 'bg-teal-400'
                            } rounded-b transition-all duration-1000 ease-out`}
                            style={{ height: `${fillPct}%` }}
                          />
                        </div>
                        
                        <span className="text-[10px] font-bold font-mono text-slate-400 mt-2">
                          {item.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-slate-200/60 pt-4 mt-2 px-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-teal-400 rounded-sm" /> Historical Logs
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Latest Point
                </span>
              </div>
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

      {/* Sources and Scientific Methodology Dialog overlay */}
      <SourcesModal isOpen={isSourcesModalOpen} onClose={() => setIsSourcesModalOpen(false)} />

    </div>
  );
}
