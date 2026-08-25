export function LoadingSpinner({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className + " animate-spin"}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.22" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PageLoader({ label = "Preparing your workspace" }: { label?: string }) {
  return (
    <main
      className="grid min-h-screen place-items-center bg-[var(--dash-bg,#f7f9fc)] px-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center text-center">
        <span
          className="size-11 animate-spin rounded-full border-[3px] border-[var(--dash-panel-soft,#dbe5f3)] border-t-[#0457ff] motion-reduce:animate-none"
          aria-hidden="true"
        />
        <p className="mt-4 text-sm font-medium text-[var(--dash-subtle,#667085)]">{label}</p>
        <span className="sr-only">Loading</span>
      </div>
    </main>
  );
}

export function DashboardLoader({ label = "Loading your data" }: { label?: string }) {
  return (
    <main className="min-h-screen bg-[var(--dash-bg)] p-4 text-[var(--dash-text)] sm:p-6" aria-live="polite" aria-busy="true">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-sidebar)] p-5">
          <div className="h-10 w-36 animate-pulse rounded-xl bg-[var(--dash-panel-soft)]" />
          <div className="mt-8 space-y-3">
            {[72, 88, 80, 94].map((width) => (
              <div key={width} className="flex h-11 items-center gap-3 rounded-xl px-3">
                <span className="size-5 animate-pulse rounded-md bg-[var(--dash-panel-soft)]" />
                <span className="h-3 animate-pulse rounded-full bg-[var(--dash-panel-soft)]" style={{ width: width + "px" }} />
              </div>
            ))}
          </div>
        </aside>
        <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div><div className="h-3 w-28 animate-pulse rounded-full bg-[var(--dash-panel-soft)]" /><div className="mt-3 h-8 w-52 animate-pulse rounded-lg bg-[var(--dash-panel-soft)]" /></div>
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--dash-muted)]"><LoadingSpinner className="size-4" /><span>{label}</span></div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-[var(--dash-panel-soft)]" />)}</div>
          <div className="mt-6 h-80 animate-pulse rounded-2xl bg-[var(--dash-panel-soft)]" />
        </section>
      </div>
      <span className="sr-only">Loading</span>
    </main>
  );
}
