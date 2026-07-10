export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#f8f7fc] p-6 text-[#1a1a2e]">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-[#ece9f9] bg-white p-4">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-[#ede9fe]" />
          <div className="mt-8 space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-10 animate-pulse rounded-xl bg-[#f1eefb]" />
            ))}
          </div>
        </aside>
        <section className="rounded-2xl border border-[#ece9f9] bg-white p-6">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-[#ede9fe]" />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-2xl bg-[#f1eefb]" />
            ))}
          </div>
          <div className="mt-6 h-72 animate-pulse rounded-2xl bg-[#f1eefb]" />
        </section>
      </div>
    </main>
  );
}
