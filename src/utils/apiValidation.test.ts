import { describe, it, expect } from 'vitest';
import {
  parseCoachInsights,
  parseCoachChat,
  extractLatestUserMessage,
  validateCoachInsightResponse,
  validateCoachChatResponse,
  sanitizePromptText,
  truncateChatMessages,
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

  it('rejects coach-insights with invalid enum values', () => {
    const result = parseCoachInsights({
      profileRaw: { transport: { method: 'rocket-ship' } },
    });
    expect(result.success).toBe(false);
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

  it('validates AI insight response shape', () => {
    const result = validateCoachInsightResponse({
      headline: 'Great job!',
      analysis: 'Your transport is the top driver.',
      recommendations: ['Take the train', 'Cycle more', 'Work from home'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects malformed AI insight responses', () => {
    expect(validateCoachInsightResponse({ headline: '' }).success).toBe(false);
  });

  it('validates chat response text length', () => {
    expect(validateCoachChatResponse('Hello coach').success).toBe(true);
    expect(validateCoachChatResponse('').success).toBe(false);
  });

  it('sanitizes prompt injection characters', () => {
    expect(sanitizePromptText('hello\nworld"""')).toBe('hello world');
  });

  it('truncates chat history to recent messages', () => {
    const messages = Array.from({ length: 30 }, (_, i) => ({ id: i }));
    expect(truncateChatMessages(messages, 20)).toHaveLength(20);
    expect(truncateChatMessages(messages, 20)[0].id).toBe(10);
  });
});
