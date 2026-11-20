import "server-only";
import type { Repo } from "./repo";
import { localRepo } from "./local";
import { supabaseRepo } from "./supabase";
import { supabaseKey, supabaseUrl } from "./env";

export const hasSupabase = Boolean(supabaseUrl() && supabaseKey());

export const db: Repo = hasSupabase ? supabaseRepo : localRepo;
export { slugify } from "./repo";
