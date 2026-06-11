import type { ScoreViewMode } from '../../domain/dashboardTypes';

interface Classification {
  label: string;
  description: string;
  color: string;
}

interface CarbonScoreGaugeProps {
  footprintTotal: number;
  classification: Classification;
  scoreViewMode: ScoreViewMode;
  onViewModeChange: (mode: ScoreViewMode) => void;
}

export default function CarbonScoreGauge({
  footprintTotal,
  classification,
  scoreViewMode,
  onViewModeChange,
}: CarbonScoreGaugeProps) {
  const strokeColor = footprintTotal > 10000 ? '#f43f5e' : footprintTotal > 6000 ? '#f59e0b' : '#10b981';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Carbon Footprint Score</h2>
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => onViewModeChange('footprint')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all whitespace-nowrap ${
                scoreViewMode === 'footprint'
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Art View
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('gauge')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all whitespace-nowrap ${
                scoreViewMode === 'gauge'
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Meter View
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center py-4">
          <div className="relative w-36 h-36 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="40" stroke="#eaeaea" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={strokeColor}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={Math.max(0, 251.2 - (251.2 * Math.min(footprintTotal, 15000)) / 15000)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-slate-950 font-mono">
                {Math.round(footprintTotal / 100) / 10}
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Tons CO2e / yr</p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${classification.color} text-center max-w-xs`}>
            {classification.label}
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed text-center border-t border-slate-100 pt-4">
        {classification.description}
      </p>
    </div>
  );
}
