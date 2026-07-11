import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { getSessionUserId } from "@/lib/auth-sync";
import { BrandLogo } from "@/app/_components/brand-logo";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your Invoicery account and start building a branded invoice workspace for your business.",
};

export default async function SignUpPage() {
  if (await getSessionUserId()) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#f5f3ff] to-white px-6 py-12 text-[#1a1a2e]">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo iconSize="sm" />
        </div>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
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
