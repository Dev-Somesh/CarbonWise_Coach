import React, { useEffect, useState, useRef } from 'react';
import { UserProfile, CarbonFootprint, SustainabilityAction, CoachInsight } from '../types';
import { generateContextualRecommendations } from '../utils/recommendations';
import { Sparkles, ArrowRight, CheckCircle, Flame, ShieldCheck, RefreshCw, AlertCircle, Bookmark, MessageSquare, Send, Trash2 } from 'lucide-react';

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

  // Conversational AI States
  const [activeTab, setActiveTab] = useState<'insights' | 'chat'>('insights');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hello, **${profile.name || "Eco Friend"}**! I am your dedicated Smart Sustainability Coach. 🌲\n\nYour calculated carbon rating is **${footprint.total.toLocaleString()} kg CO2e/year**. This means you are a ${
        footprint.total < 2500 ? 'Champion' : footprint.total < 6000 ? 'Conscious Consumer' : footprint.total < 10000 ? 'Standard Consumer' : 'Climate Intensive'
      } class user.\n\nType any message below to get personalized advice, green targets, or recipe transitions tailored specifically for you.`
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom in chat
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Fetch smart insight dynamically from server route
  const fetchSmartCoachAdvice = async (force: boolean = false) => {
    if (loading) return;
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
  }, [profile.name]);

  // Handle send message to AI coach chat
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');

    const newMessages = [...chatMessages, { role: 'user' as const, text: userMsg }];
    setChatMessages(newMessages);
    setChatLoading(true);

    try {
      const formattedMessagesPaylaod = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedMessagesPaylaod,
          profileRaw: profile
        })
      });

      if (!res.ok) {
        throw new Error('Problem reaching the chatbot service.');
      }

      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant' as const, text: data.text }]);
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant' as const,
          text: `⚠️ **Connection Timeout:** I cannot reach the server at this moment. If this persists, verify your GEMINI_API_KEY in the Secrets segment.`
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Safe dynamic Markdown converter supporting bold text and bullet lines
  const renderFormattedText = (rawText: string) => {
    return rawText.split('\n').map((line, lineIdx) => {
      let processedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        const textBefore = line.substring(lastIndex, match.index);
        const boldText = match[1];
        if (textBefore) parts.push({ type: 'text', content: textBefore });
        parts.push({ type: 'bold', content: boldText });
        lastIndex = boldRegex.lastIndex;
      }
      const textAfter = line.substring(lastIndex);
      if (textAfter) parts.push({ type: 'text', content: textAfter });

      const lineContent = parts.length > 0 ? (
        <>
          {parts.map((p, pIdx) => p.type === 'bold' ? (
            <strong key={pIdx} className="font-extrabold text-emerald-400">{p.content}</strong>
          ) : (
            p.content
          ))}
        </>
      ) : line;

      // Bullet lists
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const cleanBulletText = line.replace(/^[\s*-]+/, '');
        return (
          <li key={lineIdx} className="list-disc ml-5 space-y-1 text-xs sm:text-sm text-slate-300 leading-relaxed my-1">
            {boldRegex.test(line) ? (
              (() => {
                const partsB = [];
                let lastB = 0;
                let matchB;
                const boldRegexB = /\*\*(.*?)\*\*/g;
                while ((matchB = boldRegexB.exec(cleanBulletText)) !== null) {
                  const bBefore = cleanBulletText.substring(lastB, matchB.index);
                  const bBold = matchB[1];
                  if (bBefore) partsB.push({ type: 'text', content: bBefore });
                  partsB.push({ type: 'bold', content: bBold });
                  lastB = boldRegexB.lastIndex;
                }
                const bAfter = cleanBulletText.substring(lastB);
                if (bAfter) partsB.push({ type: 'text', content: bAfter });
                return partsB.map((pb, pbIdx) => pb.type === 'bold' ? (
                  <strong key={pbIdx} className="font-extrabold text-emerald-400">{pb.content}</strong>
                ) : pb.content);
              })()
            ) : cleanBulletText}
          </li>
        );
      }

      // Main header styles inside conversation box
      if (line.trim().startsWith('###')) {
        return <h4 key={lineIdx} className="text-sm font-bold text-emerald-300 mt-3 mb-1">{line.replace('###', '').trim()}</h4>;
      }

      return line.trim() === '' ? (
        <div key={lineIdx} className="h-2" />
      ) : (
        <p key={lineIdx} className="text-xs sm:text-sm text-slate-300 leading-relaxed my-1">
          {lineContent}
        </p>
      );
    });
  };

  // Calculate carbon reductions made from completed actions
  const completedActions = actions.filter(a => a.completed);
  const totalSavings = completedActions.reduce((sum, a) => sum + a.impactKg, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in space-y-10">
      
      {/* Smart Coach Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">Smart Assistant</span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">Smart Sustainability Coach</h1>
          <p className="text-slate-500 text-sm mt-1">
            Personalized advice powered by deep logic algorithms and server-side Gemini 3.5 models.
          </p>
        </div>

        {/* Tab Swappers */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'insights'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 Insights & Plan
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            💬 Ask the Coach
          </button>
        </div>
      </div>

      {/* AI Assistant Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden" aria-labelledby="assistant-title">
        {/* Background glow styling */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          
          {/* TAB 1: INSIGHTS FEED */}
          {activeTab === 'insights' ? (
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
                  
                  <div className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {renderFormattedText(insight.analysis)}
                  </div>

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
          ) : (
            
            /* TAB 2: INTERACTIVE AI CHAT CONTAINER */
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">Climate Advisor Chatbot</span>
                    <span className="text-[10px] text-slate-400">Direct sandbox access to Gemini models</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setChatMessages([{
                      role: 'assistant',
                      text: `History reset! Let's resume. Ask me anything about environmental footprints, recipes, or target offsets.`
                    }]);
                  }}
                  className="p-1 px-2.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors outline-none cursor-pointer border border-transparent hover:border-slate-700"
                  title="Clear conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Chat
                </button>
              </div>

              {/* Msg screen */}
              <div className="h-80 overflow-y-auto pr-1 space-y-3.5 bg-slate-950/40 border border-slate-850 p-4 rounded-2xl">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 px-4 ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
                          : 'bg-slate-850 text-slate-100 border border-slate-800 rounded-tl-none'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-mono font-bold block text-emerald-300 mb-1">
                        {msg.role === 'user' ? 'Me' : 'Coach Bot'}
                      </span>
                      <div className="space-y-1.5 break-words">
                        {renderFormattedText(msg.text)}
                      </div>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-850 border border-slate-800 rounded-2xl p-3 px-4 rounded-tl-none max-w-[85%] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs text-slate-400 pl-1 font-mono">Synthesizing...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Message Input bar */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2.5">
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask and learn (e.g. 'How can I lower my fuel costs?')..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none placeholder:text-slate-500 focus:border-emerald-500/80 text-sm focus:ring-1 focus:ring-emerald-500/10 transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white shadow-md p-3.5 px-4.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Prompt Suggestion Pillboxes */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-850/50">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 mr-1 mt-1">Suggestions:</span>
                {[
                  "How to switch to renewable energy tariff",
                  "Suggest 3 vegetarian diet alternatives",
                  "Is a train better than a hybrid vehicle?"
                ].map((sStr, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => setChatInput(sStr)}
                    className="text-[11px] font-medium bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg p-1.5 px-2.5 cursor-pointer outline-none transition-colors"
                  >
                    💡 {sStr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RIGHT SIDEBAR: ADVISOR ACTIONS CARD */}
          <div className="lg:w-80 shrink-0 bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl flex flex-col justify-between h-56">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Coach Status</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold">Gemini 3.5 Engine Active</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Your credentials are loaded. Re-evaluate elements any time to regenerate recommendations or talk directly to the coach.
              </p>
            </div>

            <div className="space-y-2.5 pt-3">
              <button
                onClick={() => fetchSmartCoachAdvice(true)}
                disabled={loading}
                className="w-full text-center py-2 bg-slate-700 hover:bg-slate-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Re-evaluate Habits
              </button>
              <div className="text-[10px] text-center text-slate-500 font-semibold uppercase font-mono">
                Model: gemini-3.5-flash
              </div>
            </div>
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
