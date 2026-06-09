import { describe, it, expect } from 'vitest';
import {
  calculateTransportEmissions,
  calculateDietEmissions,
  calculateEnergyEmissions,
  calculateShoppingEmissions,
  calculateCarbonFootprint,
} from './carbonCalculator';

describe('Carbon Calculator Calculations', () => {

  it('correctly calculates annual transport emissions for solo driving and flights', () => {
    const habits = {
      method: 'petrol' as const,
      distance: 100, // 100 km/week
      shortFlights: 2,
      longFlights: 1,
    };
    
    // Formula: Weekly commute emissions (100 * 0.18 * 52) = 936
    // Flight emissions: (2 * 150) + (1 * 500) = 800
    // Total = 1736 kg CO2e
    const total = calculateTransportEmissions(habits);
    expect(total).toBe(1736);
  });

  it('correctly calculates annual transport emissions for electric vehicle and public transit', () => {
    const habits = {
      method: 'electric' as const,
      distance: 200, // 200 km/week
      shortFlights: 0,
      longFlights: 0,
    };
    
    // Formula: Weekly commute (200 * 0.05 * 52) = 520
    const total = calculateTransportEmissions(habits);
    expect(total).toBe(520);
  });

  it('correctly calculates annual diet emissions for vegan and high food waste', () => {
    const habits = {
      type: 'vegan' as const,
      foodWaste: 'high' as const, // multiplier 1.25
      sourcing: 'mostly-local' as const, // multiplier 0.9
    };
    
    // Formula: 700 (base) * 1.25 * 0.9 = 787.5 (rounded to 788)
    const emissions = calculateDietEmissions(habits);
    expect(emissions).toBe(788);
  });

  it('correctly calculates energy emissions for medium house with high-load appliances', () => {
    const habits = {
      homeSize: 'medium-house' as const, // base 3000
      highEnergyAppliances: ['ac', 'dryer'], // ac: 300, dryer: 200
      cleanEnergy: 'solar' as const, // multiplier 0.2
    };

    // raw total: 3000 + 300 + 200 = 3500
    // multiplier: 0.2
    // total: 700 kg
    const energy = calculateEnergyEmissions(habits);
    expect(energy).toBe(700);
  });

  it('correctly calculates combined carbon footprint', () => {
    const transport = { method: 'transit' as const, distance: 50, shortFlights: 0, longFlights: 0 };
    const diet = { type: 'vegetarian' as const, foodWaste: 'minimal' as const, sourcing: 'mixed' as const };
    const energy = { homeSize: 'apartment' as const, highEnergyAppliances: [], cleanEnergy: 'standard' as const };
    const shopping = { clothing: 'none' as const, electronics: 'none' as const, recycling: 'thorough' as const };

    // transport: 50 * 0.04 * 52 = 104
    // diet: 1000 * 1.0 * 1.0 = 1000
    // energy: 1500 * 1.0 = 1500
    // shopping: (100 + 100) * 0.85 = 170
    // total: 104 + 1000 + 1500 + 170 = 2774
    const total = calculateCarbonFootprint(transport, diet, energy, shopping);
    expect(total.total).toBe(2774);
  });
});
