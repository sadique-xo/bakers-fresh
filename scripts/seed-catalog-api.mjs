/**
 * Ensures categories exist, replaces all rows in `cakes` with manifest data
 * (service role). Run before or after storage upload; re-run
 * `upload:catalog-storage` to set `image_url` to public Supabase URLs.
 *
 * Requires .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { parseCatalogManifest } from "./lib/parse-catalog-manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const manifestPath = join(
  root,
  "public/instagram_imported_bakers_fresh/website_manifest.csv"
);

const dryRun = process.argv.includes("--dry-run");

function loadEnvLocal() {
  const p = join(root, ".env.local");
  if (!existsSync(p)) {
    console.error("missing .env.local");
    process.exit(1);
  }
  const text = readFileSync(p, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const CATEGORY_SEED = [
  {
    slug: "birthday",
    name: "Birthday Cakes",
    description: "Make every birthday memorable",
    display_order: 1,
  },
  {
    slug: "anniversary",
    name: "Anniversary Cakes",
    description: "Celebrate love with sweet moments",
    display_order: 2,
  },
  {
    slug: "wedding",
    name: "Wedding Cakes",
    description: "Premium tiered cakes for your big day",
    display_order: 3,
  },
  {
    slug: "photo-cake",
    name: "Photo Cakes",
    description: "Edible photos printed on cream",
    display_order: 4,
  },
  {
    slug: "designer",
    name: "Designer & Custom",
    description: "Bring your wildest cake ideas to life",
    display_order: 5,
  },
  {
    slug: "kids",
    name: "Kids Cakes",
    description: "Cartoon characters and fun themes",
    display_order: 6,
  },
  {
    slug: "eggless",
    name: "Eggless Cakes",
    description: "Pure vegetarian, equally delicious",
    display_order: 7,
  },
  {
    slug: "pastries",
    name: "Pastries",
    description: "Single-serve treats, freshly made daily",
    display_order: 8,
  },
];

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const manifestRows = parseCatalogManifest(manifestPath);
console.log(`manifest cakes: ${manifestRows.length}${dryRun ? " (dry run)" : ""}`);

if (dryRun) {
  for (const r of manifestRows.slice(0, 5)) {
    console.log(`  ${r.slug} → ${r.dbCat} (${r.price} INR)`);
  }
  if (manifestRows.length > 5) console.log("  ...");
  process.exit(0);
}

const { error: catErr } = await supabase
  .from("categories")
  .upsert(CATEGORY_SEED, { onConflict: "slug" });

if (catErr) {
  console.error("categories upsert:", catErr.message);
  process.exit(1);
}

const { data: cats, error: selCatErr } = await supabase
  .from("categories")
  .select("id, slug");

if (selCatErr || !cats?.length) {
  console.error("categories select:", selCatErr?.message ?? "empty");
  process.exit(1);
}

const categoryIdBySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

const cakeRows = manifestRows.map((r, i) => {
  const category_id = categoryIdBySlug[r.dbCat];
  if (!category_id) {
    console.error("missing category in DB for slug mapping:", r.dbCat);
    process.exit(1);
  }
  return {
    slug: r.slug,
    category_id,
    name: r.name,
    description: `from our kitchen. ${r.name}. order a custom version in your flavour and size.`,
    image_url: `/instagram_imported_bakers_fresh/${r.filename}`,
    base_price_inr: r.price,
    flavors: ["chocolate", "vanilla", "custom"],
    sizes_available: ["0.5kg", "1kg", "1.5kg", "2kg"],
    is_eggless: false,
    is_featured: i < 8,
    display_order: i + 1,
  };
});

const { error: delErr } = await supabase.from("cakes").delete().neq("slug", "");

if (delErr) {
  console.error("cakes delete:", delErr.message);
  process.exit(1);
}

const { error: insErr } = await supabase.from("cakes").insert(cakeRows);

if (insErr) {
  console.error("cakes insert:", insErr.message);
  process.exit(1);
}

console.log(`inserted ${cakeRows.length} cakes. run npm run upload:catalog-storage to set storage URLs on image_url.`);
