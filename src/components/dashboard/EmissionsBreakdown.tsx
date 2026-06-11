import type { CarbonFootprint } from '../../types';
import EmissionBar from '../EmissionBar';

interface EmissionsBreakdownProps {
  footprint: CarbonFootprint;
  categoryPct: { transport: number; diet: number; energy: number; shopping: number };
}

export default function EmissionsBreakdown({ footprint, categoryPct }: EmissionsBreakdownProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-5">Emissions Categorisation</h2>
        <div className="space-y-4" role="group" aria-label="Carbon category levels">
          <EmissionBar
            label="Transport"
            trailing={<span>{footprint.transport.toLocaleString()} kg ({Math.round(categoryPct.transport)}%)</span>}
            widthPercent={categoryPct.transport}
            dotClassName="bg-sky-400"
            barClassName="bg-sky-400"
          />
          <EmissionBar
            label="Diet & Food"
            trailing={<span>{footprint.diet.toLocaleString()} kg ({Math.round(categoryPct.diet)}%)</span>}
            widthPercent={categoryPct.diet}
            dotClassName="bg-amber-400"
            barClassName="bg-amber-400"
          />
          <EmissionBar
            label="Home Utilities"
            trailing={<span>{footprint.energy.toLocaleString()} kg ({Math.round(categoryPct.energy)}%)</span>}
            widthPercent={categoryPct.energy}
            dotClassName="bg-emerald-400"
            barClassName="bg-emerald-400"
          />
          <EmissionBar
            label="Shopping & Retail"
            trailing={<span>{footprint.shopping.toLocaleString()} kg ({Math.round(categoryPct.shopping)}%)</span>}
            widthPercent={categoryPct.shopping}
            dotClassName="bg-indigo-400"
            barClassName="bg-indigo-400"
          />
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4 mt-5 flex justify-between items-center text-xs text-slate-400 font-medium">
        <span>Annual estimations</span>
        <span className="font-mono text-emerald-600">{footprint.total.toLocaleString()} kg / yr</span>
      </div>
    </div>
  );
}
