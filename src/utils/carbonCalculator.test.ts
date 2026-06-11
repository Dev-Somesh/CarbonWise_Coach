import { describe, it, expect } from 'vitest';
import {
  calculateTransportEmissions,
  calculateDietEmissions,
  calculateEnergyEmissions,
  calculateShoppingEmissions,
  calculateCarbonFootprint,
  getEmissionsClassification,
} from './carbonCalculator';

describe('Carbon Calculator Calculations', () => {
  it('correctly calculates annual transport emissions for solo driving and flights', () => {
    const habits = {
      method: 'petrol' as const,
      distance: 100,
      shortFlights: 2,
      longFlights: 1,
    };
    expect(calculateTransportEmissions(habits)).toBe(1836);
  });

  it('correctly calculates annual transport emissions for electric vehicle and public transit', () => {
    const habits = {
      method: 'electric' as const,
      distance: 200,
      shortFlights: 0,
      longFlights: 0,
    };
    expect(calculateTransportEmissions(habits)).toBe(520);
  });

  it('correctly calculates annual diet emissions for vegan and high food waste', () => {
    const habits = {
      type: 'vegan' as const,
      foodWaste: 'high' as const,
      sourcing: 'mostly-local' as const,
    };
    expect(calculateDietEmissions(habits)).toBe(788);
  });

  it('correctly calculates energy emissions for medium house with high-load appliances', () => {
    const habits = {
      homeSize: 'medium-house' as const,
      highEnergyAppliances: ['ac', 'dryer'],
      cleanEnergy: 'solar' as const,
    };
    expect(calculateEnergyEmissions(habits)).toBe(700);
  });

  it('correctly calculates shopping emissions with recycling discount', () => {
    const habits = {
      clothing: 'moderate' as const,
      electronics: 'none' as const,
      recycling: 'thorough' as const,
    };
    expect(calculateShoppingEmissions(habits)).toBe(425);
  });

  it('correctly calculates combined carbon footprint', () => {
    const transport = { method: 'transit' as const, distance: 50, shortFlights: 0, longFlights: 0 };
    const diet = { type: 'vegetarian' as const, foodWaste: 'minimal' as const, sourcing: 'mixed' as const };
    const energy = { homeSize: 'apartment' as const, highEnergyAppliances: [], cleanEnergy: 'standard' as const };
    const shopping = { clothing: 'none' as const, electronics: 'none' as const, recycling: 'thorough' as const };
    expect(calculateCarbonFootprint(transport, diet, energy, shopping).total).toBe(2774);
  });
});

describe('Emissions classification', () => {
  it('classifies low footprints as Eco Champion', () => {
    expect(getEmissionsClassification(2000).label).toContain('Eco Champion');
  });

  it('classifies moderate footprints', () => {
    expect(getEmissionsClassification(5000).label).toContain('Conscious Consumer');
  });

  it('classifies high footprints', () => {
    expect(getEmissionsClassification(12000).label).toContain('Climate Intensive');
  });
});
