import React, { useState } from 'react';
import { Award, Eye, Wind, Flame } from 'lucide-react';

export interface CarbonFootprintArtProps {
  footprintTotal: number;
  scoreViewMode?: 'gauge' | 'footprint';
  setScoreViewMode?: (mode: 'gauge' | 'footprint') => void;
  /** Shorter card for tabbed dashboard overview */
  compact?: boolean;
}

export default function CarbonFootprintArt({ 
  footprintTotal,
  scoreViewMode,
  setScoreViewMode,
  compact = false,
}: CarbonFootprintArtProps) {
  const [activeInteractiveElement, setActiveInteractiveElement] = useState<string | null>(null);
  const [showAnatomyLabels, setShowAnatomyLabels] = useState(false);

  // Calculate dynamic health metrics based on the footprint score.
  // Lower score = healthier (returning to clean green theme).
  // Target is 2000 kg, top scale is 15000 kg.
  const healthPercent = Math.max(
    15,
    Math.min(
      95,
      Math.round(((15000 - footprintTotal) / 13000) * 100)
    )
  );

  const getHealthLabel = () => {
    if (healthPercent >= 80) return 'Highly Regenerative';
    if (healthPercent >= 60) return 'Thriving Eco-Balance';
    if (healthPercent >= 40) return 'Transitional Growth';
    return 'High-Carbon Impact';
  };

  return (
    <div className={`bg-slate-950 rounded-3xl border border-slate-800 shadow-xl p-5 sm:p-6 text-white relative overflow-hidden flex flex-col justify-between select-none h-full ${compact ? 'min-h-[300px]' : 'min-h-[460px]'}`}>
      
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-950/30 via-transparent to-rose-950/15 pointer-events-none" />

      {/* Header section with interactive toggles */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5 shrink-0">
        <div>
          <h3 className="text-sm font-extrabold text-slate-100 font-sans tracking-wide flex items-center gap-1.5 uppercase">
            <span className="w-1.5 h-3.5 bg-emerald-500 rounded-sm inline-block animate-pulse" />
            Footprint Art-Model
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">
            Organic Carbon Transition Art
          </p>
        </div>
        
        {/* Unified, non-overlapping controls */}
        <div className="flex items-center gap-2">
          {scoreViewMode && setScoreViewMode && (
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 shadow-xl">
              <button
                onClick={() => setScoreViewMode('footprint')}
                aria-pressed={scoreViewMode === 'footprint'}
                aria-label="Switch to art view"
                className="px-2.5 py-1 text-[11px] font-black rounded-lg cursor-pointer bg-emerald-600 text-white shadow-md border border-emerald-500/20 whitespace-nowrap"
              >
                Art View
              </button>
              <button
                onClick={() => setScoreViewMode('gauge')}
                aria-pressed={scoreViewMode === 'gauge'}
                aria-label="Switch to meter view"
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer text-slate-400 hover:text-white transition-all whitespace-nowrap"
              >
                Meter View
              </button>
            </div>
          )}

          <button
            onClick={() => setShowAnatomyLabels(!showAnatomyLabels)}
            aria-pressed={showAnatomyLabels}
            aria-label={showAnatomyLabels ? 'Hide anatomy labels' : 'Show anatomy labels'}
            className="flex items-center gap-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 py-1.5 rounded-lg text-[10px] font-mono text-slate-300 pointer-events-auto border border-slate-800 cursor-pointer transition-colors whitespace-nowrap"
            title="Toggle digital labels overlay"
          >
            <Eye className="w-3 h-3 text-emerald-400" />
            {showAnatomyLabels ? 'Labels ON' : 'Labels OFF'}
          </button>
        </div>
      </div>

      {/* Main visualization container */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-2 min-h-[260px]">
        
        {/* Glow behind the toxic/clean boundaries */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-rose-500/10 rounded-full filter blur-xl pointer-events-none transition-opacity duration-1000" style={{ opacity: (100 - healthPercent) / 100 }} />
        <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-emerald-500/15 rounded-full filter blur-2xl pointer-events-none transition-opacity duration-1000" style={{ opacity: healthPercent / 100 }} />

        {/* Dynamic transition indicator message */}
        <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-none text-[9px] font-mono font-bold tracking-wider px-1">
          <span className="text-rose-400/90 flex items-center gap-1">
            <Flame className="w-2.5 h-2.5" />
            SOOT LOAD ({Math.round(100 - healthPercent)}%)
          </span>
          <span className="text-emerald-400/90 flex items-center gap-1">
            <Wind className="w-2.5 h-2.5 animate-spin-slow" />
            BIOSPHERE RECOVERY ({healthPercent}%)
          </span>
        </div>

        {/* The Master SVG Footprint illustration with slow organic floating motion */}
        <svg 
          viewBox="0 0 160 220" 
          className="w-full max-w-[190px] aspect-[160/220] filter drop-shadow-[0_0_16px_rgba(16,185,129,0.2)] relative z-10 cursor-pointer pointer-events-auto select-none animate-pulse-slow"
        >
          <defs>
            {/* The anatomical shape defining clipping area of right foot footprint */}
            <clipPath id="footprint-clip">
              {/* Toes (positioned anatomically) */}
              <circle cx="50" cy="30" r="12" />
              <circle cx="72" cy="27" r="9" />
              <circle cx="91" cy="31" r="8" />
              <circle cx="107" cy="40" r="7" />
              <circle cx="120" cy="51" r="6" />
              {/* Sole and heel contour */}
              <path d="M 54 50 C 78 50, 96 66, 94 92 C 91 110, 81 133, 76 153 C 71 170, 59 174, 52 169 C 45 164, 42 150, 45 133 C 47 111, 36 94, 35 77 C 34 60, 41 50, 54 50 Z" />
            </clipPath>

            {/* Glowing border outline mapping */}
            <linearGradient id="border-outline-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
              <stop offset={`${Math.max(20, 100 - healthPercent)}%`} stopColor="#475569" stopOpacity="0.3" />
              <stop offset={`${Math.min(90, 100 - healthPercent + 10)}%`} stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
            </linearGradient>

            {/* Base thriving green gradient mapping */}
            <linearGradient id="healthy-base-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="50%" stopColor="#022c22" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Overlay dark carbon toxic gradient mapping */}
            <linearGradient id="toxic-overlay-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a0c0e" />
              <stop offset="60%" stopColor="#251214" />
              <stop offset="100%" stopColor="#09111f" />
            </linearGradient>
          </defs>

          {/* Glowing contour border elements */}
          <g fill="none" stroke="url(#border-outline-grad)" strokeWidth="2" className="transition-all duration-1000 ease-in-out">
            {/* Toes outlines */}
            <circle cx="50" cy="30" r="12" />
            <circle cx="72" cy="27" r="9" />
            <circle cx="91" cy="31" r="8" />
            <circle cx="107" cy="40" r="7" />
            <circle cx="120" cy="51" r="6" />
            {/* Main Sole outline */}
            <path d="M 54 50 C 78 50, 96 66, 94 92 C 91 110, 81 133, 76 153 C 71 170, 59 174, 52 169 C 45 164, 42 150, 45 133 C 47 111, 36 94, 35 77 C 34 60, 41 50, 54 50 Z" />
          </g>

          {/* Contents clipped precisely inside the foot contour shape */}
          <g clipPath="url(#footprint-clip)">
            
            {/* --- LAYER 1: BASE HEALTHY GREEN RESTORATION (Always present underneath) --- */}
            <g>
              {/* Vibrant green background */}
              <rect x="0" y="0" width="100%" height="100%" fill="url(#healthy-base-grad)" />

              {/* Dotted threshold dividing line */}
              <line 
                x1="0" y1="180" x2="160" y2="40" 
                stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" opacity="0.4"
                className="animate-pulse"
              />

              {/* Botanical vector structures & foliage inside healthy green theme */}
              <g opacity="0.95" className="transition-all duration-1000">
                {/* Healthy leaf shape 1 */}
                <path d="M 98 128 C 112 128, 116 138, 108 143 C 98 143, 94 133, 98 128 Z" fill="#10b981" opacity="0.65" />
                <line x1="98" y1="128" x2="105" y2="138" stroke="#059669" strokeWidth="1" opacity="0.6" />
                
                {/* Healthy leaf shape 2 */}
                <path d="M 76 150 C 82 147, 88 153, 84 157 C 78 157, 75 152, 76 150 Z" fill="#34d399" opacity="0.75" />
                
                {/* Healthy leaf shape 3 */}
                <path d="M 114 88 C 122 84, 126 92, 120 96 C 114 96, 112 90, 114 88 Z" fill="#059669" opacity="0.7" />

                {/* Healthy leaf shape 4 (deep heel) */}
                <path d="M 52 140 C 60 135, 66 142, 60 148 C 52 148, 48 142, 52 140 Z" fill="#10b981" opacity="0.6" />

                {/* Sparkling floral feedback */}
                <path d="M 100 70 L 102 73 L 105 74 L 102 75 L 100 78 L 98 75 L 95 74 L 98 73 Z" fill="#6ee7b7" opacity="0.95" className="animate-pulse" />
                <path d="M 85 110 L 86 112 L 88 113 L 86 114 L 85 116 L 84 114 L 82 113 L 84 112 Z" fill="#34d399" opacity="0.9" />
                <path d="M 68 156 L 69 158 L 71 159 L 69 160 L 68 162 L 67 160 L 65 159 L 67 158 Z" fill="#a7f3d0" opacity="0.85" className="animate-pulse" />

                {/* Glowing O₂ & ECO nodes of the returning green half */}
                <g fill="#34d399" fontWeight="bold" fontFamily="monospace" className="transition-all duration-1000">
                  <text 
                    x="84" y="66" fontSize="6.5" className="hover:scale-110 cursor-help transition-transform"
                    onClick={() => setActiveInteractiveElement('o2-regen')}
                  >
                    O₂
                  </text>
                  <text x="98" y="94" fontSize="7.5" fill="#a7f3d0" fontWeight="black">O₂</text>
                  <text x="110" y="122" fontSize="6" opacity="0.8" fill="#6ee7b7">O₂</text>
                  <text x="82" y="138" fontSize="7" fill="#10b981">O₂</text>
                  <text x="56" y="134" fontSize="5.5" opacity="0.7" fill="#a7f3d0">O₂</text>
                  <text x="46" y="112" fontSize="5.5" opacity="0.75" fill="#a7f3d0">O₂</text>
                  <text x="74" y="102" fontSize="5.2" fontWeight="black" fill="#6ee7b7">ECO</text>
                  
                  {/* Toe clean green particles */}
                  <text x="87" y="31" fontSize="5.8" fontWeight="black" fill="#34d399">O₂</text>
                  <text x="103" y="41" fontSize="5" fontWeight="bold" fill="#10b981">O₂</text>
                  <text x="117" y="52" fontSize="5.5">🌿</text>
                  <text x="48" y="32" fontSize="5" opacity="0.6">🌿</text>
                </g>
              </g>
            </g>

            {/* --- LAYER 2: DARK SOOT OVERLAY (Fades smoothly based on footprint score) --- */}
            {/* The transition is handled via a CSS opacity transition which is exceptionally smooth! */}
            <g 
              style={{ 
                opacity: Math.max(0, Math.min(100, 100 - healthPercent)) / 100,
                transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="transition-opacity duration-[1200ms] ease-in-out"
            >
              {/* Pitch dark soot background */}
              <rect x="0" y="0" width="100%" height="100%" fill="url(#toxic-overlay-grad)" />

              {/* Toxic fine soot particulates */}
              <g opacity="0.6">
                <circle cx="34" cy="65" r="1.5" fill="#f43f5e" opacity="0.5" />
                <circle cx="48" cy="115" r="2.5" fill="#ef4444" opacity="0.4" />
                <circle cx="56" cy="74" r="1.2" fill="#f59e0b" opacity="0.45" />
                <circle cx="43" cy="138" r="2" fill="#f43f5e" opacity="0.4" />
                <circle cx="102" cy="76" r="1.5" fill="#ef4444" opacity="0.3" />
                <circle cx="118" cy="110" r="1.8" fill="#f43f5e" opacity="0.3" />
              </g>

              {/* Randomly scattered CO2 molecular soot markers - "written multiple times here and there randomly" */}
              <g fill="#f43f5e" fontWeight="black" fontFamily="monospace" className="cursor-help pointer-events-auto">
                {/* Toe 1 area */}
                <text x="42" y="32" fontSize="5.2" opacity="0.9" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>
                
                {/* Toe 2 area */}
                <text x="70" y="29" fontSize="4.6" opacity="0.8" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>
                
                {/* Toe 3 area */}
                <text x="88" y="32" fontSize="5" opacity="0.75" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Toe 4 area */}
                <text x="105" y="41" fontSize="4.5" opacity="0.7" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Toe 5 area */}
                <text x="116" y="53" fontSize="4.2" opacity="0.6" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Upper sole left column */}
                <text x="30" y="58" fontSize="7.5" fontWeight="bold" opacity="0.95" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>
                
                {/* Upper sole center */}
                <text x="65" y="58" fontSize="6.2" opacity="0.8" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Upper sole right */}
                <text x="85" y="65" fontSize="5" opacity="0.7" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Mid sole outer boundary left */}
                <text x="34" y="80" fontSize="6" opacity="0.85" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Upper center sole */}
                <text x="48" y="82" fontSize="5.5" opacity="0.7" fill="#fda4af" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Mid sole right */}
                <text x="75" y="82" fontSize="5.2" opacity="0.8" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Arch center */}
                <text x="44" y="106" fontSize="6" opacity="0.85" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Sole center center (the hot core) */}
                <text x="54" y="118" fontSize="8" opacity="1" fill="#ef4444" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Center arch right */}
                <text x="68" y="102" fontSize="5.8" opacity="0.75" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Heel left */}
                <text x="38" y="132" fontSize="6" opacity="0.8" fill="#fda4af" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Lower heel center */}
                <text x="58" y="142" fontSize="7" opacity="0.85" fill="#f87171" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Lower heel right */}
                <text x="72" y="130" fontSize="5.2" opacity="0.7" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>

                {/* Bottom heel curve */}
                <text x="50" y="162" fontSize="5.5" opacity="0.85" onClick={() => setActiveInteractiveElement('co2-trans')}>CO₂</text>
              </g>
            </g>
          </g>

          {/* Interactive labels and callouts overlaid across SVG coordinate boundaries */}
          {showAnatomyLabels && (
            <g className="animate-fade-in font-mono text-[5px] font-bold" opacity="0.9">
              {/* Toxic label */}
              <line x1="30" y1="90" x2="15" y2="105" stroke="#ef4444" strokeWidth="0.5" />
              <rect x="2" y="105" width="26" height="6" fill="#1c0709" stroke="#ef4444" strokeWidth="0.4" rx="1" />
              <text x="4" y="110" fill="#fca5a5">TOXIC LOAD</text>

              {/* Recovery label */}
              <line x1="110" y1="140" x2="128" y2="155" stroke="#10b981" strokeWidth="0.5" />
              <rect x="120" y="155" width="36" height="6" fill="#021e16" stroke="#10b981" strokeWidth="0.4" rx="1" />
              <text x="122" y="160" fill="#6ee7b7">GREEN TRANSITION</text>
            </g>
          )}
        </svg>

        {/* Info tooltips on interactive action trigger */}
        {activeInteractiveElement && (
          <div className="absolute inset-x-2 bottom-2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl z-20 animate-fade-in text-center shadow-lg">
            <p className="text-[10px] leading-relaxed">
              {activeInteractiveElement === 'co2-trans' ? (
                <span>
                  <strong className="text-rose-400">Carbon Dioxide (CO₂):</strong> Released during fossil combustion. Your dashboard habit checks actively shrink these high-carbon zones!
                </span>
              ) : (
                <span>
                  <strong className="text-emerald-400">Oxygen & Ecology (O₂):</strong> Represents negative carbon feedback. Expanding active transit matches carbon neutral offsets!
                </span>
              )}
            </p>
            <button
              onClick={() => setActiveInteractiveElement(null)}
              className="mt-1 text-[8px] font-mono font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        )}
      </div>

      {/* Footer statistics reporting */}
      <div className="border-t border-slate-900 pt-3 mt-3 relative z-10 shrink-0 text-center font-mono">
        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
          <span>Carbon Transition State</span>
          <span className="text-emerald-400 font-bold">{healthPercent}% Regained</span>
        </div>
        
        {/* Progress bar visual bar and subtitle */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-1000 ease-out" 
            style={{ width: `${healthPercent}%` }}
          />
        </div>

        <div className="mt-2 text-[10px] font-semibold text-emerald-500 flex items-center justify-center gap-1">
          <Award className="w-3 h-3 text-emerald-400" />
          {getHealthLabel()}
        </div>
      </div>

    </div>
  );
}
