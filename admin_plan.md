# Baker's Fresh — Admin Plan

This file replaces the admin sections of `01_PRD.md`, `03_TECH.md`, `05_ADMIN_CURSOR_PROMPT.md`, and `06_DESIGN_WORKFLOW.md` in `claude_files/`. Where this conflicts with those, this wins.

It pairs with the existing root `CLAUDE.md` (build context) and `CONTENT.md` (copy and content).

## Decisions locked

- **Architecture**: same repo as customer site. Admin lives under `src/app/(admin)/`. Single Vercel deploy. Single Supabase project. No subdomain, no second repo.
- **Auth**: Supabase email/password with session cookies. RLS on every table. Admin queries flow through the SSR client, not service role.
- **Scope V1**: orders list + orders detail + status update + reference image viewer. Cake/category/location CRUD comes after V1 if owner asks. Analytics dashboard is V1.5.
- **Design**: neutral shadcn theme (zinc/slate), NOT the pink customer theme. Different layout group. Use Kiranism patterns as inspiration, copy components manually, don't fork.
- **MCPs in use**: Supabase (schema, types, queries), Context7 (docs), shadcn (components). Skip Stitch and Magic MCP for admin — admin doesn't need design distinctiveness, it needs functional clarity.

## Why this shape

- Customer site is already live. Adding admin to the same repo means shared types, shared supabase client, shared deploy. Less drift.
- Session + RLS is the cleanest pattern. Server component reads `supabase.from('orders').select()` directly, RLS enforces "authenticated only", no API route boilerplate per query. Scales when a second admin gets added later.
- Neutral admin theme keeps owner focused on order data, not aesthetic. Pink only on the customer site.

## URL structure

```
Customer (existing, public, no auth)
/                     home
/cakes                catalog
/order                order form
/order/success/[id]   confirmation
/locations
/about
/contact

Admin (new, auth required)
/admin                redirects to /admin/orders or /admin/login
/admin/login          email + password form, no signup
/admin/orders         orders list with filters
/admin/orders/[id]    order detail + status update + image viewer
/admin/cakes          (V1.5) cake catalog admin
/admin/categories     (V1.5)
/admin/locations      (V1.5)
/admin/dashboard      (V1.5) overview stats
/admin/settings       (V1.5) password change
```

## File structure

```
src/
├── app/
│   ├── (public)/                    ← existing customer routes, no change
│   │   ├── page.tsx
│   │   ├── cakes/
│   │   ├── order/
│   │   └── ...
│   ├── (admin)/                     ← NEW route group
│   │   ├── admin/
│   │   │   ├── layout.tsx           ← admin shell (sidebar + header)
│   │   │   ├── page.tsx             ← redirects to /admin/orders
│   │   │   ├── login/
│   │   │   │   └── page.tsx         ← login form
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx         ← orders list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     ← order detail
│   │   │   └── (logout action)
│   │   └── (no shared layout — admin is its own thing)
│   ├── api/
│   │   ├── orders/                  ← existing customer-facing
│   │   └── admin/                   ← NEW
│   │       └── orders/
│   │           └── [id]/
│   │               ├── status/route.ts        ← PATCH status
│   │               └── image-url/route.ts     ← GET signed url
│   └── layout.tsx                   ← root layout, no changes
├── components/
│   ├── ui/                          ← shadcn, shared between public and admin
│   ├── admin/                       ← NEW admin-specific components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── orders-table.tsx
│   │   ├── order-detail.tsx
│   │   ├── status-badge.tsx
│   │   ├── status-update-form.tsx
│   │   └── reference-image-viewer.tsx
│   └── (existing public components)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                ← existing
│   │   ├── server.ts                ← existing
│   │   └── admin.ts                 ← service role client (use sparingly)
│   ├── auth/
│   │   ├── get-user.ts              ← server-side helper to check session
│   │   └── require-admin.ts         ← throws/redirects if not authenticated
│   └── database.types.ts            ← existing, regenerate as schema evolves
└── middleware.ts                    ← existing supabase ssr middleware, extend for /admin
```

## Middleware

The existing `middleware.ts` already has the supabase ssr cookie refresh. Extend it to enforce auth on `/admin/*` except `/admin/login`.

