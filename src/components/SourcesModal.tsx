import React from 'react';
import { X, ExternalLink, Leaf, HelpCircle, FileText, Globe } from 'lucide-react';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SourcesModal({ isOpen, onClose }: SourcesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base sm:text-lg font-bold text-slate-800">Calculations Methodology & Scholarly Sources</h2>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Verified Framework</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors focus:ring-2 focus:ring-slate-300 outline-none cursor-pointer"
            aria-label="Close database sources window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-600 leading-relaxed font-sans">
          
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-xs font-medium">
            <span className="font-extrabold uppercase tracking-wider text-emerald-950 block mb-1">CarbonTrace Framework Pledge</span>
            This interactive climate model uses verified metric coefficients to formulate personalized annual footprint values. Calculated values represent estimated approximations designed for domestic habit awareness rather than granular laboratory compliance.
          </div>

          {/* Section: Methodology */}
          <section className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded" />
              Calculator Coefficient Formulas
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              We translate daily inputs into annual equivalents of carbon dioxide equivalents (<strong className="font-semibold text-slate-700">kg CO2e / year</strong>) across these primary categories:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                <span className="font-semibold text-slate-800 block mb-1">Transportation Commuting</span>
                Formula: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-100">Distance * Factor * 52 Weeks + Flights</code>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-500 text-[11px]">
                  <li>Petrol SUV: 0.18 kg CO2e per km</li>
                  <li>Transit Rail: 0.04 kg CO2e per km</li>
                  <li>Short Flight Leg: 150 kg per sector</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                <span className="font-semibold text-slate-800 block mb-1">Food and Agriculture</span>
                Formula: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-100">Base Diet * FoodWaste * Sourcing</code>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-500 text-[11px]">
                  <li>Heavy Meat Base: 2,200 kg CO2e per yr</li>
                  <li>Vegan/Plant-based Base: 700 kg CO2e per yr</li>
                  <li>High Waste Multiplier: 1.25x penalty</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                <span className="font-semibold text-slate-800 block mb-1">Utilities Grid Electricity</span>
                Formula: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-100">(Base Home Size + Appliances) * GreenTariff</code>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-500 text-[11px]">
                  <li>Apartment Base: 1,500 kg CO2e per yr</li>
                  <li>Green Tariff solar contract: 0.20x multiplier</li>
                  <li>High Duty HVAC appliances: 300-600 kg per unit</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                <span className="font-semibold text-slate-800 block mb-1">Shopping & Goods Lifecycle</span>
                Formula: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-100">(Apparel + Tech Bases) * RecyclingFactor</code>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-500 text-[11px]">
                  <li>Fast Apparel (4+ items/mo): 900 kg CO2e per yr</li>
                  <li>Thorough Sorting Multiplier: 0.85x credit benefit</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: EPA, IPCC, and IEA Citations */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded" />
              Primary Citation Database Indexes
            </h3>
            
            <div className="space-y-3">
              {/* Citation 1 */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 hover:bg-slate-50/80 transition-colors rounded-2xl border border-slate-200/60">
                <div className="bg-sky-100 text-sky-800 p-2 rounded-xl shrink-0">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">US EPA Greenhouse Gas Equivalents (2023)</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-normal mt-1">
                    Used to define base mobile combustion guidelines (passenger cars per kilometer) and food-related landfill solid organic decay outputs.
                  </p>
                  <a
                    href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-bold text-[10px] mt-2 group"
                  >
                    Explore EPA Data Registry
                    <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>

              {/* Citation 2 */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 hover:bg-slate-50/80 transition-colors rounded-2xl border border-slate-200/60">
                <div className="bg-emerald-100 text-emerald-800 p-2 rounded-xl shrink-0">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">IPCC WGIII AR6 Framework (Intergovernmental Panel Chapter)</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-normal mt-1">
                    Informs agricultural supply impacts based on dietary shifts and structural global waste management metrics.
                  </p>
                  <a
                    href="https://www.ipcc.ch/report/ar6/wg3/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold text-[10px] mt-2 group"
                  >
                    Read IPCC Climate Reports
                    <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>

              {/* Citation 3 */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 hover:bg-slate-50/80 transition-colors rounded-2xl border border-slate-200/60">
                <div className="bg-indigo-100 text-indigo-800 p-2 rounded-xl shrink-0">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">International Energy Agency Grid Factors (IEA 2023)</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-normal mt-1">
                    Secures household electricity carbon factor references, measuring clean/fossil grid offsets.
                  </p>
                  <a
                    href="https://www.iea.org/reports/global-energy-review-co2-emissions-in-2023"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold text-[10px] mt-2 group"
                  >
                    View IEA Emissions Index
                    <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-850 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors focus:ring-2 focus:ring-slate-400 cursor-pointer outline-none"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
