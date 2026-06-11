import { Award, RotateCw, Zap } from 'lucide-react';
import type { EmissionCategory, QuickWinTip } from '../../types';

export interface QuickWinCardBaseProps {
  primaryCategory: EmissionCategory;
  activeTip: QuickWinTip;
}

interface QuickWinTeaserProps extends QuickWinCardBaseProps {
  variant: 'teaser';
  onTeaserClick: () => void;
}

interface QuickWinFullProps extends QuickWinCardBaseProps {
  variant?: 'full';
  hasCompleted: boolean;
  onComplete: () => void;
  onShuffle: () => void;
}

type QuickWinCardProps = QuickWinTeaserProps | QuickWinFullProps;

export default function QuickWinCard(props: QuickWinCardProps) {
  const { primaryCategory, activeTip } = props;

  if (props.variant === 'teaser') {
    const { onTeaserClick } = props;
    return (
      <button
        type="button"
        onClick={onTeaserClick}
        className="w-full flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 text-white rounded-2xl text-left hover:bg-slate-850 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      >
        <div className="p-2 bg-slate-800 rounded-xl shrink-0">
          <Zap className="w-4 h-4 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Today&apos;s quick win · {primaryCategory.label}
          </p>
          <p className="text-sm font-bold truncate">{activeTip.title}</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 shrink-0">Take action →</span>
      </button>
    );
  }

  const { hasCompleted, onComplete, onShuffle } = props;

  return (
    <div
      id="daily-quick-win-card"
      className="relative bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md transition-all duration-300"
    >
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
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{activeTip.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto z-10 shrink-0">
        {hasCompleted ? (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-bold w-full md:w-auto justify-center animate-fade-in">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Win Completed! (+50 pts)</span>
          </div>
        ) : (
          <button
            id="btn-complete-quick-win"
            type="button"
            onClick={onComplete}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md hover:shadow-emerald-600/10 cursor-pointer transition-all flex items-center justify-center gap-1.5 w-full md:w-auto hover:-translate-y-0.5 active:translate-y-0 outline-none"
          >
            <span>Done, Check Off</span>
          </button>
        )}

        <button
          id="btn-shuffle-quick-win"
          type="button"
          onClick={onShuffle}
          className="p-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-750/80 shadow-xs focus:outline-none cursor-pointer transition-all focus:ring-1 focus:ring-slate-700"
          title="Suggest another quick win match"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