Pseudocode of what middleware should do:
```
1. refresh supabase session cookies (existing)
2. check the request path
3. if path starts with /admin and is not /admin/login:
     get user from supabase
     if no user → redirect to /admin/login
4. if path is /admin/login and user is already authenticated:
     redirect to /admin/orders
5. otherwise pass through
```

## Auth flow

### Login page (`/admin/login`)
- Email + password form (react-hook-form + zod)
- Calls `supabase.auth.signInWithPassword({ email, password })` from a client component
- On success, `router.push('/admin/orders')` then `router.refresh()` to flush server cache
- On failure, show error inline (no toast)
- No signup, no forgot password (V1). Owner is invited via Supabase dashboard once. If they forget password, you reset it from the dashboard.

### Logout
- Server action: `await supabase.auth.signOut()` then `redirect('/admin/login')`
- Place in admin header dropdown

### Session check pattern
For every server component in `(admin)`:
```
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  // ... rest of page
}
```

Actually wrap that in `lib/auth/require-admin.ts` so it's one line per page.

## RLS policy verification

The existing schema in `setup/supabase_migration.sql` defines these policies. Verify they exist on your live Supabase:

```sql
-- Public reads (already in place)
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active cakes" ON cakes FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active locations" ON locations FOR SELECT USING (is_active = true);

-- Public order insert (already in place — customers submit orders without auth)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

-- Admin reads/writes orders (verify these are active)
CREATE POLICY "Authenticated users can read orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete orders" ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- Catalog management
CREATE POLICY "Authenticated users can manage cakes" ON cakes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage locations" ON locations FOR ALL USING (auth.role() = 'authenticated');
```

Run via supabase mcp: `list_migrations` to see what's applied. If anything is missing, apply via `execute_sql`.

Then run `get_advisors --type=security` to flag policy gaps.

## Storage signed URLs

The `order-references` bucket is private. Admin viewing order detail needs signed URLs for the uploaded images.

### Approach
Generate signed URLs server-side in the order detail page server component, pass URLs as props to the client image viewer:

```
const supabase = await createClient();
const order = await supabase.from('orders').select('*').eq('id', params.id).single();

const signedUrls = await Promise.all(
  (order.data?.reference_image_urls ?? []).map(async (path) => {
    const { data } = await supabase.storage
      .from('order-references')
      .createSignedUrl(path, 3600);  // 1 hour expiry
    return data?.signedUrl;
  })
);
```

Then `<ReferenceImageViewer urls={signedUrls} />` in the page.

If image_urls are stored as full URLs (not paths), you'll need to extract the path. Recommend storing path only going forward.

### Alternative
A `/api/admin/orders/[id]/image-url?path=xxx` route that auths the admin then returns a signed URL. Use this if image set is huge or pagination is needed. For V1, server-side bulk-sign in the page is simpler and faster.

## Admin layout (sidebar + header)

`src/app/(admin)/admin/layout.tsx`:

```
- ProtectAdmin wrapper (calls require-admin)
- Sidebar (left, collapsible on mobile)
  - Logo: "Baker's Fresh Admin" in plain sans-serif
  - Nav items: Orders, Cakes (V1.5), Categories (V1.5), Locations (V1.5), Dashboard (V1.5), Settings (V1.5)
- Header (top right)
  - Theme toggle (light only for V1, dark mode optional later)
  - User dropdown: email shown, "sign out" button
- Main content area
- Use shadcn Sidebar component or a simple flex layout
```

Keep it light and functional. Owner uses this on phone too — make sure mobile sidebar collapses to a hamburger (use shadcn Sheet for mobile drawer).

Theme: stick with shadcn's neutral / zinc default. No pink in admin. The visual contrast with the customer site is intentional.

## Page 1: Orders List (`/admin/orders`)

### Above table
- Page heading: "Orders"
- Filter row:
  - Status: All / Pending / Confirmed / Preparing / Ready / Completed / Cancelled / Rejected (shadcn Select or chip group)
  - Date range: today / this week / this month / all (shadcn Select)
  - Search input: search by order number or phone
- URL state: filters reflected in query params (`?status=pending&range=week`)

