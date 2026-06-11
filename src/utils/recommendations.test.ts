import { describe, it, expect } from 'vitest';
import { generateContextualRecommendations, getRecommendedChallenges } from './recommendations';
import { UserProfile } from '../types';

const highImpactProfile: UserProfile = {
  name: 'Climate Tester',
  hasCompletedOnboarding: true,
  transport: { method: 'petrol', distance: 200, shortFlights: 2, longFlights: 1 },
  diet: { type: 'heavy-meat', foodWaste: 'high', sourcing: 'mostly-imported' },
  energy: { homeSize: 'large-house', highEnergyAppliances: ['ac'], cleanEnergy: 'standard' },
  shopping: { clothing: 'frequent', electronics: 'frequent', recycling: 'none' },
};

describe('Recommendation engine', () => {
  it('returns actions sorted by descending carbon impact', () => {
    const actions = generateContextualRecommendations(highImpactProfile);
    expect(actions.length).toBeGreaterThan(0);
    const isSorted = actions.every(
      (action, index) => index === 0 || actions[index - 1].impactKg >= action.impactKg
    );
    expect(isSorted).toBe(true);
  });

  it('deduplicates recommendations by id', () => {
    const actions = generateContextualRecommendations(highImpactProfile);
    const ids = actions.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes transport tactics for petrol commuters', () => {
    const actions = generateContextualRecommendations(highImpactProfile);
    expect(actions.some((a) => a.category === 'transport')).toBe(true);
  });

  it('returns six weekly challenge templates', () => {
    const challenges = getRecommendedChallenges(highImpactProfile);
    expect(challenges).toHaveLength(6);
    expect(challenges.every((c) => c.daysCompleted.length === 0)).toBe(true);
  });
});
