import { z } from "zod";

export const newsletterRequestSchema = z.object({
  email: z
    .string({ message: "Please provide a valid email address." })
    .trim()
    .toLowerCase()
    .max(320, "Please provide a valid email address.")
    .email("Please provide a valid email address."),
});

export const contactFormSchema = z
  .object({
    form_type: z.enum(["contact", "speaking"]).default("contact"),
    company: z.string().trim().max(120).optional().default(""),
    name: z.string().trim().min(1, "Please provide your name.").max(120),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(320, "Please provide a valid email address.")
      .email("Please provide a valid email address."),
    message: z.string().trim().max(4_000).optional().default(""),
    subject: z.string().trim().max(180).optional().default(""),
    organization: z.string().trim().max(180).optional().default(""),
    event_date: z.string().trim().max(120).optional().default(""),
    location: z.string().trim().max(160).optional().default(""),
    event_type: z.string().trim().max(160).optional().default(""),
    audience_size: z.string().trim().max(80).optional().default(""),
    budget: z.string().trim().max(120).optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.form_type === "contact" && !data.message) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["message"],
        message: "Please include a message.",
      });
    }

    if (data.form_type === "speaking") {
      if (!data.event_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["event_type"],
          message: "Please select an event type.",
        });
      }

      if (!data.audience_size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["audience_size"],
          message: "Please select a group size.",
        });
      }

      if (!data.event_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["event_date"],
          message: "Please provide an event date.",
        });
      }

      if (!data.location) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["location"],
          message: "Please provide the event location.",
        });
      }
    }
  });

export type NewsletterRequest = z.infer<typeof newsletterRequestSchema>;
export type ContactFormRequest = z.infer<typeof contactFormSchema>;

export function getValidationMessage(error: z.ZodError): string {
  const first = error.issues[0];
  return first?.message || "Invalid request.";
}
