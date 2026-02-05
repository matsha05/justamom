const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  if (!value || value.length > 320) {
    return false;
  }

  return EMAIL_REGEX.test(value);
}
