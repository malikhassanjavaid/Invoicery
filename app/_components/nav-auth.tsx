"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const primaryButton =
  "rounded-xl bg-[#7c3aed] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(124,58,237,0.35)] transition hover:bg-[#6d28d9]";

export function NavAuth() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <Link href="/dashboard" className={primaryButton}>
        Go to dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="hidden text-sm font-semibold text-[#6b7280] transition hover:text-[#1a1a2e] sm:inline-flex"
      >
        Sign in
      </Link>
      <Link href="/sign-up" className={primaryButton}>
        Start free
      </Link>
    </>
  );
}
