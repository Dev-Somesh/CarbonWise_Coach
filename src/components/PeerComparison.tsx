import React, { useState } from 'react';
import { CarbonFootprint } from '../types';
import { GLOBAL_BENCHMARKS } from '../utils/presets';
import { Globe, Info, ArrowDown, ArrowUp } from 'lucide-react';

interface PeerComparisonProps {
  footprint: CarbonFootprint;
}

interface BenchmarkRegion {
  id: string;
  name: string;
  value: number;
  description: string;
}

export default function PeerComparison({ footprint }: PeerComparisonProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('all');

  const benchmarkRegions: BenchmarkRegion[] = [
    {
      id: 'us',
      name: 'United States Average',
      value: GLOBAL_BENCHMARKS.usAverage,
      description: 'High reliance on fossil-fuel transportation, high consumer goods throughput, and spacious home heating/cooling profiles.'
    },
    {
      id: 'eu',
      name: 'European Union Average',
      value: GLOBAL_BENCHMARKS.euAverage,
      description: 'Increasing renewable integration in home power grids and density public transport systems, though still above stable limits.'
    },
    {
      id: 'world',
      name: 'World Individual Average',
      value: GLOBAL_BENCHMARKS.worldAverage,
      description: 'Global per-capita emission including developing areas. Reflects a mixture of urban sprawl and low-intensity rural living.'
    },
    {
      id: 'target',
      name: '1.5°C Climate Safe Target',
      value: GLOBAL_BENCHMARKS.target,
      description: 'The maximum individual annual threshold recommended by scientific panels to keep global rises below critical tipping bounds.'
    }
  ];

  // Compare user to selected or all benchmarks
  const calculateDifference = (benchmarkValue: number) => {
    const diffPct = ((footprint.total - benchmarkValue) / benchmarkValue) * 100;
    return {
      percent: Math.abs(Math.round(diffPct)),
      isBetter: footprint.total <= benchmarkValue
    };
  };

  const getFeedbackMessage = () => {
    const usDiff = calculateDifference(GLOBAL_BENCHMARKS.usAverage);
    const worldDiff = calculateDifference(GLOBAL_BENCHMARKS.worldAverage);
    calculateDifference(GLOBAL_BENCHMARKS.target);

    if (footprint.total <= GLOBAL_BENCHMARKS.target) {
      return {
        title: "Spectacular Climate Hero status!",
        description: `Your annual footprint of ${footprint.total.toLocaleString()} kg is below the 1.5°C target limit! You are actively helping stabilize the biosphere and set a shining gold standard.`,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
      };
    } else if (footprint.total <= GLOBAL_BENCHMARKS.worldAverage) {
      return {
        title: "Sustainability Standard Achieved",
        description: `Your footprint is ${worldDiff.percent}% lower than the average global citizen! You are within sight of the climate target (${GLOBAL_BENCHMARKS.target} kg) — a few more local dietary or green contract tweaks could get you there!`,
        color: 'text-teal-700 bg-teal-50 border-teal-200'
      };
    } else if (footprint.total <= GLOBAL_BENCHMARKS.euAverage) {
      return {
        title: "Better than European Average",
        description: `You are beating the EU average by ${calculateDifference(GLOBAL_BENCHMARKS.euAverage).percent}%, but remain above the world baseline. Consider swapping short trips with transit to reduce your transportation load further.`,
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
      };
    } else if (footprint.total <= GLOBAL_BENCHMARKS.usAverage) {
      return {
        title: "High Emission Profile - Opportunities Exist",
        description: `You are ${usDiff.percent}% lower than the typical North American baseline, but substantially higher than the global safety bounds. Shifting your heating settings or adding meatless days is highly recommended.`,
        color: 'text-amber-700 bg-amber-50 border-amber-200'
      };
    } else {
      return {
        title: "Critical Over-Emission Alert",
        description: `Your footprint exceeds even the US average by ${usDiff.percent}%. This heavy profile creates high climate pressure. Focus on reducing flight travels, cooling loads, and meat consumption to reduce emissions immediately.`,
        color: 'text-rose-700 bg-rose-50 border-rose-200'
      };
    }
  };

  const feedback = getFeedbackMessage();
  const maxBarValue = Math.max(footprint.total, GLOBAL_BENCHMARKS.usAverage) * 1.05;

  return (
    <div id="peer-comparison-module-card" className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2" id="comparison-card-title">
            <Globe className="w-5 h-5 text-indigo-500 shrink-0" />
            Global & Regional Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Contextualize your lifestyle output against real-world country standards and target caps.
          </p>
        </div>

        {/* Filter Tab controls */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-150">
          <button
            id="compare-btn-all"
            type="button"
            onClick={() => setSelectedRegionId('all')}
            className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              selectedRegionId === 'all'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Show All
          </button>
          <button
            id="compare-btn-climate"
            type="button"
            onClick={() => setSelectedRegionId('target')}
            className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              selectedRegionId === 'target'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            1.5° Limit
          </button>
        </div>
      </div>

      {/* Dynamic Comparative Gauge Graphic */}
      <div className="space-y-4" id="comparative-gauges-container">
        
        {/* User's profile bar is placed first and styled elegantly */}
        <div className="space-y-1.5" id="user-footprint-gauge-bar">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Your Current Footprint
            </span>
            <span className="font-extrabold font-mono text-emerald-600">
              {footprint.total.toLocaleString()} kg CO2e/yr
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-xl h-4 overflow-hidden relative border border-slate-200/50 shadow-inner">
            <div 
              className="bg-emerald-500 h-full rounded-xl transition-all duration-700 ease-out"
              style={{ width: `${(footprint.total / maxBarValue) * 100}%` }}
            />
          </div>
        </div>

        {/* Benchmark Bars */}
        <div className="space-y-4 pt-1 border-t border-slate-100">
          {benchmarkRegions
            .filter(r => selectedRegionId === 'all' || r.id === selectedRegionId)
            .map((region) => {
              const diff = calculateDifference(region.value);
              const pctWidth = (region.value / maxBarValue) * 100;
              return (
                <div key={region.id} id={`benchmark-bar-${region.id}`} className="space-y-1 group">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                      {region.name}
                    </span>
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="font-mono text-slate-600">
                        {region.value.toLocaleString()} kg
                      </span>
                      {diff.isBetter ? (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                          <ArrowDown className="w-3 h-3 shrink-0" />
                          -{diff.percent}% Saving
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                          <ArrowUp className="w-3 h-3 shrink-0" />
                          +{diff.percent}% Excess
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-100 rounded-lg h-2.5 overflow-hidden relative border border-slate-150/40">
                    <div 
                      className={`h-full rounded-lg transition-all duration-500 ease-out ${
                        region.id === 'target' 
                          ? 'bg-blue-400' 
                          : region.id === 'world' 
                            ? 'bg-slate-400' 
                            : region.id === 'eu' 
                              ? 'bg-indigo-400' 
                              : 'bg-rose-400'
                      }`}
                      style={{ width: `${pctWidth}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal hidden group-hover:block transition-all pt-0.5 font-medium">
                    {region.description}
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Dynamic Climate Expert Verdict Box */}
      <div className={`p-4 rounded-2xl border ${feedback.color} transition-colors duration-300 flex gap-3 text-xs leading-normal items-start`}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-extrabold tracking-tight underline decoration-dotted">
            {feedback.title}
          </h4>
          <p className="font-medium text-slate-600">
            {feedback.description}
          </p>
        </div>
      </div>

    </div>
  );
}
