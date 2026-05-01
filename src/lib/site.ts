export const sitePhoneDisplay = "+91 70045 02102";
export const sitePhoneTel = "tel:+917004502102";

const lalpurEnv = process.env.NEXT_PUBLIC_PHONE_LALPUR_DISPLAY?.trim();

/** Lalpur outlet line (see claude_files/CONTENT.md); overridable via env. */
export const sitePhoneLalpurDisplay =
  lalpurEnv && lalpurEnv.length > 0 ? lalpurEnv : "+91 99346 27281";

export function sitePhoneLalpurTel(): string {
  const d = sitePhoneLalpurDisplay.replace(/\D/g, "");
  return `tel:+${d}`;
}

export function formatIndiaPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  let n: string;
  if (d.length === 10) n = d;
  else if (d.startsWith("91") && d.length >= 12) n = d.slice(-10);
  else return raw.trim() || raw;
  return `+91 ${n.slice(0, 5)} ${n.slice(5)}`;
}

export function whatsappNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917004502102";
}

export function siteWhatsappUrl(text?: string): string {
  const base = `https://wa.me/${whatsappNumber()}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
