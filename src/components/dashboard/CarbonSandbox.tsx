import { Sparkles } from 'lucide-react';
import type { CarbonFootprint } from '../../types';

interface CarbonSandboxProps {
  footprint: CarbonFootprint;
  simTransportDistance: number;
  simTransportMethod: string;
  simDietType: string;
  simCleanEnergy: string;
  simulatedTotal: number;
  simulatedSavings: number;
  onDistanceChange: (value: number) => void;
  onTransportMethodChange: (value: string) => void;
  onDietTypeChange: (value: string) => void;
  onCleanEnergyChange: (value: string) => void;
  onApply: () => void;
}

export default function CarbonSandbox({
  footprint,
  simTransportDistance,
  simTransportMethod,
  simDietType,
  simCleanEnergy,
  simulatedTotal,
  simulatedSavings,
  onDistanceChange,
  onTransportMethodChange,
  onDietTypeChange,
  onCleanEnergyChange,
  onApply,
}: CarbonSandboxProps) {
  const delta =
    simulatedSavings > 0 ? (
      <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
        -{simulatedSavings.toLocaleString()} kg delta
      </span>
    ) : simulatedTotal > footprint.total ? (
      <span className="text-[10px] font-bold font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
        +{Math.abs(footprint.total - simulatedTotal).toLocaleString()} kg delta
      </span>
    ) : (
      <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-500/10 px-1.5 py-0.5 rounded">
        No change
      </span>
    );

  return (
    <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8" aria-labelledby="sandbox-title">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6 border-b border-slate-100 pb-5">
        <div>
          <h2 id="sandbox-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" aria-hidden="true" />
            Real-Time &ldquo;What-If&rdquo; Carbon Sandbox Simulator
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Play with lifestyle sliders to model emission changes before committing.
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
          Interactive Playground
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>🚘 Commute Travel Distance</span>
              <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                {simTransportDistance} km / week
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={simTransportDistance}
              onChange={(e) => onDistanceChange(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
              aria-label="Commute travel distance in kilometers per week"
            />
            <p className="text-[10px] text-slate-400">Reduce to model work-from-home or active cycling commutes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
            <div className="space-y-1.5">
              <label htmlFor="sim-transport-method" className="text-xs font-bold text-slate-700 block">
                🚄 Transition Vehicle
              </label>
              <select
                id="sim-transport-method"
                value={simTransportMethod}
                onChange={(e) => onTransportMethodChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
              >
                <option value="petrol">Petrol Powered Car</option>
                <option value="diesel">Diesel Powered Car</option>
                <option value="electric">Electric Vehicle (EV)</option>
                <option value="transit">Public Rail/Metro</option>
                <option value="active">Active Walk/Cycle</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="sim-diet-type" className="text-xs font-bold text-slate-700 block">
                🥗 Alternate Diet Choice
              </label>
              <select
                id="sim-diet-type"
                value={simDietType}
                onChange={(e) => onDietTypeChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
              >
                <option value="heavy-meat">Frequent Meat</option>
                <option value="medium-meat">Balanced Mix</option>
                <option value="low-meat">Low Meat / Flexi</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan (100% Plant)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="sim-clean-energy" className="text-xs font-bold text-slate-700 block">
                ⚡ Home Tariff Source
              </label>
              <select
                id="sim-clean-energy"
                value={simCleanEnergy}
                onChange={(e) => onCleanEnergyChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
              >
                <option value="standard">Standard Grid</option>
                <option value="mixed">Mixed Solar/Wind</option>
                <option value="solar">100% Solar Tariff</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Sandbox Predictions</span>
            <div className="mt-3">
              <div className="text-3xl font-extrabold font-mono text-emerald-400">
                {simulatedTotal.toLocaleString()} <span className="text-xs font-sans font-bold text-white">kg/yr</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 leading-normal flex items-center flex-wrap gap-1.5">
                Proposed carbon score {delta}
              </div>
            </div>
            <div className="border-t border-slate-850 pt-4 mt-4 text-xs space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-400">Paris target boundary:</span>
                <span className="text-slate-300">2,000 kg</span>
              </div>
              {simulatedTotal <= 2000 ? (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300 font-medium">
                  Excellent: this combination aligns with the 2,000 kg climate target.
                </div>
              ) : (
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300 font-medium">
                  Tip: try solar power or a plant-based diet to reach the 2,000 kg target.
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onApply}
            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Apply Sandbox Options to Profile
          </button>
        </div>
      </div>
    </section>
  );
}
