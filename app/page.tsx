import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "./_components/brand-logo";
import { getSessionUserId } from "@/lib/auth-sync";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invoice Software for Modern Teams",
  description:
    "Launch a polished invoice workspace with company profiles, saved clients, branded invoice previews, and clear payment tracking.",
  openGraph: {
    title: "Invoicery - Invoice Software for Modern Teams",
    description:
      "Build branded invoices, organize clients, and manage billing from a professional SaaS dashboard.",
  },
};

const navItems = ["Features", "Method", "How We Do It", "Case Study"];

const features = [
  {
    title: "Company profile first",
    description:
      "Store your business name, address, tax details, and brand notes once so every invoice starts correctly.",
  },
  {
    title: "Clients stay organized",
    description:
      "Create reusable client records with billing details, contact info, and saved invoice history.",
  },
  {
    title: "Payment status is clear",
    description:
      "Track draft, sent, paid, and overdue invoices from one dashboard instead of scattered notes.",
  },
];

const method = [
  "Add your company profile",
  "Save a client record",
  "Build a polished invoice",
  "Track payment progress",
];

const invoiceLines = [
  ["Brand strategy sprint", "1", "$2,400"],
  ["Landing page implementation", "1", "$1,800"],
  ["Payment setup support", "1", "$120"],
];

