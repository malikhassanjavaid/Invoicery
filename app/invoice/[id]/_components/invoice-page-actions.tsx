"use client";

import { useEffect } from "react";

export function InvoicePageActions({ autoPrint }: { autoPrint: boolean }) {
  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  return (
    <div className="mx-auto mb-4 flex w-full max-w-2xl items-center justify-end gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-xl bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a2a42]"
      >
        Download PDF
      </button>
    </div>
  );
}
