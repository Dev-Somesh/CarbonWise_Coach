import React from 'react';
import { Leaf, ArrowRight, ShieldCheck, Sparkles, Flame, HelpCircle } from 'lucide-react';

interface LandingProps {
  onStartOnboarding: () => void;
  onExploreDemo: () => void;
}

export default function Landing({ onStartOnboarding, onExploreDemo }: LandingProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center">
      
      {/* Hero Header Section */}
      <header className="text-center max-w-3xl mb-12 md:mb-16 animate-fade-in" id="landing-header">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6 border border-emerald-100">
          <Leaf className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>Empowering Eco Actions</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Take Charge of Your <span className="text-emerald-600 font-extrabold">Carbon Impact</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
          Meet CarbonWise Coach. A personalized sustainability assistant designed to calculate your footprint, suggest clear contextual changes, and motivate you with enjoyable weekly challenges.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            id="btn-start-coaching"
            onClick={onStartOnboarding}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-100 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-base outline-none cursor-pointer"
            aria-label="Start your climate assessment"
          >
            Calculate Your Footprint
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            id="btn-explore-demo"
            onClick={onExploreDemo}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 text-base outline-none cursor-pointer"
            aria-label="Explore the demo dashboard with template data"
          >
            Explore Dashboard Demo
          </button>
        </div>
      </header>

      {/* Categories Bento Grid Preview */}
      <section 
        className="w-full mb-16 md:mb-24" 
        aria-labelledby="features-title"
      >
        <h2 id="features-title" className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10 tracking-tight">
          Track Carbon Across Four Key Lifeline Pillars
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Transport */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Transportation</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Analyze emission outputs from weekly commutes, flight frequencies, and transition opportunities for active or green travel.
            </p>
          </div>

          {/* Card 2: Food & Diet */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Food & Nutrition</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Highlight red meat impact rates, global transportation logistics waste, and food decay options to build robust eating habits.
            </p>
          </div>

          {/* Card 3: Energy */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Home Utilities</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Factor household size, high-intensity appliances, and green contract selections to measure precise heating load outputs.
            </p>
          </div>

          {/* Card 4: Shopping */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Shopping & Waste</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Track manufacturing cost from fast apparel, electronics lifespans, and recycling diligence to reduce retail carbon leakage.
            </p>
          </div>

        </div>
      </section>

      {/* Why CarbonWise Coach Section */}
      <section 
        className="w-full bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 flex flex-col lg:flex-row gap-10 items-center mb-10"
        aria-labelledby="why-it-works-title"
      >
        <div className="flex-1">
          <h2 id="why-it-works-title" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            Designed for genuine behavioral changes
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Unlike static spreadsheets listing abstract numbers, CarbonWise Coach matches your lifestyle choices to active practical improvements.
          </p>
          
          <div className="space-y-4">
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Gemini Personalized Climate Advice</h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  Sends metrics securely to a server-side Gemini 3.5 AI context for specialized insights, avoiding dry generic checklist loops.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Daily Action Commitments</h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select and register actions directly! Completing tasks immediately recalculates and reduces your live carbon scorecard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Secure Local Sandbox</h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  Everything compiles locally to HTML5 LocalStorage. No email or passwords required to track your improvement statistics.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="flex-1 w-full bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between max-w-md">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">Climatic Baseline Target</span>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-xs font-medium border border-rose-100">Urget Challenge</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Limit global warming to 1.5°C</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              To stay within safe global thresholds, climatologists estimated that every human needs to limit personal carbon emissions to less than <strong>2,000 kg CO2e</strong> per year. Let&apos;s see how close you currently stand.
            </p>
          </div>
          <button
            onClick={onStartOnboarding}
            className="w-full text-center py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-sm transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none cursor-pointer"
          >
            Check Your Numbers Now
          </button>
        </div>
      </section>

    </div>
  );
}
