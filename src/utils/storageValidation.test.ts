import { describe, it, expect } from 'vitest';
import {
  parseStoredProfile,
  parseStoredChallenges,
  parseStoredActions,
} from './storageValidation';

describe('localStorage validation', () => {
  it('rejects malformed profile JSON', () => {
    expect(parseStoredProfile('{invalid')).toBeNull();
    expect(parseStoredProfile('{"name":"x"}')).toBeNull();
  });

  it('accepts a valid profile shape', () => {
    const valid = JSON.stringify({
      name: 'Alex',
      hasCompletedOnboarding: true,
      transport: { method: 'petrol', distance: 50, shortFlights: 0, longFlights: 0 },
      diet: { type: 'vegan', foodWaste: 'minimal', sourcing: 'mixed' },
      energy: { homeSize: 'apartment', highEnergyAppliances: [], cleanEnergy: 'standard' },
      shopping: { clothing: 'none', electronics: 'none', recycling: 'thorough' },
    });
    const profile = parseStoredProfile(valid);
    expect(profile?.name).toBe('Alex');
  });

  it('filters invalid challenge entries', () => {
    const raw = JSON.stringify([{ id: 'c1', title: 'Challenge' }, { bad: true }]);
    expect(parseStoredChallenges(raw)).toHaveLength(1);
  });

  it('returns empty array for corrupted actions storage', () => {
    expect(parseStoredActions('not-json')).toEqual([]);
  });
});
