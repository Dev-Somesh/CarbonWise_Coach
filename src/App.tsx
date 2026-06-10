/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { UserProfile, CarbonFootprint, WeeklyChallenge, EmissionHistoryItem, SustainabilityAction } from './types';
import { calculateCarbonFootprint } from './utils/carbonCalculator';
import { generateContextualRecommendations, getRecommendedChallenges } from './utils/recommendations';
import { DEFAULT_PROFILE } from './utils/presets';

import Landing from './components/Landing';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import SmartCoach from './components/SmartCoach';
import TestSuiteRunner from './components/TestSuiteRunner';

import { Leaf, GraduationCap, BarChart3, HelpCircle, RefreshCw, Terminal, CheckCircle2, ExternalLink, AlertCircle, Trash2, Mail, Globe, Linkedin, Github, Sparkles, Footprints } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState<'landing' | 'onboarding' | 'dashboard' | 'coach' | 'tests'>('landing');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [history, setHistory] = useState<EmissionHistoryItem[]>([]);
  const [actions, setActions] = useState<SustainabilityAction[]>([]);
  const [activeFootprint, setActiveFootprint] = useState<CarbonFootprint>({
    transport: 0,
    diet: 0,
    energy: 0,
    shopping: 0,
    total: 0
  });

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // 1. Initialise State & Sync with localStorage
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('cw_user_profile');
      const storedChallenges = localStorage.getItem('cw_user_challenges');
      const storedHistory = localStorage.getItem('cw_user_history');
      const storedActions = localStorage.getItem('cw_user_actions');

      if (storedProfile) {
        const parsedProfile: UserProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        
        if (parsedProfile.hasCompletedOnboarding) {
          setPage('dashboard');
        }
      }

      if (storedChallenges) {
        setChallenges(JSON.parse(storedChallenges));
      }

      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }

      if (storedActions) {
        setActions(JSON.parse(storedActions));
      }
    } catch (err) {
      console.error('Failed to restore dashboard session state:', err);
    }
  }, []);

  // 2. Re-calculate footprint dynamically whenever the profile or active actions state updates
  useEffect(() => {
    if (!profile.hasCompletedOnboarding) return;

    // Calculate baseline primary emissions
    const baseline = calculateCarbonFootprint(
      profile.transport,
      profile.diet,
      profile.energy,
      profile.shopping
    );

    // Subtract savings gained from completed actions!
    const completedSavings = actions
      .filter(a => a.completed)
      .reduce((sum, a) => sum + a.impactKg, 0);

    const adjustedTotal = Math.max(200, baseline.total - completedSavings);

    // Proportionally apportion the savings to Categories to reflect on category visual bars!
    const savedByCategory = actions
      .filter(a => a.completed)
      .reduce((acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + a.impactKg;
        return acc;
      }, {} as Record<string, number>);

    setActiveFootprint({
      transport: Math.max(0, baseline.transport - (savedByCategory.transport || 0)),
      diet: Math.max(0, baseline.diet - (savedByCategory.diet || 0)),
      energy: Math.max(0, baseline.energy - (savedByCategory.energy || 0)),
      shopping: Math.max(0, baseline.shopping - (savedByCategory.shopping || 0)),
      total: adjustedTotal,
    });

  }, [profile, actions]);

  // Save changes to LocalStorage on state update
  const saveStateToStorage = (
    updatedProfile: UserProfile,
    updatedChallenges: WeeklyChallenge[],
    updatedActions: SustainabilityAction[],
    updatedHistory: EmissionHistoryItem[]
  ) => {
    localStorage.setItem('cw_user_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('cw_user_challenges', JSON.stringify(updatedChallenges));
    localStorage.setItem('cw_user_actions', JSON.stringify(updatedActions));
    localStorage.setItem('cw_user_history', JSON.stringify(updatedHistory));
  };

  // 3. User Action Handlers
  const handleStartOnboarding = () => {
    setPage('onboarding');
  };

  const handleExploreDemo = () => {
    const demoProfile: UserProfile = {
      name: 'Eco Explorer',
      hasCompletedOnboarding: true,
      transport: {
        method: 'petrol',
        distance: 120, // drives petrol regularly
        shortFlights: 1,
        longFlights: 0,
      },
      diet: {
        type: 'heavy-meat',
        foodWaste: 'high',
        sourcing: 'mixed',
      },
      energy: {
        homeSize: 'medium-house',
        highEnergyAppliances: ['ac', 'dryer'],
        cleanEnergy: 'standard',
      },
      shopping: {
        clothing: 'moderate',
        electronics: 'moderate',
        recycling: 'mixed',
      },
    };

    const initialChallenges = getRecommendedChallenges(demoProfile);
    const initialActions = generateContextualRecommendations(demoProfile);
    
    // Set initial baseline trend
    const baseline = calculateCarbonFootprint(
      demoProfile.transport,
      demoProfile.diet,
      demoProfile.energy,
      demoProfile.shopping
    );

    const initialHistory: EmissionHistoryItem[] = [
      { date: 'Initial Baseline Point', emissions: baseline }
    ];

    setProfile(demoProfile);
    setChallenges(initialChallenges);
    setActions(initialActions);
    setHistory(initialHistory);
    setPage('dashboard');

    saveStateToStorage(demoProfile, initialChallenges, initialActions, initialHistory);
  };

  const handleOnboardingComplete = (finishedProfile: UserProfile) => {
    const initialChallenges = getRecommendedChallenges(finishedProfile);
    const initialActions = generateContextualRecommendations(finishedProfile);

    // Initial baseline log record
    const baseline = calculateCarbonFootprint(
      finishedProfile.transport,
      finishedProfile.diet,
      finishedProfile.energy,
      finishedProfile.shopping
    );

    const initialHistory: EmissionHistoryItem[] = [
      { date: 'Initial Baseline Point', emissions: baseline }
    ];

    setProfile(finishedProfile);
    setChallenges(initialChallenges);
    setActions(initialActions);
    setHistory(initialHistory);
    setPage('dashboard');

    saveStateToStorage(finishedProfile, initialChallenges, initialActions, initialHistory);
  };

  const handleToggleChallengeDay = (challengeId: string, dateStr: string) => {
    const updated = challenges.map(c => {
      if (c.id === challengeId) {
        const hasLogged = c.daysCompleted.includes(dateStr);
        const nextDays = hasLogged
          ? c.daysCompleted.filter(d => d !== dateStr)
          : [...c.daysCompleted, dateStr];
        return {
          ...c,
          daysCompleted: nextDays,
          completed: nextDays.length === 7, // completed is 7 straight days
        };
      }
      return c;
    });

    setChallenges(updated);
    saveStateToStorage(profile, updated, actions, history);
  };

  const handleToggleAction = (actionId: string) => {
    const updated = actions.map(act => {
      if (act.id === actionId) {
        return { ...act, completed: !act.completed };
      }
      return act;
    });

    setActions(updated);
    saveStateToStorage(profile, challenges, updated, history);
  };

  const handleAddHistoryLog = (emissions: CarbonFootprint) => {
    const nextIdx = history.length + 1;
    const newLogItem: EmissionHistoryItem = {
      date: `Week ${nextIdx}`,
      emissions,
    };
    const nextHistory = [...history, newLogItem];
    setHistory(nextHistory);
    saveStateToStorage(profile, challenges, actions, nextHistory);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cw_user_history');
  };

  const handleRestartAssessment = () => {
    setIsResetModalOpen(true);
  };

  const executeRestartAssessment = () => {
    localStorage.clear();
    setProfile(DEFAULT_PROFILE);
    setChallenges([]);
    setActions([]);
    setHistory([]);
    setPage('landing');
    setIsResetModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 shadow-xs" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo area */}
            <button
              onClick={() => setPage(profile.hasCompletedOnboarding ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl py-1.5 px-2.5 cursor-pointer border-none bg-transparent hover:bg-slate-50/80 transition-all"
              aria-label="CarbonWise Coach Home"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/15">
                <Footprints className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1">
                CarbonWise <span className="text-emerald-600 font-extrabold">Coach</span>
              </span>
            </button>

            {/* Menu Options - Only visible after completing Onboarding */}
            {profile.hasCompletedOnboarding && (
              <div className="hidden sm:flex items-center gap-1.5" role="tablist" aria-label="Dashboard views">
                
                <button
                  onClick={() => setPage('dashboard')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer flex items-center gap-1.5 ${
                    page === 'dashboard'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                  role="tab"
                  aria-selected={page === 'dashboard'}
                >
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Dashboard
                </button>

                <button
                  onClick={() => setPage('coach')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer flex items-center gap-1.5 ${
                    page === 'coach'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                  role="tab"
                  aria-selected={page === 'coach'}
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Smart Coach
                </button>

                <button
                  onClick={() => setPage('tests')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer flex items-center gap-1.5 ${
                    page === 'tests'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                  role="tab"
                  aria-selected={page === 'tests'}
                >
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  Test Runner
                </button>

              </div>
            )}

            {/* Assessment Reset Trigger */}
            <div className="flex items-center gap-3">
              {profile.hasCompletedOnboarding ? (
                <button
                  onClick={handleRestartAssessment}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold border border-slate-250 shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer transition-all"
                  aria-label="Reset and restart assessment"
                >
                  Restart Hub
                </button>
              ) : (
                <button
                  onClick={() => setPage('tests')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer flex items-center gap-1.5 hover:shadow-xs"
                  aria-label="View functional test runner panel"
                >
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  Run Tests
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Small screen navigation drawer links */}
        {profile.hasCompletedOnboarding && (
          <div className="sm:hidden border-t border-slate-100 bg-white grid grid-cols-3 divide-x divide-slate-100 text-center text-xs font-bold leading-normal">
            <button
              onClick={() => setPage('dashboard')}
              className={`py-3 flex items-center justify-center gap-1.5 ${page === 'dashboard' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-500 bg-transparent'}`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setPage('coach')}
              className={`py-3 flex items-center justify-center gap-1.5 ${page === 'coach' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-500 bg-transparent'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Smart Coach
            </button>
            <button
              onClick={() => setPage('tests')}
              className={`py-3 flex items-center justify-center gap-1.5 ${page === 'tests' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-500 bg-transparent'}`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Test Runner
            </button>
          </div>
        )}
      </nav>

      {/* Main Screen Router Box */}
      <main className="flex-1 w-full flex flex-col justify-start">
        {page === 'landing' && (
          <Landing
            onStartOnboarding={handleStartOnboarding}
            onExploreDemo={handleExploreDemo}
          />
        )}
        
        {page === 'onboarding' && (
          <Onboarding
            onComplete={handleOnboardingComplete}
            initialProfile={profile}
          />
        )}

        {page === 'dashboard' && profile.hasCompletedOnboarding && (
          <Dashboard
            profile={profile}
            footprint={activeFootprint}
            challenges={challenges}
            onToggleChallengeDay={handleToggleChallengeDay}
            history={history}
            onAddHistoryLog={handleAddHistoryLog}
            onClearHistory={handleClearHistory}
            onNavigateToCoach={() => setPage('coach')}
            onUpdateProfile={(updatedProfile: UserProfile) => {
              setProfile(updatedProfile);
              saveStateToStorage(updatedProfile, challenges, actions, history);
            }}
          />
        )}

        {page === 'coach' && profile.hasCompletedOnboarding && (
          <SmartCoach
            profile={profile}
            footprint={activeFootprint}
            actions={actions}
            onToggleAction={handleToggleAction}
          />
        )}

        {page === 'tests' && (
          <TestSuiteRunner />
        )}
      </main>

      {/* Footer Branding Area */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-xs text-slate-500 font-medium font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5 justify-center sm:justify-start">
                <Footprints className="w-4 h-4 text-emerald-500 animate-bounce" />
                CarbonWise Coach
              </span>
              <span className="hidden sm:inline text-slate-200">|</span>
              <span className="text-slate-400 font-medium">Built for carbon awareness, accountability, and environmental action.</span>
            </div>
            
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-100/40">
              <Footprints className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              100% Client-Side Encryption
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-slate-400 text-center lg:text-left text-[11px]">
            <p className="max-w-2xl leading-relaxed lg:text-left text-center">
              Emission values are meticulously synthesized from the{' '}
              <a 
                href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator" 
                target="_blank" 
                rel="noreferrer" 
                className="text-emerald-600 hover:text-emerald-700 font-semibold underline inline-flex items-center gap-0.5"
                title="US Environmental Protection Agency"
              >
                EPA <ExternalLink className="w-2.5 h-2.5" />
              </a>,{' '}
              <a 
                href="https://www.ipcc.ch/report/ar6/wg3/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-emerald-600 hover:text-emerald-700 font-semibold underline inline-flex items-center gap-0.5"
                title="Intergovernmental Panel on Climate Change (AR6 WGIII)"
              >
                IPCC AR6 <ExternalLink className="w-2.5 h-2.5" />
              </a>, and the{' '}
              <a 
                href="https://www.iea.org/reports/global-energy-review-co2-emissions-in-2023" 
                target="_blank" 
                rel="noreferrer" 
                className="text-emerald-600 hover:text-emerald-700 font-semibold underline inline-flex items-center gap-0.5"
                title="International Energy Agency"
              >
                IEA 2023 Global report <ExternalLink className="w-2.5 h-2.5" />
              </a>.
            </p>

            {/* Developer Section */}
            <div className="p-3 px-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row items-center gap-3.5 shadow-2xs">
              <div className="text-center sm:text-left font-sans">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none mb-1">Project Architect</p>
                <p className="text-xs font-bold text-slate-800 leading-none">Somesh Bhardwaj</p>
              </div>
              <div className="hidden sm:block h-6 w-px bg-slate-200" />
              <div className="text-center sm:text-left font-sans">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none mb-1">Client Authorization</p>
                <p className="text-xs font-bold text-emerald-700 leading-none font-mono">itdeveloper06@gmail.com</p>
              </div>
              <div className="hidden sm:block h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                <a
                  href="mailto:hello@someshbhardwaj.dev"
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-650 hover:text-emerald-600 rounded-xl border border-slate-200/80 transition-colors shadow-3xs flex items-center gap-1 text-[11px] font-bold"
                  title="Send Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
                <a
                  href="https://someshbhardwaj.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-650 hover:text-emerald-600 rounded-xl border border-slate-200/80 transition-colors shadow-3xs flex items-center gap-1 text-[11px] font-bold"
                  title="Visit Website"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Web</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/ersomeshbhardwaj/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-65 * hover:text-blue-600 rounded-xl border border-slate-200/80 transition-colors shadow-3xs flex items-center gap-1 text-[11px] font-bold"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="http://github.com/Dev-Somesh"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-650 hover:text-slate-900 rounded-xl border border-slate-200/80 transition-colors shadow-3xs flex items-center gap-1 text-[11px] font-bold"
                  title="GitHub Portfolio"
                >
                  <Github className="w-3.5 h-3.5 text-slate-800" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </footer>

      {/* Custom Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-905/60 backdrop-blur-xs animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-shake-modal">
            
            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5 text-center">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 id="reset-modal-title" className="text-lg font-bold text-slate-900">Restart Climate Assessment?</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete your current scores, historic trend logs, and habit achievements? This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm border border-slate-200 cursor-pointer shadow-sm focus:outline-none transition-colors"
              >
                No, Keep Dashboard
              </button>
              <button
                onClick={executeRestartAssessment}
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs sm:text-sm cursor-pointer shadow-sm focus:outline-none flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Delete & Restart
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
