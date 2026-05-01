"use client";

import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";

import { OrderRowStatusSelect } from "@/components/admin/order-row-status-select";

import type { Tables } from "@/lib/database.types";

type OrderRow = Tables<"orders">;

type Props = {
  orders: OrderRow[];
  pagination: {
    page: number;
    pageCount: number;
    total: number;
    searchParams: Record<string, string>;
  };
};

function buildHref(sp: Record<string, string>, page: number) {
  const u = new URLSearchParams({ ...sp, page: String(page) });
  return `/admin/orders?${u.toString()}`;
}

export function AdminOrdersTable({ orders, pagination }: Props) {
  const columns = useMemo<ColumnDef<OrderRow>[]>(
    () => [
      {
        accessorKey: "order_number",
        header: "Order",
        cell: ({ row }) => (
          <Link
            href={`/admin/orders/${row.original.id}`}
            className="font-mono font-semibold text-zinc-900 hover:underline"
          >
            {row.original.order_number}
          </Link>
        ),
      },
      {
        accessorKey: "customer_name",
        header: "Customer",
        cell: ({ row }) => (
          <div className="max-w-[11rem]">
            <span className="font-medium">{row.original.customer_name}</span>
          </div>
        ),
      },
      {
        accessorKey: "customer_phone",
        header: "Phone",
        cell: ({ row }) => (
          <a
            href={`tel:${row.original.customer_phone.replace(/\s/g, "")}`}
            className="tabular-nums text-blue-700 hover:underline"
          >
            {row.original.customer_phone}
          </a>
        ),
      },
      {
        id: "cake",
        header: "Cake",
        cell: ({ row }) => (
          <span className="text-zinc-600">
            {[row.original.cake_type, row.original.cake_size].filter(Boolean).join(" · ") ||
              "—"}
          </span>
        ),
      },
      {
        accessorKey: "delivery_date",
        header: "Delivery",
        cell: ({ row }) => (
          <span className="whitespace-nowrap tabular-nums text-zinc-600">
            {row.original.delivery_date}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <OrderRowStatusSelect order={row.original} />,
      },
      {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) =>
          row.original.created_at ? (
            <span className="text-zinc-500" suppressHydrationWarning>
              {formatDistanceToNowStrict(new Date(row.original.created_at))} ago
            </span>
          ) : (
            "—"
          ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link
            href={`/admin/orders/${row.original.id}`}
            className="rounded-lg bg-white px-2 py-1 text-[13px] font-semibold shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50"
          >
            View
          </Link>
        ),
      },
    ],
    [],
  );

  /* eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table stable for static column defs */
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.pageCount,
  });

  const { page: currentPage, pageCount, total, searchParams: sp } = pagination;

  if (orders.length === 0 && currentPage <= 1) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">
        No orders match these filters yet.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-100 hover:bg-zinc-50/80">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle text-zinc-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          {total === 0
            ? "No rows"
            : `Showing ${(currentPage - 1) * 20 + 1}–${Math.min(currentPage * 20, total)} of ${total}`}
        </p>
        {pageCount > 1 ? (
          <nav className="flex flex-wrap items-center gap-2" aria-label="Pagination">
            <Link
              href={buildHref(sp, Math.max(1, currentPage - 1))}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                currentPage <= 1
                  ? "pointer-events-none opacity-40"
                  : "bg-white shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50"
              }`}
              aria-disabled={currentPage <= 1}
            >
              Previous
            </Link>
            <span className="text-sm text-zinc-600">
              Page {currentPage} of {pageCount}
            </span>
            <Link
              href={buildHref(sp, Math.min(pageCount, currentPage + 1))}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                currentPage >= pageCount
                  ? "pointer-events-none opacity-40"
                  : "bg-white shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50"
              }`}
              aria-disabled={currentPage >= pageCount}
            >
              Next
            </Link>
          </nav>
        ) : null}
      </div>
    </>
  );
}
