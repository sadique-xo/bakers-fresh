# Production hardening (launch-ready checklist)

Operate this list on **staging first**, then **production**. Vercel and Supabase are configured in dashboards; this repo only documents expectations.

## 1. Vercel environment variables

In the Vercel project → **Settings → Environment Variables**, mirror **Production** and **Preview** as needed.

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | **Server only**. Used by `POST /api/orders` (and similar). Never expose to the client |
| `NEXT_PUBLIC_SITE_URL` | Strongly recommended | Canonical site URL, e.g. `https://www.thebakersfresh.com` (no trailing slash). Used for metadata, OG, JSON-LD |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional | Digits only, e.g. `917004502102` |
| `NEXT_PUBLIC_PHONE_LALPUR_DISPLAY` | Optional | Defaults to `+91 99346 27281`. Shown on `/contact` |
| `NEXT_PUBLIC_GA_ID` | Optional | GA4 ID `G-…`. Omit if analytics not used |
| `NEXT_PUBLIC_PHONE_LALPUR_DISPLAY` | Optional | Lalpur line for contact copy; see `src/lib/site.ts` |

After changing env vars, **redeploy** so the new build picks them up.

## 2. Supabase Auth (sign-ups off)

Admin uses **email + password** on `auth.users`. For a single-owner tool:

1. Supabase Dashboard → **Authentication → Providers → Email**
2. Disable **“Allow new users to sign up”** (or equivalent) so only **invited** users exist
3. Invite the owner email under **Authentication → Users**

Bootstrap for first admin (local or one-off): `npm run admin:bootstrap` (see `scripts/create-admin-user.mjs`). After first login, **rotate** any bootstrap password and rely on invite-only.

## 3. Credential hygiene

- Rotate `SUPABASE_SERVICE_ROLE_KEY` only if leaked; update Vercel env immediately
- Use a **strong unique** admin password; store in a password manager
- Prefer **owner’s real email** once handover is done; remove test accounts if any

## 4. Post-deploy smoke

- Public: home → cakes → order → success URL with **`BF-…`** visible
- **Lalpur phone in Supabase:** ensure `locations.phone` for slug `lalpur` matches your counter line (CONTENT: `+91 99346 27281`). Example:
  ```sql
  update locations set phone = '+919934627281' where slug = 'lalpur';
  ```
- Admin: login → orders → detail → sign out → unauthenticated redirect to `/admin/login`

See `admin_plan.md` → “Things to verify the moment Phase 4 is done”.
