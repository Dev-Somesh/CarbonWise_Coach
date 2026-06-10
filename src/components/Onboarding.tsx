import React, { useState } from 'react';
import { UserProfile, CommuteMethod, DietType, FoodWasteLevel, SourcingPreference, HomeSizeType, CleanEnergyType, PurchaseFrequency, RecyclingLevel } from '../types';
import { ChevronLeft, ChevronRight, User, Plane, Flame, ShoppingBag, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile: UserProfile;
}

export default function Onboarding({ onComplete, initialProfile }: OnboardingProps) {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Form states matching types
  const [transport, setTransport] = useState({
    method: initialProfile.transport.method,
    distance: initialProfile.transport.distance,
    shortFlights: initialProfile.transport.shortFlights,
    longFlights: initialProfile.transport.longFlights,
  });

  const [diet, setDiet] = useState({
    type: initialProfile.diet.type,
    foodWaste: initialProfile.diet.foodWaste,
    sourcing: initialProfile.diet.sourcing,
  });

  const [energy, setEnergy] = useState({
    homeSize: initialProfile.energy.homeSize,
    highEnergyAppliances: initialProfile.energy.highEnergyAppliances,
    cleanEnergy: initialProfile.energy.cleanEnergy,
  });

  const [shopping, setShopping] = useState({
    clothing: initialProfile.shopping.clothing,
    electronics: initialProfile.shopping.electronics,
    recycling: initialProfile.shopping.recycling,
  });

  const handleApplianceToggle = (applianceName: string) => {
    setEnergy(prev => {
      const active = prev.highEnergyAppliances.includes(applianceName)
        ? prev.highEnergyAppliances.filter(x => x !== applianceName)
        : [...prev.highEnergyAppliances, applianceName];
      return { ...prev, highEnergyAppliances: active };
    });
  };

  const validateAndNext = () => {
    setValidationError('');
    
    if (step === 1) {
      if (!name.trim()) {
        setValidationError('Please provide your name or high-level nickname to personalize your experience.');
        return;
      }
      if (transport.distance < 0 || isNaN(transport.distance)) {
        setValidationError('Weekly distance must be a positive number.');
        return;
      }
      if (transport.shortFlights < 0 || transport.longFlights < 0) {
        setValidationError('Flight count cannot be negative.');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Complete validation on final step
    if (step === 4) {
      const finishedProfile: UserProfile = {
        name: name.trim(),
        hasCompletedOnboarding: true,
        transport,
        diet,
        energy,
        shopping,
      };
      onComplete(finishedProfile);
    }
  };

  return (
    <div id="onboarding-wrapper" className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10">
        
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-600 uppercase">Onboarding Assessment</span>
            <h2 className="text-lg font-bold text-slate-800">
              {step === 1 && '1. Travel Habits'}
              {step === 2 && '2. Dietary Footprints'}
              {step === 3 && '3. Domestic Utilities'}
              {step === 4 && '4. Consumer Shopping'}
            </h2>
          </div>
          <span className="text-sm font-semibold font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
            Step {step} of 4
          </span>
        </div>

        {/* Visual Completion Progress Bar and Indicator */}
        <div className="mb-8" id="onboarding-completion-bar-container">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex relative border border-slate-200/40 shadow-inner">
            <div 
              id="onboarding-completion-bar-fill"
              className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2.5 px-0.5 text-[10px] sm:text-xs font-bold text-slate-400">
            <span className={step >= 1 ? "text-emerald-700 font-extrabold" : ""}>1. Travel</span>
            <span className={step >= 2 ? "text-emerald-700 font-extrabold" : ""}>2. Food & Diet</span>
            <span className={step >= 3 ? "text-emerald-700 font-extrabold" : ""}>3. Energy Load</span>
            <span className={step >= 4 ? "text-emerald-700 font-extrabold" : ""}>4. Retail Habits</span>
          </div>
        </div>

        {validationError && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl flex items-center gap-3 text-sm animate-shake" role="alert">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          <AnimatePresence mode="wait">
            {/* STEP 1: TRANSPORT */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="user-name" className="block text-sm font-bold text-slate-700 mb-2">What should the Coach call you? *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      id="user-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value) setValidationError('');
                      }}
                      placeholder="Enter name or nickname"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="commute-method" className="block text-sm font-bold text-slate-700 mb-2">Primary Commute Vehicle</label>
                  <p className="text-xs text-slate-400 mb-3">Which mode of transit do you rely on most frequently for work or study?</p>
                  <select
                    id="commute-method"
                    value={transport.method}
                    onChange={(e) => setTransport(prev => ({ ...prev, method: e.target.value as CommuteMethod }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="petrol">Petrol Powered Car (Standard)</option>
                    <option value="diesel">Diesel Powered Car (High Torque)</option>
                    <option value="electric">Electric Vehicle (Battery / EV)</option>
                    <option value="transit">Public Transit (Metro / Rail / Commuter Bus)</option>
                    <option value="active">Active Commuting (Walking / Bicycling / Scooting)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="commute-distance" className="text-sm font-bold text-slate-700">Commuting Distance per Week</label>
                    <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {transport.distance} km
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Total kilometers you travel combined during research, groceries, and work commutations under standard weeks.</p>
                  <input
                    id="commute-distance"
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={transport.distance}
                    onChange={(e) => setTransport(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1 mt-1">
                    <span>0 km (WFH)</span>
                    <span>100 km</span>
                    <span>250 km</span>
                    <span>500 km+</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label htmlFor="short-flights" className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Plane className="w-4 h-4 text-sky-500" />
                      Short Flights / yr
                    </label>
                    <p className="text-[11px] text-slate-400 mb-2">Domestic flights less than 3 hours.</p>
                    <input
                      id="short-flights"
                      type="number"
                      min="0"
                      max="50"
                      value={transport.shortFlights}
                      onChange={(e) => setTransport(prev => ({ ...prev, shortFlights: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="long-flights" className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Plane className="w-5 h-5 text-indigo-500" />
                      Long Flights / yr
                    </label>
                    <p className="text-[11px] text-slate-400 mb-2">Intercontinental travel longer than 3 hours.</p>
                    <input
                      id="long-flights"
                      type="number"
                      min="0"
                      max="50"
                      value={transport.longFlights}
                      onChange={(e) => setTransport(prev => ({ ...prev, longFlights: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DIET */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="diet-type" className="block text-sm font-bold text-slate-700 mb-2">Dietary Pattern Preference</label>
                  <p className="text-xs text-slate-400 mb-3">Food production accounts for up to a third of global emissions, primarily driven by livestock agriculture.</p>
                  <select
                    id="diet-type"
                    value={diet.type}
                    onChange={(e) => setDiet(prev => ({ ...prev, type: e.target.value as DietType }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="heavy-meat">Frequent Meat Consumer (Beef, Pork daily)</option>
                    <option value="medium-meat">Balanced Diet (Chicken, Pork, occasional Beef)</option>
                    <option value="low-meat">Low Meat / Flexitarian (Emphasis on plants)</option>
                    <option value="vegetarian">Vegetarian (No animals, includes eggs/dairy)</option>
                    <option value="vegan">Vegan (Entirely plant-sourced nutrition)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Leftovers & Food Scrap Wastage</label>
                  <p className="text-xs text-slate-400 mb-3">Rotting food in municipal waste dumps produces methane, a powerful climate warmer.</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(['minimal', 'moderate', 'high'] as FoodWasteLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDiet(prev => ({ ...prev, foodWaste: level }))}
                        className={`py-3 px-4 rounded-xl border text-center font-semibold text-xs sm:text-sm transition-all focus:outline-none cursor-pointer ${
                          diet.foodWaste === level
                            ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/60'
                        }`}
                      >
                        {level === 'minimal' && 'Rarely/None'}
                        {level === 'moderate' && 'Some waste'}
                        {level === 'high' && 'Regularly discard'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="sourcing-preference" className="block text-sm font-bold text-slate-700 mb-2">Produce Sourcing Priorities</label>
                  <p className="text-xs text-slate-400 mb-3">Do you actively seek coordinates near you, or buy standard imported items from international chains?</p>
                  <select
                    id="sourcing-preference"
                    value={diet.sourcing}
                    onChange={(e) => setDiet(prev => ({ ...prev, sourcing: e.target.value as SourcingPreference }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="mostly-local">Mostly seasonal local markets / Organic cooperative</option>
                    <option value="mixed">Mixed standard regional choices (Standard Supermarket)</option>
                    <option value="mostly-imported">Imported processed goods / Air-freighted global items</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* STEP 3: UTILITIES */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Primary Residence Size</label>
                  <p className="text-xs text-slate-400 mb-3">Residential heating and cooling requirements directly scale with total floor plans and volumes.</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(['apartment', 'medium-house', 'large-house'] as HomeSizeType[]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setEnergy(prev => ({ ...prev, homeSize: size }))}
                        className={`py-3 px-2 rounded-xl border text-center font-semibold text-xs sm:text-sm transition-all focus:outline-none cursor-pointer ${
                          energy.homeSize === size
                            ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/60'
                        }`}
                      >
                        {size === 'apartment' && 'Apartment/Flat'}
                        {size === 'medium-house' && 'Medium House'}
                        {size === 'large-house' && 'Large Mansion'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5 justify-between">
                    <span className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-emerald-500" />
                      High Load Domestic Appliances
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono px-2 py-0.5 rounded">Multi-Select</span>
                  </label>
                  <p className="text-xs text-slate-400 mb-3">Select items running regularly inside your domicile environment:</p>
                  <div className="grid grid-cols-2 gap-3" role="group" aria-label="High load home appliances">
                    {[
                      { key: 'ac', label: 'Air Conditioner / Heat Pump' },
                      { key: 'dryer', label: 'Clothes Tumble Dryer' },
                      { key: 'electric-heating', label: 'Central Electric Heating' },
                      { key: 'pool-pump', label: 'Active Pool Filter Pump' },
                    ].map((item) => {
                      const isSelected = energy.highEnergyAppliances.includes(item.key);
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => handleApplianceToggle(item.key)}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/60'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <span>{item.label}</span>
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ml-1.5 animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="clean-energy" className="block text-sm font-bold text-slate-700 mb-2">Electrical Grid Contract Type</label>
                  <p className="text-xs text-slate-400 mb-3">Does your local energy contract purchase renewable source certificates, or use coal/gas standard grid supply?</p>
                  <select
                    id="clean-energy"
                    value={energy.cleanEnergy}
                    onChange={(e) => setEnergy(prev => ({ ...prev, cleanEnergy: e.target.value as CleanEnergyType }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="standard">Standard Grid Mix (Fossil / Coal dominated)</option>
                    <option value="mixed">Mixed/Hybrid grid contracts (Some wind support)</option>
                    <option value="solar">100% Wind or Solar provider contract (Green Tariff)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SHOPPING */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Apparel Purchases Category</label>
                  <p className="text-xs text-slate-400 mb-3">Fast fashion is incredibly resource intensive, producing high textile trash weight.</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(['none', 'moderate', 'frequent'] as PurchaseFrequency[]).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setShopping(prev => ({ ...prev, clothing: freq }))}
                        className={`py-3 px-2 rounded-xl border text-center font-semibold text-xs sm:text-sm transition-all focus:outline-none cursor-pointer ${
                          shopping.clothing === freq
                            ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/60'
                        }`}
                      >
                        {freq === 'none' && 'Minimal/Thrift'}
                        {freq === 'moderate' && '1-3 Items/month'}
                        {freq === 'frequent' && '4+ Items/month'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    Electronics Upgrade Lifespan
                  </label>
                  <p className="text-xs text-slate-400 mb-3">How often do you replace smartphones, digital tabs, laptops, or custom hardware monitors?</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(['none', 'moderate', 'frequent'] as PurchaseFrequency[]).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setShopping(prev => ({ ...prev, electronics: freq }))}
                        className={`py-3 px-2 rounded-xl border text-center font-semibold text-xs sm:text-sm transition-all focus:outline-none cursor-pointer ${
                          shopping.electronics === freq
                            ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/60'
                        }`}
                      >
                        {freq === 'none' && 'Keep 4+ Years'}
                        {freq === 'moderate' && 'Upgrades at 2-3 Yr'}
                        {freq === 'frequent' && 'Annual/Frequent'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="recycling-level" className="block text-sm font-bold text-slate-700 mb-2">Recycling Diligence</label>
                  <p className="text-xs text-slate-400 mb-3">How consistently do you rinse, sort, and process compostable, cardboards, and clean metals?</p>
                  <select
                    id="recycling-level"
                    value={shopping.recycling}
                    onChange={(e) => setShopping(prev => ({ ...prev, recycling: e.target.value as RecyclingLevel }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="thorough">Highly Thorough (Clear sorting, composting active)</option>
                    <option value="mixed">Mixed (Sort cardboards/plastics, throw leftovers in grid bins)</option>
                    <option value="none">Standard Mixed Pile (No active resource sorting)</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-8">
            <button
              id="onboarding-back-button"
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer ${
                step === 1 ? 'opacity-0 pointer-events-none' : ''
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step < 4 ? (
              <button
                id="onboarding-continue-button"
                type="button"
                onClick={validateAndNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow focus:ring-2 focus:ring-emerald-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all outline-none"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="onboarding-submit-button"
                type="submit"
                className="inline-flex items-center gap-1.5 px-7 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-lg shadow-emerald-600/10 focus:ring-2 focus:ring-emerald-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all outline-none"
              >
                Complete Assessment
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