function WaveField() {
  const curves = [
    "M-140 540 C 160 260, 430 330, 650 485 C 880 650, 1120 590, 1540 390",
    "M-120 570 C 150 300, 420 350, 650 510 C 880 672, 1140 620, 1540 430",
    "M-100 600 C 150 340, 430 390, 650 545 C 900 720, 1130 650, 1540 480",
    "M-130 630 C 130 390, 430 420, 650 585 C 890 762, 1140 700, 1540 530",
    "M-120 665 C 150 430, 450 460, 650 625 C 900 820, 1160 750, 1540 590",
    "M-160 705 C 120 480, 460 520, 650 675 C 900 870, 1160 800, 1540 650",
    "M-180 750 C 140 550, 470 570, 650 730 C 910 940, 1150 870, 1540 720",
    "M-140 805 C 160 625, 480 635, 650 785 C 900 1000, 1160 950, 1540 810",
    "M-110 865 C 170 705, 490 710, 650 845 C 900 1070, 1170 1030, 1540 910",
    "M-90 930 C 190 790, 500 790, 650 910 C 910 1130, 1170 1120, 1540 1025",
    "M100 1080 C 290 820, 510 720, 650 540 C 810 330, 1030 300, 1500 80",
    "M60 1080 C 280 805, 510 690, 650 500 C 815 280, 1050 250, 1500 20",
    "M20 1080 C 260 790, 500 650, 650 460 C 820 235, 1060 205, 1500 -45",
    "M-20 1080 C 250 770, 500 615, 650 420 C 825 190, 1080 160, 1500 -115",
    "M-70 1080 C 235 745, 500 575, 650 380 C 825 150, 1090 120, 1500 -175",
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[92px] overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-[82%] bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.78)_18%,rgba(238,248,255,0.62)_42%,rgba(224,242,255,0.9)_70%,rgba(210,231,255,0.98)_100%)]" />
      <svg
        viewBox="0 0 1440 980"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[-190px] h-[92%] w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#c6ecff" stopOpacity="0.1" />
            <stop offset="42%" stopColor="#64b8ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0457ff" stopOpacity="0.32" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>
        </defs>
        {curves.map((curve, index) => (
          <path
            key={curve}
            d={curve}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth={index % 3 === 0 ? 1.8 : 1}
            opacity={index < 10 ? 0.7 : 0.48}
          />
        ))}
        {curves.slice(0, 9).map((curve) => (
          <path
            key={`${curve}-glow`}
            d={curve}
            fill="none"
            stroke="#b8e9ff"
            strokeWidth="7"
            opacity="0.08"
            filter="url(#softGlow)"
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#f8fbff] via-[#f8fbff]/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#dbeaff] to-transparent" />
    </div>
  );
}

export default async function Home() {
  const isSignedIn = Boolean(await getSessionUserId());
  const appHref = isSignedIn ? "/dashboard" : "/sign-up";
  const appLabel = isSignedIn ? "Dashboard" : "Get Started";

  return (
    <main className="min-h-screen bg-white text-[#080d1d]">
      <section className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_34%,#eef7ff_100%)]">
        <WaveField />

        <nav className="relative z-20 mx-auto w-full max-w-[1180px] px-4 pt-5 sm:px-6 lg:px-8">
          <div className="flex h-[70px] items-center justify-between rounded-[22px] border border-white/70 bg-white/82 px-4 shadow-[0_20px_60px_rgba(15,76,180,0.09)] backdrop-blur-xl sm:px-5">
            <BrandLogo iconSize="md" />

            <div className="hidden items-center gap-8 text-[14px] font-semibold tracking-[-0.02em] text-[#111827] md:flex">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="transition hover:text-[#0457ff]">
                  {item}
                </a>
              ))}
            </div>

            <Link
              href={appHref}
              className="rounded-[12px] bg-[#0457ff] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(4,87,255,0.2)] transition hover:bg-[#0048dc]"
            >
              {appLabel}
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-95px)] max-w-[960px] flex-col items-center px-6 pb-24 pt-[11vh] text-center sm:px-8">
          <h1 className="max-w-[740px] text-[clamp(2.45rem,5vw,4.15rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-[#080d1d]">
            From messy billing
            <br />
            to <span className="text-[#0457ff]">one clear invoice</span>
          </h1>

          <p className="mt-6 max-w-[630px] text-[clamp(0.98rem,1.35vw,1.15rem)] font-medium leading-[1.55] tracking-[-0.025em] text-[#4b5263]">
            Invoicery turns company profiles, clients, and invoices into one smooth workflow,
            helping you bill faster, track payments, and stay confident.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href={appHref}
              className="min-w-[160px] rounded-[12px] bg-[#0457ff] px-7 py-3.5 text-[15px] font-semibold tracking-[-0.02em] text-white shadow-[0_18px_38px_rgba(4,87,255,0.22)] transition hover:bg-[#0048dc]"
            >
              {appLabel}
            </Link>
            <a
              href="#how-we-do-it"
              className="min-w-[160px] rounded-[12px] bg-white px-7 py-3.5 text-[15px] font-semibold tracking-[-0.02em] text-[#111827] shadow-[0_16px_36px_rgba(15,23,42,0.08)] ring-1 ring-[#eef2f7] transition hover:text-[#0457ff]"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-sm font-semibold text-[#0457ff]">Features</p>
              <h2 className="mt-3 max-w-xl text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-[#080d1d]">
                Built around the real invoice workflow.
              </h2>
            </div>
            <p className="max-w-2xl text-[17px] font-medium leading-8 tracking-[-0.02em] text-[#4b5263]">
              Invoicery keeps your business profile, client information, and invoice records connected,
              so every step feels intentional instead of patched together.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-[24px] border border-[#e8edf6] bg-[#fbfdff] p-7 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                <div className="mb-8 grid size-11 place-items-center rounded-[14px] bg-[#eaf3ff] text-[#0457ff]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    <path d="M5 12.5 9.2 17 19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.035em] text-[#080d1d]">{feature.title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 tracking-[-0.015em] text-[#5f6678]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="bg-[#f6faff] px-6 py-20 sm:px-8">
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[#0457ff]">Method</p>
            <h2 className="mt-3 max-w-lg text-[clamp(2rem,4vw,3.15rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-[#080d1d]">
              See how your invoice will look before you send it.
            </h2>
            <p className="mt-5 max-w-xl text-[17px] font-medium leading-8 tracking-[-0.02em] text-[#4b5263]">
              A clean invoice preview helps users trust the output. It shows the company identity,
              client details, line items, due date, and total in a format clients can understand quickly.
            </p>
            <div className="mt-8 grid gap-3">
              {method.map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-3 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
                  <span className="grid size-8 place-items-center rounded-full bg-[#0457ff] text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold tracking-[-0.02em] text-[#111827]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] bg-white p-5 shadow-[0_28px_90px_rgba(15,76,180,0.14)] ring-1 ring-[#e3ecfa]">
            <div className="rounded-[22px] border border-[#e8edf6] bg-white p-6">
              <div className="flex flex-col gap-6 border-b border-[#edf1f7] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <BrandLogo iconSize="sm" />
                  <p className="mt-4 text-sm font-medium leading-6 text-[#6b7280]">
                    221 Billing Avenue<br />
                    Austin, TX 78701
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-3xl font-semibold tracking-[-0.05em] text-[#080d1d]">Invoice</p>
                  <p className="mt-2 text-sm font-semibold text-[#0457ff]">#INV-1042</p>
                  <p className="mt-2 text-sm font-medium text-[#6b7280]">Due Jul 28, 2026</p>
                </div>
              </div>

              <div className="grid gap-5 border-b border-[#edf1f7] py-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9aa3b3]">Bill to</p>
                  <p className="mt-2 text-base font-semibold text-[#111827]">Acme Studio</p>
                  <p className="mt-1 text-sm font-medium leading-6 text-[#6b7280]">
                    Morgan Lee<br />
                    design@acme.test
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9aa3b3]">Status</p>
                  <span className="mt-2 inline-flex rounded-full bg-[#eaf3ff] px-3 py-1 text-sm font-semibold text-[#0457ff]">
                    Ready to send
                  </span>
                </div>
              </div>

              <div className="py-5">
                <div className="grid grid-cols-[1fr_54px_88px] gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#9aa3b3]">
                  <span>Item</span>
                  <span>Qty</span>
                  <span className="text-right">Amount</span>
                </div>
                <div className="mt-3 divide-y divide-[#edf1f7]">
                  {invoiceLines.map(([item, qty, amount]) => (
                    <div key={item} className="grid grid-cols-[1fr_54px_88px] gap-3 py-3 text-sm font-medium text-[#111827]">
                      <span>{item}</span>
                      <span className="text-[#6b7280]">{qty}</span>
                      <span className="text-right font-semibold">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] bg-[#080d1d] p-5 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/60">Total due</p>
                    <p className="mt-1 text-4xl font-semibold tracking-[-0.05em]">$4,320</p>
                  </div>
                  <p className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#0457ff]">USD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-we-do-it" className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-[1120px]">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#0457ff]">How We Do It</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-[clamp(2rem,4vw,3.15rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-[#080d1d]">
              From setup to sent invoice in minutes.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {["Profile", "Client", "Invoice", "Track"].map((item, index) => (
              <div key={item} className="rounded-[22px] border border-[#e8edf6] bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
                <p className="text-sm font-semibold text-[#0457ff]">0{index + 1}</p>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.04em] text-[#080d1d]">{item}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-[#5f6678]">
                  {[
                    "Enter business details once.",
                    "Save who you are billing.",
                    "Add items, due date, and notes.",
                    "Watch payment status update.",
                  ][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="case-study" className="bg-[#080d1d] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[#78b5ff]">Case Study</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.055em]">
              A cleaner billing desk for growing service teams.
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] font-medium leading-8 tracking-[-0.02em] text-white/70">
              Teams can move from client setup to invoice creation without switching tools. The goal
              is simple: fewer loose records and clearer payment follow-up.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["8 min", "sample invoice build"],
              ["24/7", "workspace access"],
              ["3 tabs", "profile, clients, invoices"],
              ["1 view", "payment status overview"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[22px] border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-semibold tracking-[-0.05em]">{value}</p>
                <p className="mt-2 text-sm font-medium leading-5 text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 sm:px-8">
        <div className="mx-auto grid max-w-[1120px] overflow-hidden rounded-[30px] border border-[#dfe9f8] bg-[#f6faff] shadow-[0_28px_90px_rgba(15,76,180,0.1)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="px-6 py-12 sm:px-10 lg:py-16">
            <p className="text-sm font-semibold text-[#0457ff]">Start billing with confidence</p>
            <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.055em] text-[#080d1d]">
              Ready to create your first professional invoice?
            </h2>
            <p className="mt-5 max-w-xl text-[17px] font-medium leading-8 text-[#4b5263]">
              Add your company profile, save the client, and create a branded invoice from one connected dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={appHref}
                className="inline-flex rounded-[12px] bg-[#0457ff] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_18px_38px_rgba(4,87,255,0.22)] transition hover:bg-[#0048dc]"
              >
                {appLabel}
              </Link>
              <span className="rounded-full border border-[#dfe9f8] bg-white px-4 py-2 text-sm font-semibold text-[#4b5263]">
                No setup clutter
              </span>
            </div>
          </div>

          <div className="border-t border-[#dfe9f8] bg-white/70 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div className="rounded-[24px] border border-[#e4ecf8] bg-white p-5 shadow-[0_18px_55px_rgba(15,76,180,0.09)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9aa3b3]">Invoice preview</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#080d1d]">INV-2026-014</p>
                </div>
                <span className="rounded-full bg-[#e7f5ec] px-3 py-1 text-xs font-bold text-[#1f8a5b]">Paid</span>
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  ["Company profile", "Ready"],
                  ["Client record", "Acme Studio"],
                  ["Invoice total", "$4,320"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-[16px] bg-[#f6faff] px-4 py-3">
                    <span className="text-sm font-semibold text-[#6b7280]">{label}</span>
                    <span className="text-sm font-bold text-[#080d1d]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[18px] bg-[#080d1d] p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/65">Next action</span>
                  <span className="text-sm font-semibold">Send invoice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#edf1f7] bg-white px-6 py-10 sm:px-8">
        <div className="mx-auto max-w-[1120px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <BrandLogo iconSize="sm" />
              <p className="mt-4 text-sm font-medium leading-7 text-[#5f6678]">
                A clean invoicing workspace for managing company details, clients,
                and professional invoices in one place.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#080d1d]">Product</h3>
                <div className="mt-4 grid gap-3 text-sm font-semibold text-[#5f6678]">
                  <a href="#features" className="transition hover:text-[#0457ff]">Features</a>
                  <a href="#method" className="transition hover:text-[#0457ff]">Method</a>
                  <a href="#how-we-do-it" className="transition hover:text-[#0457ff]">Workflow</a>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#080d1d]">Workspace</h3>
                <div className="mt-4 grid gap-3 text-sm font-semibold text-[#5f6678]">
                  <Link href="/dashboard" className="transition hover:text-[#0457ff]">Dashboard</Link>
                  <Link href="/dashboard/clients" className="transition hover:text-[#0457ff]">Clients</Link>
                  <Link href="/dashboard/invoices" className="transition hover:text-[#0457ff]">Invoices</Link>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#080d1d]">Account</h3>
                <div className="mt-4 grid gap-3 text-sm font-semibold text-[#5f6678]">
                  {!isSignedIn && <Link href="/sign-in" className="transition hover:text-[#0457ff]">Sign in</Link>}
                  <Link href={appHref} className="transition hover:text-[#0457ff]">{appLabel}</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-[#edf1f7] pt-6 text-sm font-medium text-[#8b94a6] sm:flex-row sm:items-center sm:justify-between">
            <p>(c) 2026 Invoicery. All rights reserved.</p>
            <p>Professional invoice management for modern teams.</p>
          </div>
        </div>
      </footer>

      <footer className="hidden border-t border-[#edf1f7] bg-[#f8fbff] px-6 pb-8 pt-16 sm:px-8">
        <div className="mx-auto max-w-[1120px]">
          <div className="rounded-[30px] border border-[#dfe9f8] bg-white px-6 py-8 shadow-[0_24px_70px_rgba(15,76,180,0.08)] sm:px-8 lg:flex lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0457ff]">Ready when your next invoice is</p>
              <h2 className="mt-2 max-w-xl text-[clamp(1.8rem,3vw,2.7rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-[#080d1d]">
                Keep clients, company details, and invoices in one tidy workspace.
              </h2>
            </div>
            <Link
              href={appHref}
              className="mt-7 inline-flex rounded-[14px] bg-[#0457ff] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(4,87,255,0.2)] transition hover:bg-[#0048dc] lg:mt-0"
            >
              {appLabel}
            </Link>
          </div>

          <div className="grid gap-10 py-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr]">
            <div>
              <BrandLogo iconSize="sm" />
              <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-[#5f6678]">
                Invoicery helps small teams create branded invoices, store client records,
                and track billing status without a messy spreadsheet.
              </p>
              <div className="mt-5 flex gap-3">
                {["IN", "TW", "YT"].map((item) => (
                  <span
                    key={item}
                    className="grid size-10 place-items-center rounded-full border border-[#dfe9f8] bg-white text-xs font-bold text-[#0457ff]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#080d1d]">Product</h3>
              <div className="mt-5 grid gap-3 text-sm font-semibold text-[#5f6678]">
                <a href="#features" className="transition hover:text-[#0457ff]">Features</a>
                <a href="#method" className="transition hover:text-[#0457ff]">Method</a>
                <a href="#how-we-do-it" className="transition hover:text-[#0457ff]">How We Do It</a>
                <a href="#case-study" className="transition hover:text-[#0457ff]">Case Study</a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#080d1d]">Workspace</h3>
              <div className="mt-5 grid gap-3 text-sm font-semibold text-[#5f6678]">
                <Link href={appHref} className="transition hover:text-[#0457ff]">Dashboard</Link>
                <Link href="/dashboard/profile" className="transition hover:text-[#0457ff]">Company Profile</Link>
                <Link href="/dashboard/clients" className="transition hover:text-[#0457ff]">Clients</Link>
                <Link href="/dashboard/invoices" className="transition hover:text-[#0457ff]">Invoices</Link>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#dfe9f8] bg-white p-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#080d1d]">Built For</h3>
              <div className="mt-5 grid gap-3">
                {["Freelancers", "Service teams", "Small agencies"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold text-[#4b5263]">
                    <span className="size-2 rounded-full bg-[#0457ff]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-[#dfe9f8] pt-6 text-sm font-medium text-[#8b94a6] [&>p]:hidden md:flex-row md:items-center md:justify-between">
            <span>(c) 2026 Invoicery. Professional invoicing workspace.</span>
          <p className="text-sm font-medium text-[#8b94a6]">© 2026 Invoicery</p>
            <div className="flex flex-wrap gap-4">
              {!isSignedIn && <Link href="/sign-in" className="hover:text-[#0457ff]">Sign in</Link>}
              <Link href={appHref} className="hover:text-[#0457ff]">{appLabel}</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
