export const sitePhoneDisplay = "+91 70045 02102";
export const sitePhoneTel = "tel:+917004502102";

export function whatsappNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917004502102";
}

export function siteWhatsappUrl(text?: string): string {
  const base = `https://wa.me/${whatsappNumber()}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
