import { SignUp } from "@clerk/nextjs";
import { getSessionUserId } from "@/lib/auth-sync";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  if (await getSessionUserId()) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#f5f3ff] to-white px-6 py-12 text-[#1a1a2e]">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Image src="/logo.png" alt="Invoicery logo" width={34} height={34} className="object-contain" />
          <span className="text-2xl font-extrabold italic tracking-tight">Invoicery</span>
        </Link>
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
