import {
  UserProfile,
  WeeklyChallenge,
  EmissionHistoryItem,
  SustainabilityAction,
} from '../types';
import { DEFAULT_PROFILE } from './presets';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseStoredProfile(raw: string | null): UserProfile | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    if (typeof parsed.name !== 'string') return null;
    if (typeof parsed.hasCompletedOnboarding !== 'boolean') return null;
    if (!isRecord(parsed.transport) || !isRecord(parsed.diet) || !isRecord(parsed.energy) || !isRecord(parsed.shopping)) {
      return null;
    }
    return parsed as unknown as UserProfile;
  } catch {
    return null;
  }
}

export function parseStoredChallenges(raw: string | null): WeeklyChallenge[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is WeeklyChallenge =>
        isRecord(item) && typeof item.id === 'string' && typeof item.title === 'string'
    );
  } catch {
    return [];
  }
}

export function parseStoredHistory(raw: string | null): EmissionHistoryItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is EmissionHistoryItem =>
        isRecord(item) && typeof item.date === 'string' && isRecord(item.emissions)
    );
  } catch {
    return [];
  }
}

export function parseStoredActions(raw: string | null): SustainabilityAction[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SustainabilityAction =>
        isRecord(item) && typeof item.id === 'string' && typeof item.impactKg === 'number'
    );
  } catch {
    return [];
  }
}

export function restoreSessionFromStorage(): {
  profile: UserProfile;
  challenges: WeeklyChallenge[];
  history: EmissionHistoryItem[];
  actions: SustainabilityAction[];
} {
  const profile =
    parseStoredProfile(localStorage.getItem('cw_user_profile')) ?? DEFAULT_PROFILE;

  return {
    profile,
    challenges: parseStoredChallenges(localStorage.getItem('cw_user_challenges')),
    history: parseStoredHistory(localStorage.getItem('cw_user_history')),
    actions: parseStoredActions(localStorage.getItem('cw_user_actions')),
  };
}
