import Image from "next/image";
import Link from "next/link";
import { getSessionUserId } from "@/lib/auth-sync";
import { LandingThemeProvider, ThemeToggle } from "./_components/landing-theme";

export const dynamic = "force-dynamic";

const navItems = ["Features", "Workflow", "Pricing", "FAQ"];

const stats = [
  { value: "$1.8M", label: "dummy invoices tracked" },
  { value: "4.9/5", label: "sample customer rating" },
  { value: "12 hrs", label: "average follow-up time saved" },
];

const features = [
  {
    title: "Smart invoice builder",
    description:
      "Create polished invoices with saved clients, tax presets, and branded payment terms.",
    icon: (
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6 M16 13H8M16 17H8M10 9H8" />
    ),
  },
  {
    title: "Payment follow-ups",
    description:
      "Automated reminder drafts keep overdue invoices visible without awkward manual chasing.",
    icon: (
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    ),
  },
  {
    title: "Live cash view",
    description:
      "See paid, pending, and overdue totals from one clean dashboard built for quick scanning.",
    icon: <path d="M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3" />,
  },
];

const workflow = [
  { step: "Create", detail: "Build a branded invoice in seconds." },
  { step: "Send", detail: "Share a link or email it to the client." },
  { step: "Track", detail: "Watch status move from sent to paid." },
  { step: "Get paid", detail: "Log payments and keep cash flowing." },
];

function Logo({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="Invoicery logo"
      width={size}
      height={size}
      priority
      className="object-contain"
    />
  );
}

