import React, { useState } from 'react';
import { calculateTransportEmissions, calculateDietEmissions, calculateEnergyEmissions, calculateShoppingEmissions } from '../utils/carbonCalculator';
import { generateContextualRecommendations } from '../utils/recommendations';
import { Play, CheckCircle2, Terminal, Activity } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'transport' | 'diet' | 'energy' | 'shopping' | 'recommendations';
  run: () => { passed: boolean; details: string; expected: string; actual: string };
  passed?: boolean;
  actual?: string;
  expected?: string;
  details?: string;
}

export default function TestSuiteRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [tests, setTests] = useState<TestCase[]>([
    {
      id: 'test-transport-petrol',
      name: 'Verify Petrol Commuter Emissions',
      description: 'Validates transport calculations utilizing standard petrol car factors and flight weights.',
      category: 'transport',
      run: () => {
        const input = { method: 'petrol' as const, distance: 100, shortFlights: 2, longFlights: 1 };
        // (100 * 0.18 * 52) + (2 * 150) + (1 * 600) = 936 + 300 + 600 = 1836 kg
        const result = calculateTransportEmissions(input);
        return {
          passed: result === 1836,
          expected: '1,836 kg CO2e / yr',
          actual: `${result.toLocaleString()} kg CO2e / yr`,
          details: `Input: 100km/wk petrol car, 2 short-haul, 1 long-haul flight.`
        };
      }
    },
    {
      id: 'test-transport-active',
      name: 'Verify Walking & Biking Emissions',
      description: 'Asserts that completely active forms of transport result in exactly zero emissions.',
      category: 'transport',
      run: () => {
        const input = { method: 'active' as const, distance: 150, shortFlights: 0, longFlights: 0 };
        const result = calculateTransportEmissions(input);
        return {
          passed: result === 0,
          expected: '0 kg CO2e / yr',
          actual: `${result.toLocaleString()} kg CO2e / yr`,
          details: 'Input: 150km/wk active transport, 0 flights.'
        };
      }
    },
    {
      id: 'test-diet-vegan-optimized',
      name: 'Verify Clean Vegan Sourcing Emissions',
      description: 'Ensures vegetarian multipliers and local food sourcing combinations calculate correctly.',
      category: 'diet',
      run: () => {
        const input = { type: 'vegan' as const, foodWaste: 'high' as const, sourcing: 'mostly-local' as const };
        // 700 (vegan base) * 1.25 (high waste) * 0.9 (local) = 787.5 => rounded to 788
        const result = calculateDietEmissions(input);
        return {
          passed: result === 788,
          expected: '788 kg CO2e / yr',
          actual: `${result.toLocaleString()} kg CO2e / yr`,
          details: 'Input: Vegan diet, high leftover waste, local seasonal food co-ops.'
        };
      }
    },
    {
      id: 'test-energy-mansion-solar',
      name: 'Verify Solar Domestic HVAC Grid',
      description: 'Tests a large housing profile combined with solar renewables and electric HVAC units.',
      category: 'energy',
      run: () => {
        const input = { homeSize: 'large-house' as const, highEnergyAppliances: ['ac', 'electric-heating'], cleanEnergy: 'solar' as const };
        // base (4500) + appliances (300 AC + 400 Heating) = 5200 raw
        // multiplier: solar (0.2) = 1040 kg
        const result = calculateEnergyEmissions(input);
        return {
          passed: result === 1040,
          expected: '1,040 kg CO2e / yr',
          actual: `${result.toLocaleString()} kg CO2e / yr`,
          details: 'Input: Large House, AC and Central Electric Heating selected, Solar/renewable provider.'
        };
      }
    },
    {
      id: 'test-shopping-retail',
      name: 'Verify Shopping & Recycling Ratios',
      description: 'Tests clothing purchases combined with thorough recycling multipliers.',
      category: 'shopping',
      run: () => {
        const input = { clothing: 'moderate' as const, electronics: 'none' as const, recycling: 'thorough' as const };
        // moderate clothing (400) + none electronics (100) = 500 raw
        // multiplier: thorough recycling (0.85) = 425 kg
        const result = calculateShoppingEmissions(input);
        return {
          passed: result === 425,
          expected: '425 kg CO2e / yr',
          actual: `${result.toLocaleString()} kg CO2e / yr`,
          details: 'Input: 1-3 garments/month, keep technology 4+ years, active sorting recycling.'
        };
      }
    },
    {
      id: 'test-recommendations-priority',
      name: 'Verify Recommendations Priorities Sorting',
      description: 'Checks that highly impactful items are correctly elevated in placement sorting.',
      category: 'recommendations',
      run: () => {
        const mockProfile = {
          name: 'Climate Tester',
          hasCompletedOnboarding: true,
          transport: { method: 'petrol' as const, distance: 200, shortFlights: 2, longFlights: 1 },
          diet: { type: 'heavy-meat' as const, foodWaste: 'high' as const, sourcing: 'mostly-imported' as const },
          energy: { homeSize: 'large-house' as const, highEnergyAppliances: ['ac'], cleanEnergy: 'standard' as const },
          shopping: { clothing: 'frequent' as const, electronics: 'frequent' as const, recycling: 'none' as const }
        };
        const actions = generateContextualRecommendations(mockProfile);
        // Verifies the list is non-empty and sorted descending by impact
        const isSorted = actions.length > 1 && actions.every((val, i) => i === 0 || actions[i - 1].impactKg >= val.impactKg);
        return {
          passed: isSorted,
          expected: 'True (Sorted descending by carbon impact)',
          actual: isSorted ? 'True (Sorted descending by carbon impact)' : 'False (Out of order)',
          details: `Generated ${actions.length} recommendations. verified sorted order.`
        };
      }
    }
  ]);

  const runAllTests = () => {
    setIsRunning(true);
    setTests(prev =>
      prev.map(t => {
        const res = t.run();
        return {
          ...t,
          passed: res.passed,
          expected: res.expected,
          actual: res.actual,
          details: res.details,
        };
      })
    );
    setIsRunning(false);
  };

  const totalTests = tests.length;
  const passedTests = tests.filter(t => t.passed === true).length;
  const allRun = tests.every(t => t.passed !== undefined);
  const allPassed = allRun && passedTests === totalTests;
  const passRate = allRun ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fade-in space-y-8">
      
      {/* Test Suite Summary Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-emerald-400">CarbonWise Coach Test Sandbox</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Interactive Unit Test Suite</h1>
            <p className="text-xs text-slate-400 max-w-md">
              Validates transportation parameters, nutritional modifications, utility HVAC indices, fast fashion spending, and prioritized recommendation algorithms live.
            </p>
          </div>

          <button
            onClick={runAllTests}
            disabled={isRunning}
            aria-label="Execute all unit tests"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all focus:outline-none pointer-events-auto cursor-pointer"
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Executing Suite...' : 'Execute Test Suite'}
          </button>
        </div>

        {allRun && (
          <div className="border-t border-slate-800 pt-5 mt-6 flex justify-between items-center text-xs font-mono">
            <span className="flex items-center gap-1.5 font-bold text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Passed: {passedTests} / {totalTests} assertions
            </span>
            <span className={`font-extrabold px-2 py-0.5 rounded border ${
              allPassed
                ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/30'
                : 'text-amber-400 bg-amber-950/40 border-amber-900/30'
            }`}>
              {allPassed ? '100% SUCCESS' : `${passRate}% — ${totalTests - passedTests} FAILED`}
            </span>
          </div>
        )}
      </div>

      {/* Tests Grid */}
      <div className="space-y-4">
        {tests.map(test => (
          <div key={test.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
            
            {/* Meta */}
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono tracking-wider font-bold uppercase px-2 py-0.5 rounded ${
                  test.category === 'transport' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                  test.category === 'diet' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  test.category === 'energy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                  test.category === 'shopping' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-purple-50 text-purple-700 border border-purple-100'
                }`}>
                  {test.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold font-mono">{test.id}</span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">{test.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{test.description}</p>
              
              {test.details && (
                <p className="text-[11px] font-mono font-bold text-slate-400 pt-1 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  {test.details}
                </p>
              )}
            </div>

            {/* Indicator outputs */}
            <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-3 sm:gap-2">
              {test.passed === undefined ? (
                <span className="text-xs bg-slate-50 border border-slate-200 text-slate-400 font-bold font-mono px-3 py-1 rounded-lg">
                  UNRUN
                </span>
              ) : test.passed ? (
                <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold font-mono px-3 py-1 rounded-lg flex items-center gap-1 shadow-inner">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PASS
                </span>
              ) : (
                <span className="text-xs bg-rose-50 border border-rose-200 text-rose-700 font-extrabold font-mono px-3 py-1 rounded-lg">
                  FAILED
                </span>
              )}

              {test.passed !== undefined && (
                <div className="text-[10px] font-mono text-left sm:text-right space-y-0.5">
                  <p className="text-slate-400 font-medium">Expected: <strong className="text-slate-600 font-semibold">{test.expected}</strong></p>
                  <p className="text-slate-400 font-medium">Outcome: <strong className={`font-semibold ${test.passed ? 'text-emerald-600' : 'text-rose-500'}`}>{test.actual}</strong></p>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
