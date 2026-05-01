"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = { urls: string[] };

export function ReferenceGallery({ urls }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<string | null>(null);

  if (urls.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
        No reference images were uploaded with this order.
      </div>
    );
  }

  function open(u: string) {
    setActive(u);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
    setActive(null);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {urls.map((u, i) => (
          <button
            key={u}
            type="button"
            onClick={() => open(u)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
          >
            <Image
              src={u}
              alt={`Customer reference photo ${i + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="180px"
              unoptimized
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="w-[min(96vw,800px)] max-h-[92vh] overflow-hidden rounded-xl border-none p-0 shadow-xl backdrop:bg-black/70"
        onClose={() => setActive(null)}
        onClick={(ev) => {
          if (ev.target === dialogRef.current) close();
        }}
      >
        {active ? (
          <div className="relative flex max-h-[92vh] flex-col bg-black">
            <button
              type="button"
              className="absolute top-3 right-3 z-10 rounded-lg bg-black/55 px-3 py-1.5 text-xs font-semibold text-white"
              onClick={close}
            >
              Close
            </button>
            <div className="relative min-h-[200px] w-full flex-1 bg-black">
              <Image
                src={active}
                alt="Expanded reference cake image"
                width={1200}
                height={1200}
                className="h-auto max-h-[88vh] w-full object-contain"
                unoptimized
              />
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
