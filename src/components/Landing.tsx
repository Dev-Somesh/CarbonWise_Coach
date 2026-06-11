import React from 'react';
import { Leaf, ArrowRight, ShieldCheck, Sparkles, Flame, HelpCircle, Car, Utensils, Zap, ShoppingBag, Globe, Award, Heart, MessageSquare, Footprints, LineChart, Sliders, FileText, Bot, Trophy, TrendingDown, CheckCircle2 } from 'lucide-react';

interface LandingProps {
  onStartOnboarding: () => void;
  onExploreDemo: () => void;
}

export default function Landing({ onStartOnboarding, onExploreDemo }: LandingProps) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Decorative Blur Orbs for visual depth */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-10 -right-20 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center relative z-10">
        
        {/* Hero Header Section */}
        <header className="text-center max-w-3xl mb-16 md:mb-24 animate-fade-in" id="landing-header">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 backdrop-blur-xs text-emerald-800 rounded-full text-xs sm:text-sm font-semibold mb-6 border border-emerald-100/85 shadow-xs">
            <Footprints className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="tracking-wide text-emerald-750">CarbonWise Coach Emissions Hub & Planner</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Take Charge of Your{' '}
            <span className="relative inline-block text-emerald-600 font-extrabold">
              Carbon Impact
              <span className="absolute left-0 bottom-1 w-full h-2 bg-emerald-100/70 -z-10 rounded" />
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
            Meet CarbonWise Coach. A high-fidelity personal sustainability hub designed to analyze your footprint, propose micro-targeted habits, and keep you engaged with actionable carbon challenges.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              id="btn-start-coaching"
              onClick={onStartOnboarding}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base outline-none cursor-pointer"
              aria-label="Start your climate assessment"
            >
              Calculate Your Footprint
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            
            <button
              id="btn-explore-demo"
              onClick={onExploreDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm sm:text-base outline-none cursor-pointer"
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
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="features-title" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Track Carbon Across Four Key Lifeline Pillars
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              We divide your footprint calculation into targeted daily sectors to isolate and target reductions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Transport */}
            <div className="group p-6 bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-sky-50 text-sky-600 group-hover:bg-sky-100 group-hover:scale-105 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors group-hover:text-emerald-700">Transportation</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Analyze emissions from commutes, airline itineraries, travel times, and quantify shifts to clean transit or EV options.
              </p>
            </div>

            {/* Card 2: Food & Diet */}
            <div className="group p-6 bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 group-hover:bg-amber-100 group-hover:scale-105 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors group-hover:text-emerald-700">Food & Nutrition</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Measure meat footprint impacts, food decay estimates, and organic sourcing parameters to develop eco-friendly culinary habits.
              </p>
            </div>

            {/* Card 3: Energy */}
            <div className="group p-6 bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 group-hover:scale-105 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors group-hover:text-emerald-700">Home Utilities</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Include size, appliance counts, and clean energy tariff integrations to pinpoint electrical and climate control overheads.
              </p>
            </div>

            {/* Card 4: Shopping */}
            <div className="group p-6 bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-105 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors group-hover:text-emerald-700">Shopping & Waste</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Review clothing updates, tech lifecycle spans, and recycling commitments to offset manufacturing and packaging emissions.
              </p>
            </div>

          </div>
        </section>

        {/* Advanced Dashboard & Tools Infographic Section */}
        <section className="w-full mb-16 md:mb-24" aria-labelledby="infographic-title">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100/80 shadow-3xs">Advanced Ecosystem</span>
            <h2 id="infographic-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
              Explore Our Powerful Sustainability Toolkit
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-3 font-semibold leading-relaxed">
              Unlock a comprehensive, real-time climate workspace engineered to support your long-term decarbonization journey step-by-step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Recharts Trendlines */}
            <div className="bg-white hover:bg-emerald-50/5 hover:border-emerald-200 rounded-3xl p-6 sm:p-8 border border-slate-200/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-3xs border border-emerald-100/50">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors">Chronological Trend Mapping</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  Trace emission reductions over multiple timeline logs. Our advanced trend charting system projects baseline curves to measure improvement visually.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Visual Analytics Engine</span>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-100/65 px-2 py-0.5 rounded text-emerald-800">Recharts</span>
              </div>
            </div>

            {/* Feature 2: What-If Sandbox Carbon Simulator */}
            <div className="bg-white hover:bg-amber-50/5 hover:border-amber-200 rounded-3xl p-6 sm:p-8 border border-slate-200/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-3xs border border-amber-100/50">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors">"What-If" Slider Sandbox</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  Simulate adjustments to your travel bounds, dietary habits, home power consumption, and retail habits in real-time before modifying your active profile constants.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Hypothetical Sandbox</span>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-amber-100/65 px-2 py-0.5 rounded text-amber-805">Simulate</span>
              </div>
            </div>

            {/* Feature 3: Trophy & Badges Achievements */}
            <div className="bg-white hover:bg-indigo-50/5 hover:border-indigo-200 rounded-3xl p-6 sm:p-8 border border-slate-200/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-650 rounded-2xl flex items-center justify-center mb-6 shadow-3xs border border-indigo-100/50">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors">Milestones & Eco Badges</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  Unlock visual medals and achievements. Complete clean challenges and maintain low footprint bands to earn ranks like "Zero-Waste Warrior".
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                <span>Gamified Badges Tracker</span>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-indigo-100/65 px-2 py-0.5 rounded text-indigo-805">Trophies</span>
              </div>
            </div>

            {/* Feature 4: Interactive Challenges & Commitments */}
            <div className="bg-white hover:bg-sky-50/5 hover:border-sky-200 rounded-3xl p-6 sm:p-8 border border-slate-200/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-3xs border border-sky-100/50">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors">Habit Challenges & Quick Wins</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  Commit to specific daily or weekly ecological habit shifts. Checking off completed activities immediately lowers your total active carbon emissions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
                <span>Dynamic Ledger Impact</span>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-sky-100/65 px-2 py-0.5 rounded text-sky-805">Commit</span>
              </div>
            </div>

            {/* Feature 5: Smart Coach AI Advice */}
            <div className="bg-white hover:bg-rose-50/5 hover:border-rose-200 rounded-3xl p-6 sm:p-8 border border-slate-200/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-3xs border border-rose-100/50">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors">Personal Smart AI Advisor</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  Consult our intelligent chat assistant. Powered by Gemini, the coach analyzes your numeric coordinates to formulate localized, specific actions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-700">
                <span>Real-Time Conversation</span>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-rose-100/65 px-2 py-0.5 rounded text-rose-805">Gemini AI</span>
              </div>
            </div>

            {/* Feature 6: Audit-Grade PDF Export */}
            <div className="bg-white hover:bg-purple-50/5 hover:border-purple-200 rounded-3xl p-6 sm:p-8 border border-slate-200/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-3xs border border-purple-100/50">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 transition-colors">Premium PDF Journey Audits</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  Generate beautiful, print-ready carbon audit files directly inside your browser. Download detailed summaries, comparisons, and custom coaching matrices.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                <span>Client-Side Document Builder</span>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-purple-100/65 px-2 py-0.5 rounded text-purple-805 font-semibold">jsPDF</span>
              </div>
            </div>

          </div>
        </section>

        {/* Why CarbonWise Coach Section */}
        <section 
          className="w-full bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-150 flex flex-col lg:flex-row gap-10 items-center mb-6"
          aria-labelledby="why-it-works-title"
        >
          <div className="flex-1 space-y-6">
            <div>
              <h2 id="why-it-works-title" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Designed for genuine behavioral changes
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed font-medium">
                Instead of static calculators that output dry, unengaging data tables, CarbonWise Coach maps active lifestyle parameters to structured targets.
              </p>
            </div>
            
            <div className="space-y-5">
              
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">Gemini Personalized Climate Advice</h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium mt-0.5">
                    Utilizes server-side Gemini 3.5 AI context to synthesize custom advice tailored directly to your score, giving you an interactive, real-time consultation experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">Daily Action Commitments</h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium mt-0.5">
                    Actively register daily or weekly green habits! Completing activities immediately deducts calculated weight from your profile score.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">Secure Local Data Sandbox</h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium mt-0.5">
                    Progress is saved locally in your browser. AI coaching features send profile data to the server when you use them. No account login required.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="flex-1 w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/70 shadow-sm flex flex-col justify-between max-w-md relative overflow-hidden">
            {/* Soft decorative background element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">Climatic Baseline Target</span>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] font-bold border border-rose-100 uppercase tracking-wider">
                  Important
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Limit global warming to 1.5°C</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                To keep global warming within safe historical boundaries, environmental agencies have targeted a threshold of less than <strong className="text-slate-800">2,000 kg CO2e</strong> of emissions annually per individual. Find out where you stand!
              </p>
            </div>
            
            <button
              onClick={onStartOnboarding}
              className="w-full text-center py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold rounded-xl text-xs sm:text-sm transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              Check Your Numbers Now
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
