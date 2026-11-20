/**
 * Supabase settings, read forgivingly so a small paste mistake in Vercel doesn't take the site down.
 *
 * URL: SUPABASE_URL, else NEXT_PUBLIC_SUPABASE_URL (added by Vercel's Supabase integration).
 *   Accepts "https://<ref>.supabase.co", the same with a trailing "/" or "/rest/v1/", stray spaces,
 *   or a dashboard link like "https://supabase.com/dashboard/project/<ref>/...". All become
 *   "https://<ref>.supabase.co".
 * Key: SUPABASE_SECRET_KEY (added by the integration), else SUPABASE_SERVICE_ROLE_KEY.
 */
export function supabaseUrl(): string | null {
  const raw = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/^["']|["']$/g, "");
  if (!raw) return null;
  const dash = raw.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i);
  if (dash) return `https://${dash[1]}.supabase.co`;
  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`).origin;
  } catch {
    return null;
  }
}

export function supabaseKey(): string | null {
  const k = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim().replace(/^["']|["']$/g, "");
  return k || null;
}
