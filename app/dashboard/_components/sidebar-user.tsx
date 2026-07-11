"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

export function SidebarUser() {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const name = user?.fullName ?? user?.firstName ?? "Your account";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const image = user?.imageUrl;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] px-3 py-2.5 text-left shadow-sm transition hover:bg-[var(--dash-hover)]"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="size-10 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="size-10 shrink-0 rounded-full bg-[var(--dash-panel-soft)]" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--dash-text)]">{isLoaded ? name : " "}</p>
          <p className="truncate text-xs text-[var(--dash-muted)]">{email}</p>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-4 shrink-0 text-[var(--dash-muted)] transition ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full z-20 mt-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-1 shadow-[var(--dash-shadow)]">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              clerk.openUserProfile();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--dash-text)] hover:bg-[var(--dash-hover)]"
          >
            Manage account
          </button>
          <button
            type="button"
            onClick={() => clerk.signOut({ redirectUrl: "/" })}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--dash-danger)] hover:bg-[var(--dash-danger-soft)]"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
