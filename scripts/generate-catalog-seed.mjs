/**
 * Reads public/instagram_imported_bakers_fresh/website_manifest.csv
 * and writes setup/seed_catalog_from_manifest.sql
 *
 * Run: node scripts/generate-catalog-seed.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { parseCatalogManifest } from "./lib/parse-catalog-manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const csvPath = join(root, "public/instagram_imported_bakers_fresh/website_manifest.csv");
const outPath = join(root, "setup/seed_catalog_from_manifest.sql");

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

const rows = parseCatalogManifest(csvPath);

let order = 1;
const inserts = rows.map((r) => {
  const imageUrl = `/instagram_imported_bakers_fresh/${r.filename}`;
  const featured = order <= 8;
  const sql = `  (
    '${escapeSql(r.slug)}',
    (SELECT id FROM categories WHERE slug = '${r.dbCat}'),
    '${escapeSql(r.name)}',
    '${escapeSql(`from our kitchen. ${r.name}. order a custom version in your flavour and size.`)}',
    '${escapeSql(imageUrl)}',
    ${r.price},
    ARRAY['chocolate','vanilla','custom'],
    ARRAY['0.5kg','1kg','1.5kg','2kg'],
    false,
    ${featured},
    ${order++}
  )`;
  return sql;
});

const preamble = `-- ============================================================================
-- Baker's Fresh — catalog seed from website_manifest.csv
-- Ensures categories exist, replaces all cakes, uses local public paths for
-- image_url until you run: npm run upload:catalog-storage
-- ============================================================================

BEGIN;

INSERT INTO categories (slug, name, description, display_order) VALUES
  ('birthday', 'Birthday Cakes', 'Make every birthday memorable', 1),
  ('anniversary', 'Anniversary Cakes', 'Celebrate love with sweet moments', 2),
  ('wedding', 'Wedding Cakes', 'Premium tiered cakes for your big day', 3),
  ('photo-cake', 'Photo Cakes', 'Edible photos printed on cream', 4),
  ('designer', 'Designer & Custom', 'Bring your wildest cake ideas to life', 5),
  ('kids', 'Kids Cakes', 'Cartoon characters and fun themes', 6),
  ('eggless', 'Eggless Cakes', 'Pure vegetarian, equally delicious', 7),
  ('pastries', 'Pastries', 'Single-serve treats, freshly made daily', 8)
ON CONFLICT (slug) DO NOTHING;

DELETE FROM cakes;

INSERT INTO cakes (slug, category_id, name, description, image_url, base_price_inr, flavors, sizes_available, is_eggless, is_featured, display_order) VALUES
`;

const footer = `;

COMMIT;
`;

writeFileSync(outPath, preamble + inserts.join(",\n") + footer, "utf8");
console.log("wrote", outPath, "rows:", rows.length);
