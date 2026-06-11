import type { WeeklyChallenge } from '../../types';
import type { WeekDay } from '../../utils/weekDays';

interface WeeklyChallengesProps {
  challenges: WeeklyChallenge[];
  currentWeekDays: WeekDay[];
  onToggleDay: (challengeId: string, dateStr: string) => void;
  onDayLogged: (display: string) => void;
}

const CATEGORY_STYLES: Record<string, string> = {
  transport: 'bg-sky-100 text-sky-800',
  diet: 'bg-amber-100 text-amber-850',
  energy: 'bg-emerald-100 text-emerald-800',
  shopping: 'bg-indigo-100 text-indigo-800',
};

export default function WeeklyChallenges({
  challenges,
  currentWeekDays,
  onToggleDay,
  onDayLogged,
}: WeeklyChallengesProps) {
  return (
    <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8" aria-labelledby="challenges-title">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 id="challenges-title" className="text-xl font-bold text-slate-800">
            Weekly Habit Challenges Tracker
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Log your active days this week. Each marked grid represents carbon directly saved from your lifestyle.
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-200/50">
          Active Challenges: {challenges.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {challenges.slice(0, 4).map((challenge) => {
          const completedCount = challenge.daysCompleted.length;
          const pct = Math.round((completedCount / 7) * 100);
          const categoryStyle = CATEGORY_STYLES[challenge.category] ?? CATEGORY_STYLES.shopping;

          return (
            <div key={challenge.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100/80 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${categoryStyle}`}>
                      {challenge.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 mt-2">{challenge.title}</h3>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-600 shrink-0">-{challenge.impactKg} kg/wk</span>
                </div>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">{challenge.description}</p>
              </div>

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
                          onToggleDay(challenge.id, day.dateStr);
                          if (!isSelected) onDayLogged(day.display);
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

                <div className="w-full bg-slate-200 h-1 rounded overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