### Table (TanStack Table)
Columns:
- Order # (link to detail)
- Customer name
- Phone (with click-to-call icon)
- Cake type + size
- Delivery date
- Status (colored badge)
- Created (relative time, e.g. "2 hrs ago")
- Quick actions (dropdown: view, mark confirmed, mark ready, mark completed)

### Behavior
- Default sort: most recent first
- Pagination: 20 per page, server-side via Supabase range queries
- Loading skeleton while fetching
- Empty state: "no orders match these filters"
- Bulk select removed from V1 — owner just clicks one at a time

### Status badge colors (Tailwind)
- pending — `bg-amber-100 text-amber-800`
- confirmed — `bg-blue-100 text-blue-800`
- preparing — `bg-purple-100 text-purple-800`
- ready — `bg-orange-100 text-orange-800`
- completed — `bg-green-100 text-green-800`
- cancelled — `bg-gray-100 text-gray-700`
- rejected — `bg-red-100 text-red-800`

## Page 2: Order Detail (`/admin/orders/[id]`)

### Top bar
- "← Back to orders" link
- Order number (large, bold)
- Status badge
- Created timestamp + "last updated X mins ago"

### Two-column layout (stacks on mobile)

#### Left column (2/3 width)

**Customer card**
- Name (bold, large)
- Phone with click-to-call link
- WhatsApp click-to-chat icon (opens wa.me with order number pre-filled in greeting)
- Email if present

**Cake details card**
- Type · Size · Flavor
- Eggless badge if true
- Message on cake (if filled)
- Special instructions (if filled, in a quoted block style)

**Reference images grid**
- 3-4 column grid of signed image URLs
- Each image clickable → opens dialog/lightbox with full-size view
- Empty state: "no reference images uploaded"

**Delivery card**
- Method: Pickup or Delivery
- Date + time slot
- Address (if delivery), with click-to-open Google Maps button
- "Copy address" button (clipboard) for use when calling delivery rider

#### Right column (1/3 width, sticky on desktop)

**Status update card**
- Current status badge
- Dropdown to change status
- "Update status" button
- Auto-stamps `confirmed_at = now()` when status moves to confirmed
- Auto-stamps `completed_at = now()` when status moves to completed
- Optimistic UI: badge updates immediately, revert on error

**Pricing card**
- Estimated price input (₹) — owner fills after confirmation call
- Final price input (₹) — owner fills when payment received
- "Save" button

**Admin notes card**
- Textarea (max 1000 chars)
- Auto-save on blur with 500ms debounce
- Subtle "saved" indicator on success

### Bottom
- Activity strip (just timestamps for V1)
  - Created: [created_at]
  - Confirmed: [confirmed_at if set]
  - Completed: [completed_at if set]
  - Last updated: [updated_at]

### Mutations
Status, pricing, and notes updates go through Server Actions or simple `/api/admin/orders/[id]/...` PATCH routes. Either works. Server Actions are cleaner with Next 16; use those.

## API routes (admin)

Most admin reads happen in server components (RSC + RLS). Mutations need routes or actions.

### Server Actions (preferred)
Create `src/app/(admin)/admin/orders/[id]/actions.ts`:
```
'use server';

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const updates: any = { status };
  if (status === 'confirmed') updates.confirmed_at = new Date().toISOString();
  if (status === 'completed') updates.completed_at = new Date().toISOString();

  const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
  if (error) throw error;

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/orders');
}

export async function updateOrderPricing(orderId: string, estimated: number | null, final: number | null) { ... }
export async function updateOrderNotes(orderId: string, notes: string) { ... }
```

RLS handles the auth check at the database level. The user check above is belt + suspenders.

## Supabase invitation flow (do this once before V1 build)

1. Open Supabase dashboard for project `munvjzjcwxomzpsyiuhl`
2. Authentication > Users > Invite user
3. Email: owner's email (or temporarily `dev.bakersfresh@sadique.co`)
4. They click email link, set password
5. Authentication > Settings > "Allow new users to sign up" → toggle OFF
6. Confirm invited user appears in Users list

For V1 testing, you can also use your own email and just verify the flow works.

## Build sequence (do in this order)

