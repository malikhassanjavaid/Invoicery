"use client";

import { useState } from "react";
import { LogoField } from "./logo-field";
import { BrandColorField } from "./brand-color-field";
import { saveCompanyProfile } from "../../actions";
import { formatCents } from "@/lib/format";

const CURRENCIES = ["USD", "EUR", "GBP", "PKR", "INR", "AED", "CAD", "AUD", "JPY", "CNY"];
const DEFAULT_ACCENT = "#4f46e5";

const inputClass =
  "rounded-xl border border-[#e5e7eb] px-4 py-2.5 font-normal text-[#1a1a2e] outline-none transition focus:border-[#1a1a2e]";
const labelClass = "grid gap-2 text-sm font-semibold text-[#1a1a2e]";

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
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      {/* LEFT: form */}
      <form
        action={saveCompanyProfile}
        className="grid gap-6 rounded-2xl border border-[#eef0f2] bg-white p-6"
      >
        <div>
          <h2 className="text-lg font-semibold text-[#1a1a2e]">Business information</h2>
          <p className="mt-1 text-sm text-[#9aa0a6]">
            These details will appear on invoices and connect clients to your workspace.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Business name *
            <input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Business email *
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Business address *
            <input
              name="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Country *
            <input
              name="country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Currency *
            <select
              name="currency"
              required
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClass}
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
          </label>
          <label className={labelClass}>
            Phone number
            <input
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </label>

          <BrandColorField value={brandColor} onChange={setBrandColor} />
          <LogoField value={logo} onChange={setLogo} />
        </div>

        <div>
          <button className="rounded-xl bg-[#1a1a2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a2a42]">
            Save company profile
          </button>
        </div>
      </form>

      {/* RIGHT: live invoice preview */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9aa0a6]">
          Invoice preview
        </p>
        <div className="overflow-hidden rounded-2xl border border-[#eef0f2] shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="h-2" style={{ backgroundColor: accent }} />
          <div className="bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="" className="size-10 rounded-md object-contain" />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1a1a2e]">
                    {name || "Your company"}
                  </p>
                  {address ? (
                    <p className="truncate text-[11px] text-[#9aa0a6]">{address}</p>
                  ) : null}
                </div>
              </div>
              <p className="text-xl font-extrabold tracking-tight" style={{ color: accent }}>
                INVOICE
              </p>
            </div>

            <div className="mt-4 flex justify-between gap-4 text-[11px]">
              <div>
                <p className="font-semibold text-[#9aa0a6]">Bill to</p>
                <p className="mt-0.5 font-semibold text-[#1a1a2e]">Sample Client</p>
              </div>
              <div className="text-right text-[#6b7280]">
                <p>No. INV-0001</p>
                <p>Due in 14 days</p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-[#f1f2f4]">
              <div
                className="flex justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-white"
                style={{ backgroundColor: accent }}
              >
                <span>Item</span>
                <span>Amount</span>
              </div>
              <div className="divide-y divide-[#f4f5f6]">
                {SAMPLE_ITEMS.map((item) => (
                  <div
                    key={item.description}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-[11px]"
                  >
                    <span className="text-[#1a1a2e]">{item.description}</span>
                    <span className="font-semibold text-[#1a1a2e]">{money(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 ml-auto grid w-full max-w-[200px] gap-1 text-[11px]">
              <div className="flex justify-between text-[#6b7280]">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div
                className="mt-1 flex justify-between border-t border-[#eef0f2] pt-1 text-sm font-bold"
                style={{ color: accent }}
              >
                <span>Total</span>
                <span>{money(subtotal)}</span>
              </div>
            </div>

            {email || phone ? (
              <p className="mt-4 text-[10px] text-[#9aa0a6]">
                {[email, phone].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
