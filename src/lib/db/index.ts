import "server-only";
import type { Repo } from "./repo";
import { localRepo } from "./local";
import { supabaseRepo } from "./supabase";

export const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const db: Repo = hasSupabase ? supabaseRepo : localRepo;
export { slugify } from "./repo";
