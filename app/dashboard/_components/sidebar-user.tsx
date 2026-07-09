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
        className="flex w-full items-center gap-3 rounded-2xl border border-[#eef0f2] bg-white px-3 py-2.5 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:bg-[#f9fafb]"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="size-10 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="size-10 shrink-0 rounded-full bg-[#e8eaed]" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#1a1a2e]">{isLoaded ? name : " "}</p>
          <p className="truncate text-xs text-[#9aa0a6]">{email}</p>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-4 shrink-0 text-[#9aa0a6] transition ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full z-20 mt-2 rounded-xl border border-[#eef0f2] bg-white p-1 shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              clerk.openUserProfile();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#1a1a2e] hover:bg-[#f7f7f8]"
          >
            Manage account
          </button>
          <button
            type="button"
            onClick={() => clerk.signOut({ redirectUrl: "/" })}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#a13d3d] hover:bg-[#fdf2f2]"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
