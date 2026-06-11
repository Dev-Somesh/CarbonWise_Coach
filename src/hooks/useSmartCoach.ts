import { useState, useRef, useEffect, FormEvent } from 'react';
import { UserProfile, CarbonFootprint, SustainabilityAction, CoachInsight } from '../types';
import { truncateChatMessages } from '../utils/apiValidation';

export type ChatMessage = { role: 'user' | 'assistant'; text: string };
export type CoachTab = 'insights' | 'chat';

interface UseSmartCoachProps {
  profile: UserProfile;
  footprint: CarbonFootprint;
  actions: SustainabilityAction[];
}

const LOCAL_FALLBACK_INSIGHT = (profile: UserProfile, footprint: CarbonFootprint): CoachInsight => ({
  headline: `Hello, ${profile.name}! CarbonWise Coach local advisor is active.`,
  analysis: `We found that ${
    footprint.transport > footprint.diet && footprint.transport > footprint.energy
      ? 'weekly travel emissions'
      : footprint.energy > footprint.diet
      ? 'domestic grid power heating load'
      : 'dietary meat preferences'
  } represent your largest individual category. Implementing our targets can save over 1,500 kg per year combined!`,
  recommendations: [
    'Consider switching electric grid tariff contracts to renewable Solar wind supplies.',
    'Avoid short flight sectors or replace with hybrid electric rail travel options.',
    'Encourage meal planning around seasonal vegetables to lower overall agricultural outputs.',
  ],
  isAiGenerated: false,
});

function buildInitialMessage(profile: UserProfile, footprint: CarbonFootprint): ChatMessage {
  const tier =
    footprint.total < 2500 ? 'Champion'
    : footprint.total < 6000 ? 'Conscious Consumer'
    : footprint.total < 10000 ? 'Standard Consumer'
    : 'Climate Intensive';
  return {
    role: 'assistant',
    text: `Hello, **${profile.name || 'Eco Friend'}**! I am your dedicated Smart Sustainability Coach. 🌲\n\nYour calculated carbon rating is **${footprint.total.toLocaleString()} kg CO2e/year**. This means you are a ${tier} class user.\n\nType any message below to get personalized advice, green targets, or recipe transitions tailored specifically for you.`,
  };
}

export function useSmartCoach({ profile, footprint, actions }: UseSmartCoachProps) {
  const [insight, setInsight] = useState<CoachInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<CoachTab>('insights');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    buildInitialMessage(profile, footprint),
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const fetchInsights = async (_force = false) => {
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
          profileRaw: profile,
        }),
      });
      if (!response.ok) throw new Error('Server backend failed to respond correctly.');
      setInsight(await response.json());
    } catch (err: unknown) {
      console.error(err);
      setError('Could not connect to the remote Coach intelligence. Using offline rule-based advisor fallback instead.');
      setInsight(LOCAL_FALLBACK_INSIGHT(profile, footprint));
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchInsights(); }, [profile.name, footprint.total, footprint.transport, footprint.diet, footprint.energy, footprint.shopping]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    const next = [...chatMessages, { role: 'user' as const, text: userMsg }];
    setChatMessages(next);
    setChatLoading(true);

    try {
      const payload = truncateChatMessages(next).map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));
      const res = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload, profileRaw: profile }),
      });
      if (!res.ok) throw new Error('Problem reaching the chatbot service.');
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant' as const, text: data.text }]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant' as const, text: '⚠️ **Connection Timeout:** I cannot reach the server at this moment. If this persists, verify your GEMINI_API_KEY in the Secrets segment.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const clearChat = () => setChatMessages([{
    role: 'assistant',
    text: "History reset! Let's resume. Ask me anything about environmental footprints, recipes, or target offsets.",
  }]);

  const completedActions = actions.filter(a => a.completed);
  const totalSavings = completedActions.reduce((sum, a) => sum + a.impactKg, 0);
  const isAiActive = insight?.isAiGenerated === true && !insight?.isFallbackActive;

  return {
    insight, loading, error,
    activeTab, setActiveTab,
    chatMessages, chatInput, setChatInput, chatLoading,
    chatBottomRef,
    fetchInsights, handleSendMessage, clearChat,
    completedActions, totalSavings, isAiActive,
  };
}
