import React from 'react';
import { UserProfile, CarbonFootprint, WeeklyChallenge, EmissionHistoryItem } from '../types';
import { Award, Compass, Heart, Zap, Trees, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface AchievementsProps {
  profile: UserProfile;
  footprint: CarbonFootprint;
  challenges: WeeklyChallenge[];
  history: EmissionHistoryItem[];
  triggerToast?: (msg: string) => void;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  requirement: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  unlocked: boolean;
}

export default function Achievements({ profile, footprint, challenges, history }: AchievementsProps) {
  // Dynamically calculate which achievements are unlocked
  const checkAchievements = (): BadgeDefinition[] => {
    // 1. Carbon Explorer: Logged at least 2 historical carbon footprint entries.
    const hasLogExplorer = history.length >= 2;

    // 2. Carbon Neutral Newbie: Total footprint below 8,000 kg CO2e/year
    const isNewbie = footprint.total < 8000;

    // 3. Green Guard Tech: Energy clean energy is solar or mixed
    const isEcoGrid = profile.energy.cleanEnergy === 'solar' || profile.energy.cleanEnergy === 'mixed';

    // 4. Locavore Feast: Diet sourcing set to mostly-local
    const isLocavore = profile.diet.sourcing === 'mostly-local';

    // 5. Urban Cruiser: Commute method is active, electric, or transit
    const isGreenCommuter = ['active', 'electric', 'transit'].includes(profile.transport.method);

    // 6. Eco Champion: Footprint below 4,500 kg CO2e/year
    const isEcoChampion = footprint.total < 4500;

    // 7. Habit Tracker: At least 3 overall challenge days completed across any challenge
    const challengeDaysCount = challenges.reduce((acc, curr) => acc + (curr.daysCompleted?.length || 0), 0);
    const hasHabitTracker = challengeDaysCount >= 3;

    // 8. Progress Pioneer: Reduced footprint compared to the first log in history
    const isProgressPioneer = history.length >= 2 && footprint.total < history[0].emissions.total;

    return [
      {
        id: 'carbon-explorer',
        title: 'Carbon Explorer',
        description: 'Began historical recording to map sustainability over time.',
        requirement: 'Log 2 or more footprint status points.',
        icon: Compass,
        colorClass: 'text-sky-600',
        bgClass: 'bg-sky-50',
        borderClass: 'border-sky-100',
        unlocked: hasLogExplorer,
      },
      {
        id: 'carbon-neutral-newbie',
        title: 'Carbon Neutral Newbie',
        description: 'Successfully capped overall footprint below the 8k threshold.',
        requirement: 'Annual emissions below 8,000 kg CO2e.',
        icon: ShieldCheck,
        colorClass: 'text-yellow-600',
        bgClass: 'bg-yellow-50',
        borderClass: 'border-yellow-250/60',
        unlocked: isNewbie,
      },
      {
        id: 'green-guard-tech',
        title: 'Green Grid Guard',
        description: 'Elected to source clean energy contracts or hybrid wind/solar grids.',
        requirement: 'Select hybrid or green solar electric contract.',
        icon: Zap,
        colorClass: 'text-amber-600',
        bgClass: 'bg-amber-50',
        borderClass: 'border-amber-200',
        unlocked: isEcoGrid,
      },
      {
        id: 'locavore-feast',
        title: 'Locavore Feast',
        description: 'Decreased food miles by prioritizing local seasonal crops.',
        requirement: 'Set produce sourcing priority to local.',
        icon: Heart,
        colorClass: 'text-rose-600',
        bgClass: 'bg-rose-50',
        borderClass: 'border-rose-100',
        unlocked: isLocavore,
      },
      {
        id: 'urban-cruiser',
        title: 'Transit Maestro',
        description: 'Eschewed high-impact travel for trains, active walks, or electric drive.',
        requirement: 'Commute via active steps, public rail, or EV.',
        icon: Sparkles,
        colorClass: 'text-indigo-600',
        bgClass: 'bg-indigo-50',
        borderClass: 'border-indigo-100',
        unlocked: isGreenCommuter,
      },
      {
        id: 'eco-champion',
        title: 'Eco Champion',
        description: 'Deep decimation of greenhouse profile matching global standards.',
        requirement: 'Curb emissions below 4,500 kg CO2e/year.',
        icon: Trees,
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-50',
        borderClass: 'border-emerald-250/50',
        unlocked: isEcoChampion,
      },
      {
        id: 'habit-tracker',
        title: 'Habit Hacker',
        description: 'Diligently committed to physical daily sustainability checklists.',
        requirement: 'Dodge challenges by checking off 3 times.',
        icon: Award,
        colorClass: 'text-teal-600',
        bgClass: 'bg-teal-50',
        borderClass: 'border-teal-200',
        unlocked: hasHabitTracker,
      },
      {
        id: 'progress-pioneer',
        title: 'Progress Pioneer',
        description: 'Actively bent your emission curve downwards compared to the initial log.',
        requirement: 'Capped emissions below your historic starting point.',
        icon: TrendingDown,
        colorClass: 'text-purple-600',
        bgClass: 'bg-purple-50',
        borderClass: 'border-purple-200',
        unlocked: isProgressPioneer,
      },
    ];
  };

  const badges = checkAchievements();
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div id="achievements-section-card" className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2" id="achievements-title">
            <Award className="w-5 h-5 text-emerald-600" />
            Ecological Milestones & Badges
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Collect special tokens by modifying real habits and logging sustainable actions.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-emerald-550/5 border border-emerald-500/20 px-3.5 py-1.5 rounded-2xl">
          <span className="text-xs font-bold text-emerald-700 font-mono">
            {unlockedCount} / {badges.length} Badges Claimed
          </span>
          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Badges — 2 cols on mobile, 4 on md+, full page width */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="badges-grid-container">
        {badges.map((badge, index) => {
          const IconComponent = badge.icon;
          return (
            <motion.div
              key={badge.id}
              id={`badge-card-${badge.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-5 rounded-2xl border transition-all duration-300 relative flex flex-col gap-3 ${
                badge.unlocked
                  ? `${badge.bgClass} ${badge.borderClass} shadow-xs hover:shadow-md hover:scale-[1.02]`
                  : 'bg-slate-50/60 border-slate-100 opacity-55 grayscale'
              }`}
            >
              {/* Icon + title row */}
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  badge.unlocked
                    ? `bg-white shadow-xs border border-slate-100 ${badge.colorClass}`
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  <IconComponent className="w-5 h-5" aria-hidden="true" />
                </div>
                <h4 className={`text-sm font-bold leading-snug ${
                  badge.unlocked ? 'text-slate-800' : 'text-slate-500'
                }`}>
                  {badge.title}
                </h4>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                {badge.description}
              </p>

              {/* Requirement */}
              <div className="pt-2.5 border-t border-slate-200/60">
                <p className="text-[11px] leading-relaxed">
                  <span className="font-mono font-bold text-slate-400 uppercase tracking-wide">Task: </span>
                  <span className={badge.unlocked ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                    {badge.requirement}
                  </span>
                </p>
              </div>

              {/* Unlocked pulse dot */}
              {badge.unlocked && (
                <div className="absolute top-3 right-3">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
