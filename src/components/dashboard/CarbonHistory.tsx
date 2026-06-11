import { AlertCircle, Trash2, TrendingDown } from 'lucide-react';
import type { EmissionHistoryItem } from '../../types';
import DashboardWidget from '../DashboardWidget';

interface CarbonHistoryProps {
  history: EmissionHistoryItem[];
  onClearHistory: () => void;
  onDownloadJSON: () => void;
}

export default function CarbonHistory({ history, onClearHistory, onDownloadJSON }: CarbonHistoryProps) {
  return (
    <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8" aria-labelledby="history-title">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 id="history-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-500" aria-hidden="true" />
            Historic Performance & Carbon Logs
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Check your carbon decrease history across generated logs. Click &quot;Log Week&quot; in the header to add entries.
          </p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 rounded-xl text-xs font-bold transition-all outline-none cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            Reset Logs
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center p-6 text-slate-400">
          <AlertCircle className="w-8 h-8 text-slate-300 mb-3" aria-hidden="true" />
          <h4 className="font-bold text-slate-700 text-sm">No Carbon Progress Logged Yet</h4>
          <p className="text-xs mt-1 leading-relaxed max-w-sm">
            Press &quot;Log Week&quot; in the header to record your footprint and track trends over time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DashboardWidget history={history} onDownloadJSON={onDownloadJSON} />
          </div>

          <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
            {history.map((log, idx) => {
              const diff = idx > 0 ? history[idx - 1].emissions.total - log.emissions.total : 0;
              return (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">{log.date}</span>
                    <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">
                      {Math.round(log.emissions.total / 100) / 10} t CO2e
                    </h4>
                  </div>

                  {diff > 0 ? (
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-bold font-mono px-2 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
                      -{diff.toLocaleString()} kg
                    </span>
                  ) : idx > 0 && diff < 0 ? (
                    <span className="text-xs bg-rose-50 text-rose-700 font-bold font-mono px-2 py-1 rounded-lg border border-rose-100">
                      +{Math.abs(diff).toLocaleString()} kg
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-50 text-slate-400 font-mono font-bold px-2 py-1 rounded border border-slate-100">
                      Baseline Point
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
