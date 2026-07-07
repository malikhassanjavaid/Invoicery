import Link from "next/link";

const navItems = ["Features", "Workflow", "Pricing", "FAQ"];

const stats = [
  { value: "$1.8M", label: "dummy invoices tracked" },
  { value: "4.9/5", label: "sample customer rating" },
  { value: "12 hrs", label: "average payment reminder saved" },
];

const features = [
  {
    title: "Smart invoice builder",
    description:
      "Create polished invoices with saved clients, tax presets, and branded payment terms.",
  },
  {
    title: "Payment follow-ups",
    description:
      "Automated reminder drafts keep overdue invoices visible without awkward manual chasing.",
  },
  {
    title: "Live cash view",
    description:
      "See paid, pending, and overdue totals from one clean dashboard built for quick scanning.",
  },
];

const workflow = ["Create", "Send", "Track", "Get paid"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#17201b]">
      <nav className="border-b border-[#dfe5d7] bg-[#f7f8f4]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="grid size-9 place-items-center rounded-lg bg-[#1f6f56] text-sm font-bold text-white">
              IV
            </span>
            <span className="text-xl">Invoicery</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#516258] md:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#17201b]">
                {item}
              </a>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg bg-[#17201b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f6f56]"
          >
            Start free
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <p className="mb-5 inline-flex rounded-lg border border-[#bfd2c4] bg-white px-3 py-2 text-sm font-semibold text-[#1f6f56]">
            Simple invoicing for modern service teams
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-[#101713] sm:text-6xl">
            Send invoices, track payments, and keep cash flow moving.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52625a]">
            Invoicery is a dummy SaaS landing page for freelancers and growing teams
            that need fast invoice creation, client records, payment tracking, and
            gentle reminders in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#1f6f56] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#185744]"
            >
              Create first invoice
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-[#cfd8ca] bg-white px-6 py-3 text-center font-semibold text-[#17201b] transition hover:border-[#1f6f56]"
            >
              View features
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-[#d7dfd0] bg-white p-5 shadow-[0_24px_80px_rgba(31,111,86,0.12)]">
          <div className="rounded-lg border border-[#e5eadf] bg-[#fbfcf8] p-5">
            <div className="flex items-start justify-between gap-6 border-b border-[#e2e8dc] pb-5">
              <div>
                <p className="text-sm font-semibold text-[#607066]">Invoice #INV-1042</p>
                <h2 className="mt-2 text-2xl font-semibold">Acme Studio Retainer</h2>
              </div>
              <span className="rounded-lg bg-[#dff3e9] px-3 py-2 text-sm font-semibold text-[#1f6f56]">
                Paid
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["Brand strategy sprint", "$2,400"],
                ["Landing page design", "$1,800"],
                ["Payment processing", "$120"],
              ].map(([name, price]) => (
                <div key={name} className="flex items-center justify-between rounded-lg bg-white p-4">
                  <span className="text-sm font-medium text-[#52625a]">{name}</span>
                  <span className="font-semibold">{price}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-[#17201b] p-5 text-white">
              <p className="text-sm text-[#b9c6bd]">Total due</p>
              <div className="mt-2 flex items-end justify-between">
                <strong className="text-4xl">$4,320</strong>
                <span className="text-sm text-[#dce8df]">Due Jul 28</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe5d7] bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-semibold text-[#1f6f56]">{stat.value}</p>
              <p className="mt-1 text-sm text-[#607066]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1f6f56]">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Everything your invoice workflow needs first.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-[#dbe3d5] bg-white p-6">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-4 leading-7 text-[#5b6b61]">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="bg-[#17201b] px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9ed7bd]">
                Workflow
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-4xl">
                From draft invoice to paid receipt in four clear steps.
              </h2>
            </div>
            <p className="max-w-md leading-7 text-[#c6d3ca]">
              Dummy automations help teams spend less time organizing billing and more
              time doing billable work.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step, index) => (
              <div key={step} className="rounded-lg border border-white/15 bg-white/5 p-5">
                <span className="text-sm font-semibold text-[#9ed7bd]">0{index + 1}</span>
                <p className="mt-5 text-xl font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 rounded-lg border border-[#dbe3d5] bg-white p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1f6f56]">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Simple dummy plan</h2>
            <p className="mt-4 leading-7 text-[#5b6b61]">
              Start with the core invoice workspace and add real billing, auth, and
              database features later.
            </p>
          </div>
          <div className="rounded-lg bg-[#f4f7ef] p-6">
            <p className="text-sm font-semibold text-[#607066]">Starter</p>
            <div className="mt-3 flex items-end gap-2">
              <strong className="text-5xl">$12</strong>
              <span className="pb-2 text-[#607066]">per seat/month</span>
            </div>
            <ul className="mt-6 grid gap-3 text-sm text-[#52625a] sm:grid-cols-2">
              <li>Unlimited dummy invoices</li>
              <li>Client profiles</li>
              <li>Payment reminders</li>
              <li>CSV export</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-lg bg-[#e8efe4] p-8 text-center">
          <h2 className="text-3xl font-semibold">Ready to shape the full product?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#52625a]">
            This first page is intentionally simple, with dummy data ready to evolve
            into auth, dashboards, invoice CRUD, client management, and payments.
          </p>
        </div>
      </section>

      <footer className="border-t border-[#dfe5d7] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-[#607066] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Invoicery. Dummy SaaS landing page.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#17201b]">
              Privacy
            </a>
            <a href="#" className="hover:text-[#17201b]">
              Terms
            </a>
            <a href="#" className="hover:text-[#17201b]">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
