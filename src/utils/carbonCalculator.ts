import {
  TransportHabits,
  DietHabits,
  EnergyHabits,
  ShoppingHabits,
  CarbonFootprint
} from '../types';

export interface EmissionsClassification {
  label: string;
  color: string;
  description: string;
}

// Transport emission constants (kg CO2e per km or per unit)
export const TRANSPORT_CONSTANTS = {
  petrol: 0.18,      // Petrol car per km
  diesel: 0.17,      // Diesel car per km
  electric: 0.05,    // Electric car per km (grid charging)
  transit: 0.04,     // Metro/Bus per km
  active: 0.0,       // Walking/Bicyling
  shortFlight: 150,  // Short-haul flight per year (<3 hours)
  longFlight: 600,   // Long-haul flight per year (>3 hours) — IPCC/EPA aligned
};

// Diet emission constants (kg CO2e per year base value)
export const DIET_CONSTANTS = {
  'heavy-meat': 2200,
  'medium-meat': 1700,
  'low-meat': 1300,
  'vegetarian': 1000,
  'vegan': 700,
};

export const FOOD_WASTE_MULTIPLIERS = {
  minimal: 1.0,
  moderate: 1.1,
  high: 1.25,
};

export const SOURCING_MULTIPLIERS = {
  'mostly-local': 0.9,
  mixed: 1.0,
  'mostly-imported': 1.15,
};

// Energy emission constants (kg CO2e per year)
export const ENERGY_BASE_CONSTANTS = {
  apartment: 1500,
  'medium-house': 3000,
  'large-house': 4500,
};

export const APPLIANCE_CONSTANTS: Record<string, number> = {
  ac: 300,
  dryer: 200,
  'electric-heating': 400,
  'pool-pump': 600,
};

export const CLEAN_ENERGY_MULTIPLIERS = {
  solar: 0.2,
  mixed: 0.7,
  standard: 1.0,
};

// Shopping emission constants (kg CO2e per year)
export const SHOPPING_CLOTHING_VALUES = {
  none: 100,
  moderate: 400,
  frequent: 900,
};

export const SHOPPING_ELECTRONICS_VALUES = {
  none: 100,
  moderate: 300,
  frequent: 700,
};

export const RECYCLING_MULTIPLIERS = {
  thorough: 0.85,
  mixed: 1.0,
  none: 1.1,
};

/**
 * Calculates annual transportation emissions.
 */
export function calculateTransportEmissions(habits: TransportHabits): number {
  const weeklyCommuteEmissions = habits.distance * TRANSPORT_CONSTANTS[habits.method] * 52;
  const flightEmissions = (habits.shortFlights * TRANSPORT_CONSTANTS.shortFlight) +
                          (habits.longFlights * TRANSPORT_CONSTANTS.longFlight);
  return Math.round(weeklyCommuteEmissions + flightEmissions);
}

/**
 * Calculates annual diet-related emissions.
 */
export function calculateDietEmissions(habits: DietHabits): number {
  const base = DIET_CONSTANTS[habits.type];
  const wasteMultiplier = FOOD_WASTE_MULTIPLIERS[habits.foodWaste];
  const sourcingMultiplier = SOURCING_MULTIPLIERS[habits.sourcing];
  return Math.round(base * wasteMultiplier * sourcingMultiplier);
}

/**
 * Calculates annual home energy emissions.
 */
export function calculateEnergyEmissions(habits: EnergyHabits): number {
  const base = ENERGY_BASE_CONSTANTS[habits.homeSize];
  const appliancesEmissions = habits.highEnergyAppliances.reduce(
    (total, appliance) => total + (APPLIANCE_CONSTANTS[appliance] || 0),
    0
  );
  
  const totalRaw = base + appliancesEmissions;
  const multiplier = CLEAN_ENERGY_MULTIPLIERS[habits.cleanEnergy];
  
  return Math.round(totalRaw * multiplier);
}

/**
 * Calculates annual consumer shopping emissions.
 */
export function calculateShoppingEmissions(habits: ShoppingHabits): number {
  const clothingBase = SHOPPING_CLOTHING_VALUES[habits.clothing];
  const electronicsBase = SHOPPING_ELECTRONICS_VALUES[habits.electronics];
  
  const totalBase = clothingBase + electronicsBase;
  const recyclingMultiplier = RECYCLING_MULTIPLIERS[habits.recycling];
  
  return Math.round(totalBase * recyclingMultiplier);
}

/**
 * Combined calculation engine to evaluate the complete carbon footprint.
 */
export function calculateCarbonFootprint(
  transport: TransportHabits,
  diet: DietHabits,
  energy: EnergyHabits,
  shopping: ShoppingHabits
): CarbonFootprint {
  const transportEmissions = calculateTransportEmissions(transport);
  const dietEmissions = calculateDietEmissions(diet);
  const energyEmissions = calculateEnergyEmissions(energy);
  const shoppingEmissions = calculateShoppingEmissions(shopping);
  const total = transportEmissions + dietEmissions + energyEmissions + shoppingEmissions;

  return {
    transport: transportEmissions,
    diet: dietEmissions,
    energy: energyEmissions,
    shopping: shoppingEmissions,
    total,
  };
}

/**
 * Categorizes a carbon footprint relative to standard national targets / climate benchmarks.
 * standard average per capita in developed countries is approx 10,000 kg CO2e/year.
 * Target climate average to stay below 1.5C warming is 2,000 kg CO2e/year (or less).
 */
export function getEmissionsClassification(totalEmissions: number): EmissionsClassification {
  if (totalEmissions < 2500) {
    return {
      label: 'Eco Champion (Low Footprint)',
      color: 'bg-emerald-500 text-white border-emerald-600',
      description: 'Superb! Your footprint aligns closely with global carbon budgets required to combat warming.',
    };
  } else if (totalEmissions < 6000) {
    return {
      label: 'Conscious Consumer (Moderate Footprint)',
      color: 'bg-teal-500 text-white border-teal-600',
      description: 'Good job! You are doing better than the national average, but there is still plenty of room for high-impact improvements.',
    };
  } else if (totalEmissions < 10000) {
    return {
      label: 'Average Footprint',
      color: 'bg-amber-500 text-white border-amber-600',
      description: 'Your footprint matches standard modern standards. Focus on high-emissions keys like car dependency or heating source.',
    };
  } else {
    return {
      label: 'Climate Intensive (High Footprint)',
      color: 'bg-rose-500 text-white border-rose-600',
      description: 'Your footprint exceeds the average sustainability thresholds. Let’s work with our Smart Coach to find key reduction strategies.',
    };
  }
}
