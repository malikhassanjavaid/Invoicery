import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8f4] px-6 py-12 text-[#17201b]">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3 font-semibold">
          <span className="grid size-10 place-items-center rounded-lg bg-[#1f6f56] text-sm font-bold text-white">
            IV
          </span>
          <span className="text-xl">Invoicery</span>
        </Link>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </main>
  );
}
