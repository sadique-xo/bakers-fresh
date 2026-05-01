# Baker's Fresh — Build Context

## What we're building

A custom cake order website for Baker's Fresh, an established bakery in Ranchi. The site lists **two retail counters**: Lalpur (main) and Neori. The owner is the same person as Cuku Cafe (existing client).

Customers browse cakes, fill a custom cake order form with a reference image upload, and the owner calls them within 2 hours to confirm details and take payment manually. No payment gateway in V1.

Built by sadique.co (footer credit mandatory on every page).

## Stack

- Next.js 16.2.4 (App Router, TypeScript)
- React 19, Tailwind CSS v4
- shadcn/ui (New York style, neutral base)
- Supabase (Postgres + Storage + Auth)
- Fonts: Fraunces (serif headings), Inter (body), Caveat (handwritten accents)
- Deploy: Vercel
- Domain: bakersfresh.in (TBD), demo planned at bakers-fresh.sadique.co

Single repo for both customer site and admin dashboard (admin built later as a separate route, not separate repo as originally planned).

## MCPs connected

- **Stitch** — Baker's Fresh Custom Cakes project (id 13593730068442955443). HTML + screenshots saved at `design-references/stitch-html/` and `design-references/screenshots/`. 5 final screens.
- **Supabase** — connected at project level. Schema migration available at `setup/supabase_migration.sql`.
- **Magic MCP (21st.dev)** — use only for hero animations, success page confetti, testimonial polish. Free tier limited, save for high-impact sections.
- **Context7** — use whenever verifying Next.js 16, Supabase SSR, shadcn, or Tailwind v4 current API.

## Design tokens (already locked in globals.css)

```
Brand pink:        #E91E63 (primary), #FCE4EC (soft), #900038 (deep)
Cream backgrounds: #FFF8F7 (page), #FFF0F1 (card)
Ink text:          #28171A (primary), #5B3F43 (soft), #8F6F73 (subtle)
Accents:           #D4A574 (gold), #A8D8C7 (mint for eggless badge), #FFDCBC (peach)
Border:            #E4BDC2

Fonts:
  --font-serif       Fraunces (h1-h6)
  --font-sans        Inter (body)
  --font-handwritten Caveat (taglines only, sparingly)

Radius:
  --radius-lg   1rem
  --radius-xl   1.5rem
  --radius-2xl  2rem
  --radius-full 9999px
```

Aesthetic: playful modern, warm bakery feel, premium not generic. Mobile-first (375px primary). Generous rounded corners. Soft pink-tinted shadows. Subtle motion only, no flashy 3D or parallax.

## Pages to build (in order)

### 1. Layout — Navbar + Footer + MobileNav

Sticky nav with backdrop blur on scroll. Logo left, nav links center, "Order Custom Cake" pink CTA right. Phone number with call icon (icon only on mobile, full number on desktop). Mobile uses shadcn Sheet for hamburger menu.

Footer: 4-column grid on desktop, stacked on mobile. Columns: Brand (logo + tagline + WhatsApp icon), Quick Links, Outlets (from DB, phones per row), Social. Bottom row: copyright + mandatory `built by sadique.co` link.

### 2. Home `/`

- **Hero** — 2-column desktop, stacked mobile (image first). Left: Caveat tag "fresh from our oven", Fraunces 2-line headline, Inter sub-text, two CTAs (Order Custom Cake primary, View Our Cakes secondary). Right: hero cake image in rounded-3xl frame with floating accent badges. Background: cream with two soft pink gradient blobs.
- **Featured Cakes** — horizontal scroll mobile, 4-col grid desktop. 4-6 cakes from Supabase. "Browse all cakes" CTA.
- **Custom Cake Promo** — full-width, brand-pink-soft bg. Two columns: text + CTA, collage of reference images. Headline: "got a vision? we'll bake it."
- **Why Baker's Fresh** — 3 cards (5,000+ customers / baked fresh daily / pure veg options).
- **Locations Preview** — outlet cards (name, address, click-to-call) from Supabase.
- **Testimonials** — 3 cards with star rating, slight rotate (-1deg, 1deg) for handmade feel.
- **Bottom CTA** — big pink section with 2 buttons.

### 3. Cakes catalog `/cakes`

Page heading + sub. Category tabs (shadcn Tabs): All / Birthday / Anniversary / Wedding / Photo Cake / Designer / Eggless / Pastries. Grid: 2-col mobile, 3-col tablet, 4-col desktop. Server-side fetch from Supabase.

CakeCard component: square aspect ratio image with hover zoom (scale 1.05, 500ms), eggless badge (mint color) if applicable, name (Fraunces 2xl), short description (ink-soft), "starts at ₹650", "Order This Cake" button → `/order?cake=<slug>`.

### 4. Order form `/order`

Most important page. Single-page form (NOT multi-step). Use react-hook-form + zod + react-dropzone. Max-w-2xl centered on desktop, full-width mobile.

