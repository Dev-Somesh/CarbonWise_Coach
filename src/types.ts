/**
 * CarbonWise Coach TypeScript Definitions
 */

export type CommuteMethod = 'petrol' | 'diesel' | 'electric' | 'transit' | 'active';
export type DietType = 'heavy-meat' | 'medium-meat' | 'low-meat' | 'vegetarian' | 'vegan';
export type FoodWasteLevel = 'minimal' | 'moderate' | 'high';
export type SourcingPreference = 'mostly-local' | 'mixed' | 'mostly-imported';
export type HomeSizeType = 'apartment' | 'medium-house' | 'large-house';
export type CleanEnergyType = 'solar' | 'mixed' | 'standard';
export type PurchaseFrequency = 'none' | 'moderate' | 'frequent';
export type RecyclingLevel = 'thorough' | 'mixed' | 'none';

export interface TransportHabits {
  method: CommuteMethod;
  distance: number; // km per week
  shortFlights: number; // flights per year
  longFlights: number; // flights per year
}

export interface DietHabits {
  type: DietType;
  foodWaste: FoodWasteLevel;
  sourcing: SourcingPreference;
}

export interface EnergyHabits {
  homeSize: HomeSizeType;
  highEnergyAppliances: string[]; // 'ac', 'dryer', 'electric-heating', 'pool-pump'
  cleanEnergy: CleanEnergyType;
}

export interface ShoppingHabits {
  clothing: PurchaseFrequency;
  electronics: PurchaseFrequency;
  recycling: RecyclingLevel;
}

export interface UserProfile {
  name: string;
  hasCompletedOnboarding: boolean;
  transport: TransportHabits;
  diet: DietHabits;
  energy: EnergyHabits;
  shopping: ShoppingHabits;
}

export interface CarbonFootprint {
  transport: number; // kg CO2e per year
  diet: number;      // kg CO2e per year
  energy: number;    // kg CO2e per year
  shopping: number;  // kg CO2e per year
  total: number;     // kg CO2e per year
}

export interface SustainabilityAction {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'diet' | 'energy' | 'shopping';
  impactKg: number; // Annual kg CO2e saved
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'diet' | 'energy' | 'shopping';
  impactKg: number; // Weekly equivalents saved
  completed: boolean;
  daysCompleted: string[]; // array of ISO date strings (e.g., '2026-06-09')
}

export interface EmissionHistoryItem {
  date: string; // ISO Date or label (e.g. "Week 1")
  emissions: CarbonFootprint;
}

export interface CoachInsight {
  headline: string;
  analysis: string;
  recommendations: string[];
  isAiGenerated: boolean;
  isFallbackActive?: boolean;
  fallbackReason?: string;
}

export type DashboardTab = 'overview' | 'action' | 'tools' | 'progress';

export type ScoreViewMode = 'gauge' | 'footprint';

export interface QuickWinTip {
  title: string;
  description: string;
  actionText: string;
}

export interface EmissionCategory {
  key: string;
  label: string;
  value: number;
}
