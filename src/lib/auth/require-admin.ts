import { redirect } from "next/navigation";

import type { User } from "@supabase/supabase-js";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function requireAdmin(): Promise<{
  user: User;
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>;
}> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return { user, supabase };
}
