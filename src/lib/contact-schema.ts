import { z } from "zod";

export const TOPICS = [
  "Story tip",
  "Advertising & partnerships",
  "Podcast",
  "Press",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  email: z.string().trim().email("That email doesn't look right"),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^[+\d\s()-]{7,20}$/.test(v), "Please enter a valid phone number"),
  topic: z.enum(TOPICS, { message: "Pick a topic" }),
  message: z.string().trim().min(20, "A little more detail helps — at least 20 characters").max(4000),
  // Honeypot: real users never see or fill this.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
