import React from 'react';
import { Database, FileSpreadsheet, Scale, ExternalLink } from 'lucide-react';

export interface CalculationSource {
  title: string;
  version: string;
  purpose: string;
  citation: string;
  link: string;
}

export default function CalculationSources() {
  const sources = [
    {
      title: "US EPA GHG Registry",
      version: "2023 Consolidated Emission Factors",
      purpose: "Automotive combustion offsets & airline flight leg sector weights.",
      citation: "US Environmental Protection Agency (EPA) Emission Factors Hub.",
      link: "https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator"
    },
    {
      title: "IPCC WGIII AR6",
      version: "Sixth Assessment (Mitigation of Climate Change, 2023)",
      purpose: "Agricultural enteric methane multipliers & diet life cycle coefficients.",
      citation: "Intergovernmental Panel on Climate Change (IPCC) Special Reports.",
      link: "https://www.ipcc.ch/report/ar6/wg3/"
    },
    {
      title: "IEA Grid Emissions Index",
      version: "International Energy Report (IEA 2023)",
      purpose: "Static domestic electrical appliances & clean energy tariff discounts.",
      citation: "International Energy Agency (IEA) CO2 Emissions Annual Review.",
      link: "https://www.iea.org/reports/global-energy-review-co2-emissions-in-2023"
    }
  ];

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 mt-6 space-y-4">
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-emerald-600" />
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
          Source Report Versions
        </h4>
      </div>
      
      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
        All algorithmic calculations used inside CarbonWise Coach are validated against the specific report versions indexed below:
      </p>

      <div className="space-y-3">
        {sources.map((src, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-3 space-y-1 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {src.title}
              </span>
              <a 
                href={src.link} 
                target="_blank" 
                rel="noreferrer" 
                className="text-slate-400 hover:text-emerald-600 cursor-pointer p-0.5"
                title={`Open official ${src.title} reference`}
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-[10px] font-mono text-emerald-600 font-bold">
              {src.version}
            </div>
            <p className="text-[10px] leading-relaxed text-slate-500">
              {src.purpose}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 text-[9px] font-mono font-bold bg-slate-100 p-2 rounded-xl text-slate-400 border border-slate-200/50 justify-center">
        <Scale className="w-3 h-3 text-slate-400" />
        CO2e Coefficients Auto-Updated: June 2026
      </div>
    </div>
  );
}