export default async function Home() {
  const isSignedIn = Boolean(await getSessionUserId());
  const appHref = isSignedIn ? "/dashboard" : "/sign-up";
  const appLabel = isSignedIn ? "Go to dashboard" : "Create first invoice";
  const footerActionLabel = isSignedIn ? "Dashboard" : "Sign up";

  return (
    <LandingThemeProvider>
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--text)] transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--page-bg)]/85 backdrop-blur transition-colors duration-300">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={34} />
            <span className="text-xl font-extrabold italic tracking-tight">Invoicery</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-[var(--text-muted)] md:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-[var(--text)]">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-[var(--dark-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--dark-text)] shadow-[var(--shadow-button)] transition hover:bg-[var(--dark-surface-hover)]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)] sm:inline-flex"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-xl bg-[var(--dark-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--dark-text)] shadow-[var(--shadow-button)] transition hover:bg-[var(--dark-surface-hover)]"
                >
                  Start free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[calc(100dvh-68px)] items-center overflow-hidden bg-gradient-to-b from-[var(--hero-from)] via-[var(--hero-via)] to-[var(--hero-to)] transition-colors duration-300">
        <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-[var(--glow-one)]/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-32 size-80 rounded-full bg-[var(--glow-two)]/80 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent)] px-3.5 py-1.5 text-sm font-semibold text-[#3a363a]">
              <span className="size-1.5 rounded-full bg-[var(--text)]" />
              Simple invoicing for modern service teams
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-[var(--text)] sm:text-5xl">
              Send invoices, track payments, and keep{" "}
              <span className="text-[var(--accent-strong)]">cash flow moving.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
              A clean invoicing workspace for freelancers and growing teams — fast invoice
              creation, client records, payment tracking, and gentle reminders in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={appHref}
                className="rounded-xl bg-[var(--dark-surface)] px-6 py-3.5 text-center font-semibold text-[var(--dark-text)] shadow-[var(--shadow-button)] transition hover:bg-[var(--dark-surface-hover)]"
              >
                {appLabel}
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-center font-semibold text-[var(--text)] transition hover:border-[var(--accent-border)] hover:bg-[var(--surface-soft)]"
              >
                View features
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-[var(--accent)] text-[#262326]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                No credit card
              </span>
              <span className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-[var(--accent)] text-[#262326]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                Free to start
              </span>
            </div>
          </div>

          {/* Invoice mockup */}
          <div className="relative">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-hero)]">
              <div className="rounded-xl border border-[var(--surface-muted)] bg-[var(--surface-soft)] p-5">
                <div className="flex items-start justify-between gap-6 border-b border-[var(--border)] pb-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-[var(--surface)] ring-1 ring-[var(--border)]">
                      <Logo size={26} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-muted)]">Invoice #INV-1042</p>
                      <h2 className="mt-0.5 text-xl font-bold">Acme Studio Retainer</h2>
                    </div>
                  </div>
                  <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[#3a363a]">
                    Paid
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    ["Brand strategy sprint", "$2,400"],
                    ["Landing page design", "$1,800"],
                    ["Payment processing", "$120"],
                  ].map(([name, price]) => (
                    <div key={name} className="flex items-center justify-between rounded-lg bg-[var(--surface)] px-4 py-3 ring-1 ring-[var(--surface-muted)]">
                      <span className="text-sm font-medium text-[var(--text-soft)]">{name}</span>
                      <span className="font-semibold">{price}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl bg-[var(--dark-surface)] p-5 text-[var(--dark-text)]">
                  <p className="text-sm text-[var(--accent)]">Total due</p>
                  <div className="mt-2 flex items-end justify-between">
                    <strong className="text-4xl font-extrabold">$4,320</strong>
                    <span className="text-sm text-[var(--dark-muted)]">Due Jul 28</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold text-[var(--accent-strong)]">{stat.value}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Features</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your invoice workflow needs.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent-border)] hover:shadow-[var(--shadow-card)]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-[var(--accent)] text-[#262326]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                  {feature.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-[var(--text-muted)]">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="bg-[var(--dark-surface)] px-6 py-20 text-[var(--dark-text)]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Workflow</p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
                From draft invoice to paid receipt in four steps.
              </h2>
            </div>
            <p className="max-w-md leading-7 text-[var(--dark-muted)]">
              A simple flow that helps teams spend less time organizing billing and more time
              on billable work.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((item, index) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-[var(--accent)] text-sm font-bold text-[#262326]">
                  {index + 1}
                </span>
                <p className="mt-5 text-lg font-semibold">{item.step}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--dark-muted)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">One simple plan</h2>
            <p className="mt-4 leading-7 text-[var(--text-muted)]">
              Start with the core invoice workspace — clients, invoices, branding, and payment
              tracking, all included.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--surface-soft)] p-6 ring-1 ring-[var(--accent-border)]">
            <p className="text-sm font-semibold text-[var(--accent-strong)]">Starter</p>
            <div className="mt-3 flex items-end gap-2">
              <strong className="text-5xl font-extrabold">$12</strong>
              <span className="pb-2 text-[var(--text-muted)]">per seat / month</span>
            </div>
            <ul className="mt-6 grid gap-3 text-sm text-[var(--text-soft)] sm:grid-cols-2">
              {["Unlimited invoices", "Client profiles", "Payment reminders", "Branded invoices"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="grid size-4 place-items-center rounded-full bg-[var(--dark-surface)] text-[var(--dark-text)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="size-2.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={appHref}
              className="mt-6 inline-flex rounded-xl bg-[var(--dark-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--dark-text)] transition hover:bg-[var(--dark-surface-hover)]"
            >
              {isSignedIn ? "Open dashboard" : "Get started"}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="faq" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--dark-surface)] to-[var(--dark-surface-hover)] px-6 py-14 text-center text-[var(--dark-text)]">
          <div className="pointer-events-none absolute -right-10 -top-10 size-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to send your first invoice?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl leading-7 text-[var(--dark-soft)]">
            Set up your company profile, add a client, and create a branded invoice in minutes.
          </p>
          <Link
            href={appHref}
            className="relative mt-8 inline-flex rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-[#262326] shadow-lg transition hover:bg-[var(--accent-hover)]"
          >
            {isSignedIn ? "Open dashboard" : "Start free"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--page-bg)]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2.5">
                <Logo size={30} />
                <span className="text-lg font-extrabold italic tracking-tight">Invoicery</span>
              </Link>
              <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
                A clean, simple invoicing workspace for freelancers and growing teams.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Product</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                  <li><a href="#features" className="hover:text-[var(--accent-strong)]">Features</a></li>
                  <li><a href="#workflow" className="hover:text-[var(--accent-strong)]">Workflow</a></li>
                  <li><a href="#pricing" className="hover:text-[var(--accent-strong)]">Pricing</a></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Company</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                  <li><a href="#" className="hover:text-[var(--accent-strong)]">About</a></li>
                  <li><a href="#" className="hover:text-[var(--accent-strong)]">Blog</a></li>
                  <li><a href="#" className="hover:text-[var(--accent-strong)]">Contact</a></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Get started</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                  {!isSignedIn && <li><Link href="/sign-in" className="hover:text-[var(--accent-strong)]">Sign in</Link></li>}
                  <li><Link href={appHref} className="hover:text-[var(--accent-strong)]">{footerActionLabel}</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Invoicery. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-[var(--accent-strong)]">Privacy</a>
              <a href="#" className="hover:text-[var(--accent-strong)]">Terms</a>
              <a href="#" className="hover:text-[var(--accent-strong)]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
    </LandingThemeProvider>
  );
}
