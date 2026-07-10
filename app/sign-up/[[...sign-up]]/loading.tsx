export default function SignUpLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#f5f3ff] to-white px-6 py-12 text-[#1a1a2e]">
      <div className="w-full max-w-md">
        <div className="mx-auto h-10 w-40 animate-pulse rounded-lg bg-[#ddd6fe]" />
        <div className="mt-8 rounded-2xl border border-[#ece9f9] bg-white p-6 shadow-[0_24px_70px_rgba(124,58,237,0.14)]">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-[#ede9fe]" />
          <div className="mt-6 space-y-4">
            <div className="h-12 animate-pulse rounded-xl bg-[#f1eefb]" />
            <div className="h-12 animate-pulse rounded-xl bg-[#f1eefb]" />
            <div className="h-12 animate-pulse rounded-xl bg-[#f1eefb]" />
            <div className="h-12 animate-pulse rounded-xl bg-[#ddd6fe]" />
          </div>
        </div>
      </div>
    </main>
  );
}
