import type { CarbonFootprint } from '../types';
import type { EmissionCategory } from '../types';

const BREAKDOWN_CATEGORIES: Omit<EmissionCategory, 'value'>[] = [
  { key: 'transport', label: 'Transportation' },
  { key: 'diet', label: 'Diet & Food' },
  { key: 'energy', label: 'Home Utilities' },
  { key: 'shopping', label: 'Shopping & Retail' },
];

export function getPrimaryEmissionCategory(footprint: CarbonFootprint): EmissionCategory {
  const categories: EmissionCategory[] = BREAKDOWN_CATEGORIES.map((cat) => ({
    ...cat,
    value: footprint[cat.key as keyof CarbonFootprint] as number,
  }));
  return [...categories].sort((a, b) => b.value - a.value)[0] ?? categories[0];
}

export function getCategoryPercentages(footprint: CarbonFootprint) {
  const total = footprint.total;
  const pct = (value: number) => (total > 0 ? (value / total) * 100 : 0);
  return {
    transport: pct(footprint.transport),
    diet: pct(footprint.diet),
    energy: pct(footprint.energy),
    shopping: pct(footprint.shopping),
  };
}
