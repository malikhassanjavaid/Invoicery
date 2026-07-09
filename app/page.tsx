import Image from "next/image";
import Link from "next/link";
import { NavAuth } from "./_components/nav-auth";

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

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#1a1a2e]">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-[#ece9f9] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={34} />
            <span className="text-xl font-extrabold italic tracking-tight">Invoicery</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#6b7280] md:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-[#6d28d9]">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <NavAuth />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[calc(100dvh-68px)] items-center overflow-hidden bg-gradient-to-b from-[#f5f3ff] to-white">
        <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-[#c4b5fd]/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-32 size-80 rounded-full bg-[#ddd6fe]/50 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e5e0f7] bg-[#ede9fe] px-3.5 py-1.5 text-sm font-semibold text-[#6d28d9]">
              <span className="size-1.5 rounded-full bg-[#7c3aed]" />
              Simple invoicing for modern service teams
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-[#1a1a2e] sm:text-5xl">
              Send invoices, track payments, and keep{" "}
              <span className="text-[#7c3aed]">cash flow moving.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#6b7280] sm:text-lg">
              A clean invoicing workspace for freelancers and growing teams — fast invoice
              creation, client records, payment tracking, and gentle reminders in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="rounded-xl bg-[#7c3aed] px-6 py-3.5 text-center font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.35)] transition hover:bg-[#6d28d9]"
              >
                Create first invoice
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-[#e5e0f7] bg-white px-6 py-3.5 text-center font-semibold text-[#1a1a2e] transition hover:border-[#c4b5fd] hover:bg-[#faf9ff]"
              >
                View features
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-[#6b7280]">
              <span className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-[#ede9fe] text-[#6d28d9]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                No credit card
              </span>
              <span className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-[#ede9fe] text-[#6d28d9]">
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
            <div className="rounded-2xl border border-[#ece9f9] bg-white p-5 shadow-[0_30px_80px_rgba(124,58,237,0.18)]">
              <div className="rounded-xl border border-[#f1eefb] bg-[#faf9ff] p-5">
                <div className="flex items-start justify-between gap-6 border-b border-[#ece9f9] pb-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-white ring-1 ring-[#ece9f9]">
                      <Logo size={26} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#6b7280]">Invoice #INV-1042</p>
                      <h2 className="mt-0.5 text-xl font-bold">Acme Studio Retainer</h2>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#ede9fe] px-3 py-1 text-xs font-semibold text-[#6d28d9]">
                    Paid
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    ["Brand strategy sprint", "$2,400"],
                    ["Landing page design", "$1,800"],
                    ["Payment processing", "$120"],
                  ].map(([name, price]) => (
                    <div key={name} className="flex items-center justify-between rounded-lg bg-white px-4 py-3 ring-1 ring-[#f1eefb]">
                      <span className="text-sm font-medium text-[#52506b]">{name}</span>
                      <span className="font-semibold">{price}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl bg-[#1e1b2e] p-5 text-white">
                  <p className="text-sm text-[#c4b5fd]">Total due</p>
                  <div className="mt-2 flex items-end justify-between">
                    <strong className="text-4xl font-extrabold">$4,320</strong>
                    <span className="text-sm text-[#c8c2e0]">Due Jul 28</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#ece9f9] bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold text-[#7c3aed]">{stat.value}</p>
              <p className="mt-1 text-sm text-[#6b7280]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c3aed]">Features</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your invoice workflow needs.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-[#ece9f9] bg-white p-6 transition hover:border-[#c4b5fd] hover:shadow-[0_16px_40px_rgba(124,58,237,0.1)]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-[#ede9fe] text-[#6d28d9]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                  {feature.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-[#6b7280]">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="bg-[#1e1b2e] px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c4b5fd]">Workflow</p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
                From draft invoice to paid receipt in four steps.
              </h2>
            </div>
            <p className="max-w-md leading-7 text-[#c8c2e0]">
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
                <span className="grid size-9 place-items-center rounded-lg bg-[#7c3aed] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-5 text-lg font-semibold">{item.step}</p>
                <p className="mt-2 text-sm leading-6 text-[#c8c2e0]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 rounded-2xl border border-[#ece9f9] bg-white p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c3aed]">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">One simple plan</h2>
            <p className="mt-4 leading-7 text-[#6b7280]">
              Start with the core invoice workspace — clients, invoices, branding, and payment
              tracking, all included.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] p-6 ring-1 ring-[#e5e0f7]">
            <p className="text-sm font-semibold text-[#6d28d9]">Starter</p>
            <div className="mt-3 flex items-end gap-2">
              <strong className="text-5xl font-extrabold">$12</strong>
              <span className="pb-2 text-[#6b7280]">per seat / month</span>
            </div>
            <ul className="mt-6 grid gap-3 text-sm text-[#52506b] sm:grid-cols-2">
              {["Unlimited invoices", "Client profiles", "Payment reminders", "Branded invoices"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="grid size-4 place-items-center rounded-full bg-[#7c3aed] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="size-2.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="mt-6 inline-flex rounded-xl bg-[#7c3aed] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="faq" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] px-6 py-14 text-center text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 size-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to send your first invoice?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl leading-7 text-[#e9e2ff]">
            Set up your company profile, add a client, and create a branded invoice in minutes.
          </p>
          <Link
            href="/sign-up"
            className="relative mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-[#6d28d9] shadow-lg transition hover:bg-[#f5f3ff]"
          >
            Start free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ece9f9] bg-[#faf9ff]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2.5">
                <Logo size={30} />
                <span className="text-lg font-extrabold italic tracking-tight">Invoicery</span>
              </Link>
              <p className="mt-4 text-sm leading-6 text-[#6b7280]">
                A clean, simple invoicing workspace for freelancers and growing teams.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">Product</p>
                <ul className="mt-3 space-y-2 text-sm text-[#6b7280]">
                  <li><a href="#features" className="hover:text-[#6d28d9]">Features</a></li>
                  <li><a href="#workflow" className="hover:text-[#6d28d9]">Workflow</a></li>
                  <li><a href="#pricing" className="hover:text-[#6d28d9]">Pricing</a></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">Company</p>
                <ul className="mt-3 space-y-2 text-sm text-[#6b7280]">
                  <li><a href="#" className="hover:text-[#6d28d9]">About</a></li>
                  <li><a href="#" className="hover:text-[#6d28d9]">Blog</a></li>
                  <li><a href="#" className="hover:text-[#6d28d9]">Contact</a></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">Get started</p>
                <ul className="mt-3 space-y-2 text-sm text-[#6b7280]">
                  <li><Link href="/sign-in" className="hover:text-[#6d28d9]">Sign in</Link></li>
                  <li><Link href="/sign-up" className="hover:text-[#6d28d9]">Sign up</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-[#ece9f9] pt-6 text-sm text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Invoicery. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-[#6d28d9]">Privacy</a>
              <a href="#" className="hover:text-[#6d28d9]">Terms</a>
              <a href="#" className="hover:text-[#6d28d9]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
