import { UserProfile } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  hasCompletedOnboarding: false,
  transport: {
    method: 'transit',
    distance: 40, // 40 km per week
    shortFlights: 1,
    longFlights: 0,
  },
  diet: {
    type: 'medium-meat',
    foodWaste: 'moderate',
    sourcing: 'mixed',
  },
  energy: {
    homeSize: 'apartment',
    highEnergyAppliances: ['ac'],
    cleanEnergy: 'standard',
  },
  shopping: {
    clothing: 'moderate',
    electronics: 'moderate',
    recycling: 'mixed',
  },
};

export interface GlobalBenchmarks {
  target: number;
  worldAverage: number;
  usAverage: number;
  euAverage: number;
}

export const GLOBAL_BENCHMARKS: GlobalBenchmarks = {
  target: 2000,       // Climate average to keep below 1.5C (kg/year)
  worldAverage: 4700, // True world average individual footprint (kg/year)
  usAverage: 15500,   // US average (kg/year)
  euAverage: 8200,    // EU average (kg/year)
};
