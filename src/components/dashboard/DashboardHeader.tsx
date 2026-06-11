import { Calendar, FileText, HelpCircle, Share2 } from 'lucide-react';
import type { CarbonFootprint, UserProfile } from '../../types';

interface Classification {
  label: string;
  color: string;
}

interface DashboardHeaderProps {
  profile: UserProfile;
  footprint: CarbonFootprint;
  classification: Classification;
  targetMultiplier: string;
  isSimulating: boolean;
  onOpenMethodology: () => void;
  onGeneratePDF: () => void;
  onLogWeek: () => void;
  onShare: () => void;
}

export default function DashboardHeader({
  profile,
  footprint,
  classification,
  targetMultiplier,
  isSimulating,
  onOpenMethodology,
  onGeneratePDF,
  onLogWeek,
  onShare,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200/60 p-5 sm:p-6 rounded-2xl">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            My Dashboard
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${classification.color}`}>
            {classification.label}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1.5">
          Welcome, <span className="text-emerald-700">{profile.name}</span>
        </h1>
        <p className="text-slate-600 text-sm mt-0.5">
          <span className="font-mono font-bold text-slate-900">
            {(Math.round(footprint.total / 100) / 10).toFixed(1)} t
          </span>
          <span className="text-slate-400"> CO₂e/yr</span>
          <span className="text-slate-400 mx-1.5">·</span>
          <span className="text-slate-500">{targetMultiplier}× climate target</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenMethodology}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          <span className="hidden sm:inline">Methodology</span>
        </button>

        <button
          id="btn-download-pdf-report"
          type="button"
          onClick={onGeneratePDF}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
          <span className="hidden sm:inline">PDF</span>
        </button>

        <button
          type="button"
          onClick={onLogWeek}
          disabled={isSimulating}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-xl shadow cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          {isSimulating ? 'Recording…' : 'Log Week'}
        </button>

        <button
          type="button"
          onClick={onShare}
          className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
          aria-label="Export scorecard"
        >
          <Share2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
