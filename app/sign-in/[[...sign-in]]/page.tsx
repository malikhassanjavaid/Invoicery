import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#f5f3ff] to-white px-6 py-12 text-[#1a1a2e]">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Image src="/logo.png" alt="Invoicery logo" width={34} height={34} className="object-contain" />
          <span className="text-2xl font-extrabold italic tracking-tight">Invoicery</span>
        </Link>
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
