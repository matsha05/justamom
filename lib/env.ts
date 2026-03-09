import { z } from "zod";

const productionServerEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url("NEXT_PUBLIC_SITE_URL must be a valid URL."),
  FORMSPREE_ENDPOINT: z.url("FORMSPREE_ENDPOINT must be a valid URL."),
  MAILER_LITE_API_KEY: z.string().trim().min(1, "MAILER_LITE_API_KEY is required."),
  MAILERLITE_GROUP_ID: z.string().trim().min(1, "MAILERLITE_GROUP_ID is required."),
});

export function shouldValidateServerEnv(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return env.NODE_ENV === "production";
}

export function getServerEnvValidationErrors(
  env: NodeJS.ProcessEnv = process.env
): string[] {
  const parsed = productionServerEnvSchema.safeParse(env);
  if (parsed.success) {
    return [];
  }

  return parsed.error.issues.map((issue) => issue.message);
}

export function validateServerEnv(env: NodeJS.ProcessEnv = process.env): void {
  if (!shouldValidateServerEnv(env)) {
    return;
  }

  const errors = getServerEnvValidationErrors(env);
  if (errors.length === 0) {
    return;
  }

  throw new Error(
    `Invalid production environment configuration:\n- ${errors.join("\n- ")}`
  );
}
