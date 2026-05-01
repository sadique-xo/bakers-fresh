import type { Metadata } from "next";

import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};

function resolveNext(raw: string | undefined) {
  if (typeof raw === "string" && raw.startsWith("/admin") && raw !== "/admin/login") {
    return raw;
  }
  return "/admin/orders";
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const nextTarget = resolveNext(sp.next);

  return (
    <div className="min-h-screen bg-zinc-100 px-4">
      <AdminLoginForm nextTarget={nextTarget} />
    </div>
  );
}
