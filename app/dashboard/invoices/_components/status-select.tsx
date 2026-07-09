"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { updateInvoiceStatus } from "../../actions";

const STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];

const styles: Record<string, { badge: string; dot: string }> = {
  PAID: { badge: "bg-[#e7f5ec] text-[#1f8a5b]", dot: "bg-[#1f8a5b]" },
  SENT: { badge: "bg-[#eef0ff] text-[#4f46e5]", dot: "bg-[#4f46e5]" },
  OVERDUE: { badge: "bg-[#fdeef0] text-[#d9475b]", dot: "bg-[#d9475b]" },
  DRAFT: { badge: "bg-[#f1f2f4] text-[#6b7280]", dot: "bg-[#9aa0a6]" },
  CANCELLED: { badge: "bg-[#f1f2f4] text-[#6b7280]", dot: "bg-[#9aa0a6]" },
};

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function choose(next: string) {
    setOpen(false);
    if (next === value) return;
    setValue(next);
    const formData = new FormData();
    formData.set("id", id);
    formData.set("status", next);
    startTransition(() => updateInvoiceStatus(formData));
  }

  const current = styles[value] ?? styles.DRAFT;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:opacity-60 ${current.badge}`}
      >
        <span className={`size-1.5 rounded-full ${current.dot}`} />
        {value}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3 opacity-60">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-30 mt-1.5 w-40 rounded-xl border border-[#eef0f2] bg-white p-1 shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
          {STATUSES.map((option) => {
            const optionStyle = styles[option];
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium hover:bg-[#f7f7f8]"
              >
                <span className={`size-1.5 rounded-full ${optionStyle.dot}`} />
                <span className="text-[#1a1a2e]">{option}</span>
                {option === value ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="ml-auto size-3.5 text-[#1a1a2e]">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
