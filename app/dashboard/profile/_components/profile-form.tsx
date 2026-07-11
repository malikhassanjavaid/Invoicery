"use client";

import { useState } from "react";
import { LogoField } from "./logo-field";
import { BrandColorField } from "./brand-color-field";
import { saveCompanyProfile } from "../../actions";
import { formatCents } from "@/lib/format";
import { COUNTRIES } from "@/lib/countries";

const CURRENCIES = ["USD", "EUR", "GBP", "PKR", "INR", "AED", "CAD", "AUD", "JPY", "CNY"];
const DEFAULT_ACCENT = "#4f46e5";

const fieldLabel = "text-sm font-semibold text-[var(--dash-text)]";
const fieldInput =
  "mt-2 block w-full min-w-0 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2.5 text-sm font-normal text-[var(--dash-text)] outline-none transition focus:border-[var(--dash-primary)] focus:ring-2 focus:ring-[var(--dash-panel-soft)]";

type Company = {
  name: string;
  email: string;
  address: string | null;
  country: string | null;
  currency: string | null;
  brandColor: string | null;
  phone: string | null;
  logoUrl: string | null;
} | null;

const SAMPLE_ITEMS = [
  { description: "Website design", amount: 120000 },
  { description: "Hosting (annual)", amount: 30000 },
];

export function ProfileForm({ company }: { company: Company }) {
  const [name, setName] = useState(company?.name ?? "");
  const [email, setEmail] = useState(company?.email ?? "");
  const [address, setAddress] = useState(company?.address ?? "");
  const [country, setCountry] = useState(company?.country ?? "");
  const [currency, setCurrency] = useState(company?.currency ?? "");
  const [phone, setPhone] = useState(company?.phone ?? "");
  const [brandColor, setBrandColor] = useState(company?.brandColor || DEFAULT_ACCENT);
  const [logo, setLogo] = useState(company?.logoUrl ?? "");

  const accent = brandColor || DEFAULT_ACCENT;
  const money = (cents: number) => formatCents(cents, currency || "USD");
  const subtotal = SAMPLE_ITEMS.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      {/* FORM */}
      <form
        action={saveCompanyProfile}
        className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 sm:p-7"
      >
        <h2 className="text-lg font-semibold text-[var(--dash-text)]">Business information</h2>
        <p className="mt-1 text-sm text-[var(--dash-muted)]">
          These details will appear on invoices and connect clients to your workspace.
        </p>

        <div className="mt-6 space-y-5">
          {/* Name + Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor="name" className={fieldLabel}>
                Business name *
              </label>
              <input
                id="name"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldInput}
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="email" className={fieldLabel}>
                Business email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldInput}
              />
            </div>
          </div>

          {/* Address */}
          <div className="min-w-0">
            <label htmlFor="address" className={fieldLabel}>
              Business address *
            </label>
            <input
              id="address"
              name="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={fieldInput}
            />
          </div>

          {/* Country + Currency */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor="country" className={fieldLabel}>
                Country *
              </label>
              <select
                id="country"
                name="country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={fieldInput}
              >
                <option value="" disabled>
                  Select country
                </option>
                {COUNTRIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor="currency" className={fieldLabel}>
                Currency *
              </label>
              <select
                id="currency"
                name="currency"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={fieldInput}
              >
                <option value="" disabled>
                  Select currency
                </option>
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone */}
          <div className="min-w-0">
            <label htmlFor="phone" className={fieldLabel}>
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldInput}
            />
          </div>

          {/* Invoice color (renders its own label) */}
          <BrandColorField value={brandColor} onChange={setBrandColor} />

          {/* Logo (renders its own label) */}
          <LogoField value={logo} onChange={setLogo} />
        </div>

        <button className="mt-7 rounded-xl bg-[var(--dash-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--dash-primary-text)] transition hover:bg-[var(--dash-primary-hover)]">
          Save company profile
        </button>
      </form>

      {/* PREVIEW */}
      <div className="w-full max-w-md xl:max-w-none xl:sticky xl:top-4 xl:self-start">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--dash-muted)]">
          Invoice preview
        </p>
        <div className="overflow-hidden rounded-2xl border border-[var(--dash-border)] shadow-sm">
          <div className="h-2" style={{ backgroundColor: accent }} />
          <div className="bg-[var(--dash-panel)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="" className="size-10 shrink-0 rounded-md object-contain" />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--dash-text)]">
                    {name || "Your company"}
                  </p>
                  {address ? (
                    <p className="truncate text-[11px] text-[var(--dash-muted)]">{address}</p>
                  ) : null}
                </div>
              </div>
              <p className="shrink-0 text-lg font-extrabold tracking-tight" style={{ color: accent }}>
                INVOICE
              </p>
            </div>

            <div className="mt-4 flex justify-between gap-4 text-[11px]">
              <div className="min-w-0">
                <p className="font-semibold text-[var(--dash-muted)]">Bill to</p>
                <p className="mt-0.5 font-semibold text-[var(--dash-text)]">Sample Client</p>
              </div>
              <div className="shrink-0 text-right text-[var(--dash-subtle)]">
                <p>No. INV-0001</p>
                <p>Due in 14 days</p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-[var(--dash-border-soft)]">
              <div
                className="flex justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-white"
                style={{ backgroundColor: accent }}
              >
                <span>Item</span>
                <span>Amount</span>
              </div>
              <div className="divide-y divide-[var(--dash-border-soft)]">
                {SAMPLE_ITEMS.map((item) => (
                  <div
                    key={item.description}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-[11px]"
                  >
                    <span className="truncate text-[var(--dash-text)]">{item.description}</span>
                    <span className="shrink-0 font-semibold text-[var(--dash-text)]">
                      {money(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 ml-auto grid w-full max-w-[200px] gap-1 text-[11px]">
              <div className="flex justify-between text-[var(--dash-subtle)]">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div
                className="mt-1 flex justify-between border-t border-[var(--dash-border)] pt-1 text-sm font-bold"
                style={{ color: accent }}
              >
                <span>Total</span>
                <span>{money(subtotal)}</span>
              </div>
            </div>

            {email || phone ? (
              <p className="mt-4 truncate text-[10px] text-[var(--dash-muted)]">
                {[email, phone].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
