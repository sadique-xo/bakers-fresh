/**
 * Upload local catalog images to Supabase Storage (`cake-images`) and
 * set `cakes.image_url` to each file's public URL.
 *
 * Requires `.env.local` with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 *
 * Usage:
 *   node scripts/upload-catalog-to-supabase.mjs           # run uploads + DB updates
 *   node scripts/upload-catalog-to-supabase.mjs --dry-run  # print plan only
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { parseCatalogManifest } from "./lib/parse-catalog-manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const MANIFEST = join(root, "public/instagram_imported_bakers_fresh/website_manifest.csv");
const IMAGES_DIR = join(root, "public/instagram_imported_bakers_fresh");
const BUCKET = "cake-images";

const dryRun = process.argv.includes("--dry-run");

function loadEnvLocal() {
  const p = join(root, ".env.local");
  if (!existsSync(p)) {
    console.error("missing .env.local (copy from claude_files/env.local.template)");
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

function mimeForFile(filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const rows = parseCatalogManifest(MANIFEST);
console.log(`manifest rows: ${rows.length}${dryRun ? " (dry run)" : ""}`);

let uploaded = 0;
let updated = 0;
let skipped = 0;
const errors = [];

for (const { filename, slug } of rows) {
  const localPath = join(IMAGES_DIR, filename);
  if (!existsSync(localPath)) {
    skipped++;
    errors.push(`missing file: ${filename}`);
    continue;
  }

  const storagePath = `catalog/${filename}`;

  if (dryRun) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    console.log(`  ${slug} -> ${data.publicUrl}`);
    continue;
  }

  const body = readFileSync(localPath);
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(storagePath, body, {
    upsert: true,
    contentType: mimeForFile(filename),
    cacheControl: "31536000",
  });

  if (upErr) {
    errors.push(`upload ${filename}: ${upErr.message}`);
    continue;
  }

  uploaded++;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const publicUrl = pub.publicUrl;

  const { data: cakeRows, error: selErr } = await supabase
    .from("cakes")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (selErr) {
    errors.push(`select ${slug}: ${selErr.message}`);
    continue;
  }

  if (!cakeRows) {
    errors.push(`no cake row for slug ${slug} (seed DB first or check slug)`);
    continue;
  }

  const { error: updErr } = await supabase
    .from("cakes")
    .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (updErr) {
    errors.push(`update ${slug}: ${updErr.message}`);
    continue;
  }

  updated++;
  console.log(`ok ${slug}`);
}

console.log("\n--- summary ---");
console.log(`uploaded files: ${uploaded}`);
console.log(`cakes updated:  ${updated}`);
console.log(`skipped (missing file): ${skipped}`);
if (errors.length) {
  console.log(`issues (${errors.length}):`);
  for (const e of errors.slice(0, 30)) console.log(`  - ${e}`);
  if (errors.length > 30) console.log(`  ... and ${errors.length - 30} more`);
  process.exitCode = 1;
}
