import { describe, it, expect } from 'vitest';
import {
  parseCoachInsights,
  parseCoachChat,
  extractLatestUserMessage,
} from './apiValidation';

describe('API request validation', () => {
  it('accepts valid coach-insights payloads', () => {
    const result = parseCoachInsights({
      name: 'Alex',
      transport: 1200,
      diet: 900,
      energy: 1500,
      shopping: 300,
      totalEmissions: 3900,
      profileRaw: { transport: { method: 'petrol', distance: 50 } },
    });
    expect(result.success).toBe(true);
  });

  it('rejects coach-insights with negative emissions', () => {
    const result = parseCoachInsights({ transport: -100 });
    expect(result.success).toBe(false);
  });

  it('rejects coach-chat without messages', () => {
    const result = parseCoachChat({ messages: [] });
    expect(result.success).toBe(false);
  });

  it('rejects oversized chat messages', () => {
    const result = parseCoachChat({
      messages: [{ role: 'user', parts: [{ text: 'x'.repeat(2001) }] }],
    });
    expect(result.success).toBe(false);
  });

  it('extracts the latest user message from chat history', () => {
    const messages = [
      { role: 'user' as const, parts: [{ text: 'Hello' }] },
      { role: 'assistant' as const, parts: [{ text: 'Hi there' }] },
      { role: 'user' as const, parts: [{ text: 'How do I reduce flights?' }] },
    ];
    expect(extractLatestUserMessage(messages)).toBe('How do I reduce flights?');
  });
});
