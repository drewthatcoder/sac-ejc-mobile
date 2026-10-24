/** First name for display, with fallbacks for accounts created before first/last were stored separately. */
export function deriveFirstName(metadata: unknown, email?: string | null): string | null {
  const meta = metadata && typeof metadata === "object" ? (metadata as Record<string, unknown>) : undefined;
  const explicit = text(meta?.first_name);
  if (explicit) return explicit;
  const full = text(meta?.full_name);
  if (full) {
    const word = full.split(/\s+/).find(Boolean);
    if (word) return word;
  }
  const prefix = email?.split("@")[0]?.trim();
  return prefix || null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
