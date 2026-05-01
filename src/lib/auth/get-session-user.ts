import type { User } from "@supabase/supabase-js";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
