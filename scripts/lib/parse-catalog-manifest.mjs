/**
 * Shared parser for website_manifest.csv (CRLF-safe).
 */
import { readFileSync } from "node:fs";

export const MANIFEST_CATEGORY_TO_DB = {
  birthday: "birthday",
  anniversary: "anniversary",
  wedding: "wedding",
  "photo-print": "photo-cake",
  "kids-theme": "kids",
  others: "designer",
  pastries: "pastries",
  cupcakes: "pastries",
};

export function basePriceInr(manifestCategory) {
  switch (manifestCategory) {
    case "wedding":
      return 2499;
    case "others":
      return 1299;
    case "photo-print":
      return 899;
    case "kids-theme":
      return 899;
    case "anniversary":
      return 999;
    case "pastries":
    case "cupcakes":
      return 189;
    default:
      return 699;
  }
}

export function parseCatalogManifest(csvPath) {
  const raw = readFileSync(csvPath, "utf8");
  const lines = raw
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(1);

  const rows = [];
  for (const line of lines) {
    const m = line.match(/^([^,]+),([^,]+),(.*)$/);
    if (!m) continue;
    const filename = m[1].trim();
    const category = m[2].trim();
    const description = m[3].trim();
    if (!filename || filename === "filename" || !category) continue;
    const dbCat = MANIFEST_CATEGORY_TO_DB[category];
    if (!dbCat) {
      console.warn("unknown category", category, filename);
      continue;
    }
    const slug = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "").toLowerCase();
    const name = (description || slug.replace(/-/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    rows.push({
      filename,
      slug,
      name,
      dbCat,
      manifestCategory: category,
      price: basePriceInr(category),
    });
  }
  return rows;
}
