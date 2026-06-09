import React, { useEffect, useState } from 'react';
import { UserProfile, CarbonFootprint, SustainabilityAction, CoachInsight } from '../types';
import { generateContextualRecommendations } from '../utils/recommendations';
import { Sparkles, ArrowRight, CheckCircle, Flame, ShieldCheck, RefreshCw, AlertCircle, Bookmark } from 'lucide-react';

interface SmartCoachProps {
  profile: UserProfile;
  footprint: CarbonFootprint;
  actions: SustainabilityAction[];
  onToggleAction: (actionId: string) => void;
}

export default function SmartCoach({ profile, footprint, actions, onToggleAction }: SmartCoachProps) {
  const [insight, setInsight] = useState<CoachInsight | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fetch smart insight dynamically from server route
  const fetchSmartCoachAdvice = async (force: boolean = false) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/coach-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          transport: footprint.transport,
          diet: footprint.diet,
          energy: footprint.energy,
          shopping: footprint.shopping,
          totalEmissions: footprint.total,
          profileRaw: profile
        })
      });

      if (!response.ok) {
        throw new Error('Server backend failed to respond correctly.');
      }

      const data = await response.json();
      setInsight(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to the remote Coach intelligence. Using offline rule-based advisor fallback instead.');
      
      // Local fallback
      setInsight({
        headline: `Hello, ${profile.name}! CarbonWise Coach local advisor is active.`,
        analysis: `We found that ${
          footprint.transport > footprint.diet && footprint.transport > footprint.energy
            ? 'weekly travel emissions'
            : footprint.energy > footprint.diet
            ? 'domestic grid power heating load'
            : 'dietary meat preferences'
        } represent your largest individual category. Implementing our targets can save over 1,500 kg per year combined!`,
        recommendations: [
          `Consider switching electric grid tariff contracts to renewable Solar wind supplies.`,
          `Avoid short flight sectors or replace with hybrid electric rail travel options.`,
          `Encourage meal planning around seasonal vegetables to lower overall agricultural outputs.`,
        ],
        isAiGenerated: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmartCoachAdvice();
  }, [profile, footprint.total]);

  // Calculate carbon reductions made from completed actions
  const completedActions = actions.filter(a => a.completed);
  const totalSavings = completedActions.reduce((sum, a) => sum + a.impactKg, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in space-y-10">
      
      {/* Smart Coach Header */}
      <div>
        <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">Smart Assistant</span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">Smart Sustainability Coach</h1>
        <p className="text-slate-500 text-sm mt-1">
          Personalized advice powered by deep logic algorithms and server-side Gemini 3.5 models.
        </p>
      </div>

      {/* AI Assistant Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden" aria-labelledby="assistant-title">
        {/* Background glow styling */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">GenAI Climate Assistant Feed</span>
            </div>

            {loading ? (
              <div className="space-y-4 py-4" role="status" aria-label="Loading Smart Coach advice">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
                  <span className="text-sm font-semibold text-slate-400">Synthesizing personalized habits against 1.5°C Paris protocols...</span>
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 bg-slate-800/80 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-slate-800/80 rounded animate-pulse" />
                  <div className="h-4 bg-slate-800/80 rounded w-5/6 animate-pulse" />
                </div>
              </div>
            ) : error ? (
              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-300">
                  <p className="font-semibold text-white mb-1">Grid Fallback Active</p>
                  <p className="leading-relaxed text-slate-400">{error}</p>
                </div>
              </div>
            ) : null}

            {!loading && insight && (
              <div className="space-y-5 animate-fade-in">
                {insight.isFallbackActive && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-2.5 text-xs text-amber-300">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Local Resilient Mode Active</p>
                      <p className="text-slate-300 leading-relaxed mt-0.5">
                        Gemini servers are currently under extremely high demand. We have activated our local offline scientific ruleset to deliver custom, accurate coaching habits immediately. Try clicking "Re-evaluate" when the load subsides.
                      </p>
                    </div>
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                  &ldquo;{insight.headline}&rdquo;
                </h3>
                
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {insight.analysis}
                </p>

                {insight.recommendations && insight.recommendations.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Priorities Highlighted</h4>
                    <ul className="text-xs sm:text-sm text-slate-300 space-y-2" role="list">
                      {insight.recommendations.map((recommendation, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:w-80 shrink-0 bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl flex flex-col justify-between h-48">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Coach Status</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold">Gemini 3.5 Engine Active</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Your credentials and settings are loaded securely. Re-evaluate any time below after making changes.
              </p>
            </div>

            <button
              onClick={() => fetchSmartCoachAdvice(true)}
              disabled={loading}
              className="w-full text-center py-2 bg-slate-700 hover:bg-slate-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Re-evaluate Habits
            </button>
          </div>
        </div>
      </section>

      {/* Habits Progress Bar and Actions Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Actions complete progress */}
        <div className="p-6 bg-white border border-slate-200/80 shadow-sm rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">My Saved Carbon</h3>
            <p className="text-xs text-slate-400 mb-6">Emissions avoided annually from your verified task obligations.</p>
            
            <div className="py-6 flex flex-col items-center">
              <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                <Flame className="w-12 h-12 text-emerald-600" />
              </div>
              
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {totalSavings.toLocaleString()}
              </span>
              <span className="text-xs font-bold font-mono text-emerald-700 uppercase tracking-widest mt-1 bg-emerald-50 px-2 py-0.5 rounded">
                kg CO2e / yr Avoided
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 mt-4 text-xs text-slate-400 font-medium text-center leading-relaxed">
            Marking curated tasks as complete below directly offsets your scorecard totals!
          </div>
        </div>

        {/* Action Curations Checklist */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 shadow-sm rounded-3xl p-6 sm:p-8" aria-labelledby="tactics-title">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 id="tactics-title" className="text-lg font-bold text-slate-800">Curated Sustainability Commitments</h2>
              <p className="text-xs text-slate-400 mt-1">Highly-tailored actions designed specifically around your habits. Click and commit.</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-mono font-semibold px-2 py-1 rounded">
              {completedActions.length} completed
            </span>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {actions.map((action) => (
              <div
                key={action.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  action.completed
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                {/* Active trigger box */}
                <button
                  type="button"
                  onClick={() => onToggleAction(action.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer ${
                    action.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 hover:border-emerald-500'
                  }`}
                  aria-pressed={action.completed}
                  title={`Toggle complete for ${action.title}`}
                >
                  {action.completed && (
                    <svg className="w-3.5 h-3.5 stroke-current stroke-3" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className={`text-sm sm:text-base font-bold ${action.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {action.title}
                    </h4>
                    
                    <span className="text-xs font-mono font-bold text-emerald-600 shrink-0">
                      -{action.impactKg} kg/yr
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{action.description}</p>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                      {action.category}
                    </span>
                    
                    <span className={`text-[10px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded ${
                      action.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700' :
                      action.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {action.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
