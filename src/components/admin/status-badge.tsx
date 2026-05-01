import { cn } from "@/lib/utils";
import type { Database } from "@/lib/database.types";

type Status = Database["public"]["Enums"]["order_status"];

const styles: Record<Status, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-800",
};

function label(status: Status) {
  const map: Record<Status, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled",
    rejected: "Rejected",
  };
  return map[status];
}

export function StatusBadge({
  status,
  className,
}: {
  status: Status | null | undefined;
  className?: string;
}) {
  const s = status ?? "pending";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        styles[s],
        className,
      )}
    >
      {label(s)}
    </span>
  );
}
