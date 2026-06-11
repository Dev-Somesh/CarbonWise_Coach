import { describe, it, expect } from 'vitest';
import { getPrimaryEmissionCategory, getCategoryPercentages } from './footprintBreakdown';
import type { CarbonFootprint } from '../types';

const makeFootprint = (transport: number, diet: number, energy: number, shopping: number): CarbonFootprint => ({
  transport, diet, energy, shopping,
  total: transport + diet + energy + shopping,
});

describe('getPrimaryEmissionCategory', () => {
  it('returns the highest category', () => {
    const fp = makeFootprint(3000, 500, 800, 400);
    const result = getPrimaryEmissionCategory(fp);
    expect(result.key).toBe('transport');
    expect(result.value).toBe(3000);
  });

  it('returns diet when diet is highest', () => {
    const fp = makeFootprint(400, 2500, 800, 300);
    expect(getPrimaryEmissionCategory(fp).key).toBe('diet');
  });

  it('returns energy when energy is highest', () => {
    const fp = makeFootprint(400, 500, 4000, 300);
    expect(getPrimaryEmissionCategory(fp).key).toBe('energy');
  });

  it('returns shopping when shopping is highest', () => {
    const fp = makeFootprint(200, 300, 400, 5000);
    expect(getPrimaryEmissionCategory(fp).key).toBe('shopping');
  });

  it('has a label field', () => {
    const fp = makeFootprint(1000, 1000, 1000, 1000);
    const result = getPrimaryEmissionCategory(fp);
    expect(typeof result.label).toBe('string');
    expect(result.label.length).toBeGreaterThan(0);
  });
});

describe('getCategoryPercentages', () => {
  it('all percentages sum to 100 for non-zero total', () => {
    const fp = makeFootprint(1000, 1500, 500, 1000);
    const pct = getCategoryPercentages(fp);
    const sum = pct.transport + pct.diet + pct.energy + pct.shopping;
    expect(sum).toBeCloseTo(100, 5);
  });

  it('returns 0 for all when total is 0', () => {
    const fp = makeFootprint(0, 0, 0, 0);
    const pct = getCategoryPercentages(fp);
    expect(pct.transport).toBe(0);
    expect(pct.diet).toBe(0);
    expect(pct.energy).toBe(0);
    expect(pct.shopping).toBe(0);
  });

  it('returns correct percentage for single category', () => {
    const fp = makeFootprint(2000, 0, 0, 0);
    const pct = getCategoryPercentages(fp);
    expect(pct.transport).toBeCloseTo(100);
    expect(pct.diet).toBe(0);
  });

  it('proportions reflect input values', () => {
    const fp = makeFootprint(1000, 3000, 0, 0);
    const pct = getCategoryPercentages(fp);
    expect(pct.transport).toBeCloseTo(25);
    expect(pct.diet).toBeCloseTo(75);
  });
});
