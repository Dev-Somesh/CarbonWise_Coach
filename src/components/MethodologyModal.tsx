import React from 'react';
import { X, Globe, FileText, BarChart3, HelpCircle, Check, Info } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="methodology-modal-title"
    >
      <div 
        id="methodology-modal"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]"
      >
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 id="methodology-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                Scientific Methodology & Data
              </h2>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Verified EPA & IPCC AR6 Standards
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors focus:ring-2 focus:ring-slate-300 outline-none cursor-pointer"
            aria-label="Close methodology modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-600 leading-relaxed font-sans">
          
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50 text-amber-800 text-xs flex gap-3">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <p>
              This app uses standardized carbon equivalent coefficients (<strong className="font-semibold text-slate-800">kg CO2e / year</strong>) sourced from authoritative agencies to calculate your footprint baseline, adjusting metrics dynamically based on completed daily and weekly habit corrections.
            </p>
          </div>

          {/* Section: EPA Details */}
          <section className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded" />
              US EPA Greenhouse Gas Inventory Guidelines
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              The <strong className="font-semibold text-slate-700">US Environmental Protection Agency (EPA)</strong> provides primary reference factors for combustion of vehicle fuels, airline emissions, and home natural gas utility configurations:
            </p>
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3">
              <div className="flex items-start gap-2 text-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Passenger Vehicle Commutes:</span>
                  Petrol vehicles generate approx. <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-rose-600">0.18 kg CO2e / km</code>. Diesel yields <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-rose-600">0.17 kg CO2e / km</code>, while Hybrid and Electric grid-tied commutes range from <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-emerald-600">0.02 - 0.08 kg CO2e / km</code>.
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Aviation Sectors:</span>
                  Short-haul flights under 500 km suffer landing/takeoff thermal tax, averaging <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-rose-600">150 kg CO2e / trip</code>. Long-haul international trips generate around <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-rose-600">600 kg CO2e / trip</code>.
                </div>
              </div>
            </div>
          </section>

          {/* Section: IPCC Details */}
          <section className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded" />
              IPCC WGIII AR6 Global Climate Modeling
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              The <strong className="font-semibold text-slate-700">Intergovernmental Panel on Climate Change (IPCC) Sixth Assessment Report (AR6) Working Group III</strong> dictates diet lifecycle indexes, food solid organic decay outputs, and consumer commodities manufacturing chains:
            </p>
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3">
              <div className="flex items-start gap-2 text-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Nutrition & Dietary Base:</span>
                  Beef-heavy diets demand <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-rose-600">2,200 kg CO2e / year</code> due to enteric methane. Mixed diets average <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-amber-600">1,400 kg CO2e / year</code>, whereas fully plant-based vegan patterns contribute only <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-emerald-600">700 kg CO2e / year</code>.
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Solid Organic Waste Penalty:</span>
                  Underused food decomposing in high-waste households releases landfill methane, multiplying localized food sector impact by <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">1.25x</code>.
                </div>
              </div>
            </div>
          </section>

          {/* Section: Formula Summary Table */}
          <section className="space-y-3">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm font-mono uppercase tracking-wider">
              Formula Execution Logic
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-3 font-bold text-slate-700">
                <div>Metric Category</div>
                <div className="col-span-2">Core Algorithmic Formula</div>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-3 p-3">
                  <div className="font-semibold text-slate-800">Transport</div>
                  <div className="col-span-2 font-mono text-[11px] text-slate-600 leading-normal">
                    (Weekly Dist * FuelCoeff * 52) + (ShortFlights * 150) + (LongFlights * 600)
                  </div>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <div className="font-semibold text-slate-800">Nutrition</div>
                  <div className="col-span-2 font-mono text-[11px] text-slate-600 leading-normal">
                    DietBaseValue * WastePenaltyMultiplier * SourcingFactor
                  </div>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <div className="font-semibold text-slate-800">Utilities</div>
                  <div className="col-span-2 font-mono text-[11px] text-slate-600 leading-normal">
                    (HomeSizeBase + ApplianceLoad) * GridRenewableDiscountMultiplier
                  </div>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <div className="font-semibold text-slate-800">Shopping</div>
                  <div className="col-span-2 font-mono text-[11px] text-slate-600 leading-normal">
                    (ApparelBase + TechCycles) * RecyclingOffsetDiscount
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer outline-none shadow-sm"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