Sections (with Fraunces sub-headings):
1. **About the cake** — type (select), size (select), flavor (select), eggless toggle, message on cake (text, max 60 chars)
2. **Inspiration** — reference images dropzone (optional, up to 5 images, 10MB each, jpg/png/webp/heic). Subtitle: "Optional but helpful — share what you have in mind"
3. **Special instructions** — textarea (optional, max 500 chars)
4. **Delivery details** — date (calendar, min +24hrs, max +30 days), time slot (morning 10-12 / afternoon 12-4 / evening 4-8), pickup or delivery (radio), address textarea if delivery
5. **Your details** — name, phone (validated 10-digit Indian mobile), email (optional)

Image upload: dashed pink border zone, cloud upload icon, copy "drop reference images here, or tap to upload". Uploads to Supabase Storage `order-references` bucket with random UUID filename. Show preview thumbnails (3:2) with remove button. Upload progress indicator.

Submit: loading state → POST to `/api/orders` → Supabase insert → redirect to `/order/success/[orderId]`. On error, toast.

### 5. Order success `/order/success/[id]`

Confetti animation on load (Magic MCP for this). Big "thank you!" Fraunces heading. Order ID prominent: "BF-2026-1234". Sub: "we'll call you on [phone] within 2 hours to confirm". Action buttons: "Share on WhatsApp" (deep link with order details pre-filled), "Back to Home". Order summary card showing what they ordered.

### 6. Locations `/locations`

Page heading "visit our outlets". Outlet cards in a responsive grid from Supabase. Each card: name (Fraunces), address, phone (click-to-call), embedded Google Maps iframe, hours. **On site:** Lalpur (main) and Neori only.

- **Lalpur** (main): Bimal Shopping Complex, Lalpur, near Central Bank, opposite Amravati Complex, Ranchi 834001 — +91 99346 27281
- **Neori**: Vikas, Pahan Complex, Neori, Ranchi — +91 70045 02102

### 7. About `/about`

Hero with bakery story (5,000+ customers, two counters on the site, founded year TBD from owner). Photo collage of team and bakery (placeholder for V1). "Our values" section: 3 cards (fresh ingredients, traditional methods, made with love).

### 8. Contact `/contact`

Two columns: contact info (phone, WhatsApp, email, social), simple contact form (name, phone, message). Below: mini outlet list from DB. Bottom: big WhatsApp CTA "chat with us on WhatsApp" (green button).

## Supabase schema

Tables: `categories`, `cakes`, `orders`, `locations`, `testimonials`. RLS: public read for catalog, public insert for orders, authenticated for everything else.

Order status enum: pending → confirmed → preparing → ready → completed. Plus cancelled, rejected.

Order number auto-generated as `BF-YYYY-NNNN` via Postgres trigger.

Storage buckets:
- `order-references` — private, 10MB, jpg/png/webp/heic (customer uploads)
- `cake-images` — public, 5MB, jpg/png/webp (catalog)

Full migration sql is at `setup/supabase_migration.sql`. Apply via Supabase MCP using `apply_migration`. Generate types after with `generate_typescript_types` and save to `src/lib/database.types.ts`.

## Build phases

**Phase 1 — UI with mock data (~1 hour)**
Build all 8 pages using static mock data files in `src/data/`. Order form submits to `console.log` for now. No Supabase calls yet. Goal: complete pretty demo on localhost.

**Phase 2 — Supabase wiring (~30 min)**
Apply migration via Supabase MCP. Generate TypeScript types. Replace mock data imports with Supabase queries. Wire order submit to real insert + image upload. Test order flow end-to-end.

**Phase 3 — Deploy (~15 min)**
Push to GitHub. Connect Vercel. Add env vars. Custom domain or sadique.co subdomain.

## Tone of voice (all copy)

- All lowercase headings and body. ("our cakes" not "Our Cakes")
- Conversational, warm, not salesy
- Indian context: ₹ pricing, WhatsApp CTAs, Hindi-English mix where natural
- Use "we" and "you" liberally
- One exclamation max per page
- No em dashes anywhere — use commas or periods
- Avoid corporate words: "leverage", "solutions", "delight"

## V1 scope guardrails

**In scope:** all 8 pages above, image upload, supabase wiring, mobile-first design, SEO basics, GA4.

**Out of scope (V2 paid upgrade):**
- Razorpay payments
- Customer accounts / login
- Customer order tracking by phone
- WhatsApp Business API auto-notifications
- Email notifications via Resend
- Inventory tracking
- Multi-admin RBAC
- Admin dashboard (build after V1 demo is approved)

## Stop conditions

- Stop iterating on a page when 80% done. Move to next.
- Don't add features mid-build. Write ideas to `V2_IDEAS.md`.
- Stitch is source of truth for design. If output looks different from Stitch, fix it to match Stitch — don't redesign in code.
- Real cake photos and real testimonials come post-demo from owner. Use placehold.co + seeded testimonials for V1.

## Mandatory

- Footer credit on every page: `built by sadique.co` linking to https://sadique.co
- All copy in lowercase
- No em dashes
- Mobile-first, test at 375px width before moving on
- Match Stitch designs as closely as possible