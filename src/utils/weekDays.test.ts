import { describe, it, expect } from 'vitest';
import { getCurrentWeekDays } from './weekDays';

describe('getCurrentWeekDays', () => {
  it('returns exactly 7 days', () => {
    const days = getCurrentWeekDays();
    expect(days).toHaveLength(7);
  });

  it('returns days with required fields', () => {
    const days = getCurrentWeekDays();
    for (const day of days) {
      expect(day).toHaveProperty('name');
      expect(day).toHaveProperty('dateStr');
      expect(day).toHaveProperty('display');
    }
  });

  it('dateStr is in YYYY-MM-DD format', () => {
    const days = getCurrentWeekDays();
    const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
    for (const day of days) {
      expect(day.dateStr).toMatch(isoPattern);
    }
  });

  it('single-char names match M T W T F S S pattern', () => {
    const days = getCurrentWeekDays();
    const expected = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    expect(days.map(d => d.name)).toEqual(expected);
  });

  it('dates are consecutive', () => {
    const days = getCurrentWeekDays();
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1].dateStr).getTime();
      const curr = new Date(days[i].dateStr).getTime();
      expect(curr - prev).toBe(86400000); // 1 day in ms
    }
  });

  it('week starts on Monday', () => {
    const days = getCurrentWeekDays();
    const monday = new Date(days[0].dateStr);
    expect(monday.getDay()).toBe(1); // 1 = Monday
  });
});
