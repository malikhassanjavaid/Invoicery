export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-[#f5f3ff] to-white px-6 text-[#1a1a2e]">
      <div className="w-full max-w-md rounded-2xl border border-[#ece9f9] bg-white p-6 shadow-[0_24px_70px_rgba(124,58,237,0.14)]">
        <div className="h-3 w-28 animate-pulse rounded-full bg-[#ddd6fe]" />
        <div className="mt-6 h-8 w-3/4 animate-pulse rounded-lg bg-[#ede9fe]" />
        <div className="mt-4 space-y-3">
          <div className="h-3 animate-pulse rounded-full bg-[#f1eefb]" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-[#f1eefb]" />
        </div>
      </div>
    </main>
  );
}
