#!/usr/bin/env node
/**
 * Bootstrap a Supabase Auth user for Baker's Fresh admin (/admin/login).
 * Uses SUPABASE_SERVICE_ROLE_KEY from env (never commit that key).
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-admin-user.mjs
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='choose-strong' node --env-file=.env.local scripts/create-admin-user.mjs
 *
 * If ADMIN_PASSWORD is omitted, a random password is printed once (save it).
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

const email = (process.env.ADMIN_EMAIL || "dev.cukucafe@gmail.com").trim().toLowerCase();
let password =
  process.env.ADMIN_PASSWORD?.trim() ||
  randomBytes(18).toString("base64url") + "!a1"; // satisfies typical length rules

function fail(msg) {
  console.error("error:", msg);
  process.exit(1);
}

if (!url) fail("missing NEXT_PUBLIC_SUPABASE_URL");
if (!serviceRole) fail("missing SUPABASE_SERVICE_ROLE_KEY in environment");

const admin = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserIdForEmail(target) {
  const want = target.toLowerCase();
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === want);
    if (found) return found.id;
    if (data.users.length < 200) return null;
    page += 1;
    if (page > 25) return null;
  }
}

async function main() {
  const existingId = await findUserIdForEmail(email);

  if (existingId) {
    const { error } = await admin.auth.admin.updateUserById(existingId, {
      password,
      email_confirm: true,
    });
    if (error) fail(error.message);
    console.log("updated existing Supabase Auth user");
    console.log("  email:   ", email);
    console.log("  user id:", existingId);
    console.log("  password:", password);
    console.log("");
    console.log("sign in at /admin/login (then change password in Dashboard if you like).");
    return;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" }, // informational only; app uses authenticated RLS today
    user_metadata: { label: "bakers-fresh-admin" },
  });
  if (error) fail(error.message);

  console.log("created Supabase Auth user");
  console.log("  email:   ", email);
  console.log("  user id:", data.user.id);
  console.log("  password:", password);
  console.log("");
  console.log("sign in at /admin/login");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
