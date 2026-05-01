# Supabase advisor follow-ups (short security note)

Notes for items often reported by Supabase **Database Linter / Advisors**. Apply judgment per project.

## Anonymous `INSERT` on `orders`

RLS allows `INSERT` on `orders` for the anon role with `WITH CHECK (true)`.

**Why we keep it (acceptable boundary):**

- The **production path** submits orders via `POST /api/orders`, which uses the **service role** server-side and validates payload with Zod (dates, slots, shapes).
- The permissive policy is **defense-in-depth**: if someone called Supabase REST with only the anon key, inserts could theoretically succeed without business validation.

**Mitigations:**

- Rate limiting at edge (e.g. Vercel Firewall, Cloudflare, or middleware throttles) for `/api/orders`
- Monitor abnormal insert volume in Supabase logs
- Optional hardening v2: narrow `WITH CHECK` to required columns / drop anon insert and rely solely on server (requires no direct anon inserts elsewhere).

Revisit this policy if abuse appears.

## `function_search_path_mutable` (trigger helpers)

PostgreSQL warns when functions omit a fixed `search_path`. Stateless trigger helpers (`update_updated_at`, `generate_order_number`) should use `SET search_path = public` so object resolution is predictable.

Fresh installs: reflected in `setup/supabase_migration.sql`.  
Existing projects: apply `setup/migrations/20260201120000_security_function_search_path.sql` in the SQL Editor (idempotent).

## `rls_auto_enable` callable by anon

Some Supabase projects expose helpers (e.g. related to automated RLS). If advisors flag **`EXECUTE`** granted too broadly:

1. Identify the exact function name in Dashboard → Database → Roles / SQL
2. `REVOKE EXECUTE ON FUNCTION … FROM anon, authenticated` if neither should call it  
3. If Supabase internals require authenticated-only access, restrict to **`service_role`** or lock down per Supabase docs for your platform version  

Intent: only trusted roles invoke maintenance helpers.

## Storage: public `cake-images` listing

Public buckets often allow **list** operations; advisors may warn.

**Tradeoff:**

- **Public read URLs** without list: good UX for predictable image URLs; users can guess paths only if filenames are enumerable
- **Mitigation**: use non-guessable object paths (UUID folders), optionally disable listing at bucket policy level if CDN allows direct-by-URL-only access

Sensitive assets stay in **`order-references`** (private + signed URLs in admin).

## Review cadence

Re-run advisors after migrations; update this file when decisions change.
