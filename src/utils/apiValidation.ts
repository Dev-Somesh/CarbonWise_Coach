import { z } from 'zod';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;

const profileRawSchema = z
  .object({
    transport: z
      .object({
        method: z.string().optional(),
        distance: z.number().optional(),
        shortFlights: z.number().optional(),
        longFlights: z.number().optional(),
      })
      .optional(),
    diet: z
      .object({
        type: z.string().optional(),
        foodWaste: z.string().optional(),
        sourcing: z.string().optional(),
      })
      .optional(),
    energy: z
      .object({
        homeSize: z.string().optional(),
        highEnergyAppliances: z.array(z.string()).optional(),
        cleanEnergy: z.string().optional(),
      })
      .optional(),
    shopping: z
      .object({
        clothing: z.string().optional(),
        electronics: z.string().optional(),
        recycling: z.string().optional(),
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

export type CoachInsightsInput = z.infer<typeof coachInsightsSchema>;
export type CoachChatInput = z.infer<typeof coachChatSchema>;

export function parseCoachInsights(body: unknown) {
  return coachInsightsSchema.safeParse(body);
}

export function parseCoachChat(body: unknown) {
  return coachChatSchema.safeParse(body);
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
