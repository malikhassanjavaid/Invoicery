import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { getSessionUserId } from "@/lib/auth-sync";
import { BrandLogo } from "@/app/_components/brand-logo";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Invoicery to manage clients, company details, invoices, and payment status.",
};

export default async function SignInPage() {
  if (await getSessionUserId()) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#f5f3ff] to-white px-6 py-12 text-[#1a1a2e]">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo iconSize="sm" />
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#7c3aed",
              borderRadius: "0.75rem",
            },
          }}
        />
      </div>
    </main>
  );
}