### Phase 0 — Pre-flight (10 min)
1. Verify the existing root middleware.ts is supabase ssr (check `middleware.ts`)
2. Run `list_migrations` via supabase mcp — confirm RLS policies for orders are applied
3. Run `generate_typescript_types` and confirm `src/lib/database.types.ts` is fresh
4. Verify owner email is invited and signups are disabled

### Phase 1 — Auth + Shell (30 min)
5. Extend middleware.ts to gate `/admin/*` (except `/admin/login`)
6. Create `src/lib/auth/require-admin.ts` and `get-user.ts`
7. Create `src/app/(admin)/admin/layout.tsx` (sidebar + header)
8. Create `src/app/(admin)/admin/login/page.tsx` (login form)
9. Create `src/app/(admin)/admin/page.tsx` that redirects to `/admin/orders`
10. Test: log in works, hitting `/admin/orders` without login redirects to `/admin/login`

### Phase 2 — Orders List (30 min)
11. Create `src/components/admin/status-badge.tsx`
12. Create `src/components/admin/orders-table.tsx` (TanStack Table)
13. Create `src/app/(admin)/admin/orders/page.tsx`
14. Wire up filters (status, date range, search) with URL state
15. Test: orders show up, filters work

### Phase 3 — Order Detail (45 min)
16. Create `src/components/admin/order-detail.tsx`
17. Create `src/components/admin/reference-image-viewer.tsx` (lightbox dialog)
18. Create `src/components/admin/status-update-form.tsx`
19. Create `src/app/(admin)/admin/orders/[id]/page.tsx` with signed URL generation
20. Create server actions for status, pricing, notes
21. Test end-to-end: submit a customer order from the public site, find it in admin, mark confirmed, view reference images

### Phase 4 — Polish (15 min)
22. Add toasts for action success/failure (sonner)
23. Add loading skeletons
24. Test on mobile
25. Deploy to Vercel — verify env vars carry over (they should, same project)

**Total: ~2 hours focused work**

## What's NOT in V1

These need a separate plan and conversation, not a single Cursor prompt:

- Cake / category / location CRUD (V1.5)
- Dashboard with stats and charts (V1.5)
- Settings (password change, business hours)
- Multi-admin user management
- Notifications (email, WhatsApp, SMS)
- Order export to CSV
- Reports and analytics
- Bulk status updates

If owner asks for any of the above after seeing V1, that's a paid V1.5 conversation.

## Decisions you might be tempted to revisit, don't

- **Don't add a separate admin theme color.** Neutral zinc is correct. Resist adding pink "for brand consistency". Customer brand and admin tool are different products.
- **Don't fork Kiranism into a sub-folder.** Copy components manually. The sub-folder approach causes weird import paths and dependency duplication.
- **Don't move auth to api routes.** RSC + RLS is the modern Next 16 + Supabase pattern. API routes for auth checks are 2023 thinking.
- **Don't build the dashboard first.** Owner needs orders list working. Stats can come after they have actual orders flowing through.

## Open questions before launch

1. **Real owner email** — when do we switch from dev email to owner's email?
2. **Post-confirmation flow** — does owner want a "send confirmation SMS" button on order detail? (V1.5 feature, but worth confirming the desired flow)
3. **Mobile-first or desktop-first** — owner likely uses phone. Confirm and prioritize mobile responsive testing.
4. **Outlets context** — does each outlet have its own admin user, or one master account? V1 = one account, V2 might split by outlet.

## Things to verify the moment Phase 4 is done

- [ ] Submit a real order from public site
- [ ] Order appears in `/admin/orders` within seconds
- [ ] Click order → detail page loads with all info
- [ ] Reference images display (if uploaded)
- [ ] Mark as confirmed → status updates, confirmed_at stamped
- [ ] Update pricing → saves
- [ ] Add admin notes → saves
- [ ] Log out → redirects to login
- [ ] Try to access /admin/orders without auth → redirects to login
- [ ] Mobile responsive at 375px
- [ ] Customer site still works (didn't break anything)

## Mandatory

- Footer credit on customer site stays: `built by sadique.co` linking to https://sadique.co
- Admin doesn't need a footer credit (owner-only tool)
- All admin copy in Sentence case (NOT all lowercase) — this is a tool, not brand voice. Title Case for headings, sentence case for everything else.
- This is the one place we ignore the "all lowercase" rule from CLAUDE.md.