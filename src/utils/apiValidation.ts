import { z } from 'zod';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;
export const MAX_CHAT_HISTORY = 20;
const MAX_AI_RESPONSE_LENGTH = 8000;

export const commuteMethodSchema = z.enum(['petrol', 'diesel', 'electric', 'transit', 'active']);
export const dietTypeSchema = z.enum(['heavy-meat', 'medium-meat', 'low-meat', 'vegetarian', 'vegan']);
export const foodWasteSchema = z.enum(['minimal', 'moderate', 'high']);
export const sourcingSchema = z.enum(['mostly-local', 'mixed', 'mostly-imported']);
export const homeSizeSchema = z.enum(['apartment', 'medium-house', 'large-house']);
export const cleanEnergySchema = z.enum(['solar', 'mixed', 'standard']);
export const purchaseFrequencySchema = z.enum(['none', 'moderate', 'frequent']);
export const recyclingSchema = z.enum(['thorough', 'mixed', 'none']);

const profileRawSchema = z
  .object({
    transport: z
      .object({
        method: commuteMethodSchema.optional(),
        distance: z.number().min(0).max(500).optional(),
        shortFlights: z.number().min(0).max(50).optional(),
        longFlights: z.number().min(0).max(50).optional(),
      })
      .optional(),
    diet: z
      .object({
        type: dietTypeSchema.optional(),
        foodWaste: foodWasteSchema.optional(),
        sourcing: sourcingSchema.optional(),
      })
      .optional(),
    energy: z
      .object({
        homeSize: homeSizeSchema.optional(),
        highEnergyAppliances: z.array(z.string().max(50)).max(10).optional(),
        cleanEnergy: cleanEnergySchema.optional(),
      })
      .optional(),
    shopping: z
      .object({
        clothing: purchaseFrequencySchema.optional(),
        electronics: purchaseFrequencySchema.optional(),
        recycling: recyclingSchema.optional(),
      })
      .optional(),
  })
  .optional();

export const coachInsightsSchema = z.object({
  name: z.string().max(100).optional(),
  transport: z.coerce.number().min(0).max(100_000).optional(),
  diet: z.coerce.number().min(0).max(100_000).optional(),
  energy: z.coerce.number().min(0).max(100_000).optional(),
  shopping: z.coerce.number().min(0).max(100_000).optional(),
  totalEmissions: z.coerce.number().min(0).max(500_000).optional(),
  profileRaw: profileRawSchema,
});

const messagePartSchema = z.object({
  text: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'model']),
  parts: z.array(messagePartSchema).min(1).max(5),
});

export const coachChatSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(MAX_MESSAGES),
  profileRaw: profileRawSchema,
});

export const coachInsightResponseSchema = z.object({
  headline: z.string().min(1).max(200),
  analysis: z.string().min(1).max(4000),
  recommendations: z.array(z.string().min(1).max(500)).min(1).max(10),
});

export const coachChatResponseSchema = z.object({
  text: z.string().min(1).max(MAX_AI_RESPONSE_LENGTH),
});

export type CoachInsightsInput = z.infer<typeof coachInsightsSchema>;
export type CoachChatInput = z.infer<typeof coachChatSchema>;
export type CoachInsightResponseData = z.infer<typeof coachInsightResponseSchema>;
export type CoachChatResponseData = z.infer<typeof coachChatResponseSchema>;

export function parseCoachInsights(body: unknown) {
  return coachInsightsSchema.safeParse(body);
}

export function parseCoachChat(body: unknown) {
  return coachChatSchema.safeParse(body);
}

export function validateCoachInsightResponse(data: unknown) {
  return coachInsightResponseSchema.safeParse(data);
}

export function validateCoachChatResponse(text: unknown) {
  return coachChatResponseSchema.safeParse({ text });
}

export function sanitizePromptText(value: unknown, maxLength = 200): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    .replace(/"""/g, '')
    .trim()
    .slice(0, maxLength);
}

export function truncateChatMessages<T>(messages: T[], max = MAX_CHAT_HISTORY): T[] {
  return messages.slice(-max);
}

export function extractLatestUserMessage(messages: CoachChatInput['messages']): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === 'user') {
      return msg.parts[0]?.text ?? null;
    }
  }
  return messages[messages.length - 1]?.parts[0]?.text ?? null;
}
