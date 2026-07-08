import { DashboardShell } from "../_components/dashboard-shell";
import { LogoField } from "./_components/logo-field";
import { saveCompanyProfile } from "../actions";
import { getCompanyProfile } from "@/lib/data";
import { requireSyncedUser } from "@/lib/auth-sync";

export const dynamic = "force-dynamic";

const CURRENCIES = ["USD", "EUR", "GBP", "PKR", "INR", "AED", "CAD", "AUD", "JPY", "CNY"];

export default async function CompanyProfilePage() {
  const userId = await requireSyncedUser();
  const company = await getCompanyProfile(userId);

  return (
    <DashboardShell
      active="Company Profile"
      title="Company profile"
      subtitle="Stored business details"
      companyName={company?.name}
    >
      <form action={saveCompanyProfile} className="grid gap-6 rounded-lg border border-[#dbe3d5] bg-white p-6">
        <div>
          <h2 className="text-xl font-semibold">Business information</h2>
          <p className="mt-2 text-sm text-[#607066]">
            These details will appear on invoices and connect clients to your workspace.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Business name *
            <input
              name="name"
              required
              defaultValue={company?.name ?? ""}
              className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Business email *
            <input
              name="email"
              type="email"
              required
              defaultValue={company?.email ?? ""}
              className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold md:col-span-2">
            Business address *
            <input
              name="address"
              required
              defaultValue={company?.address ?? ""}
              className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Country *
            <input
              name="country"
              required
              defaultValue={company?.country ?? ""}
              className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Currency *
            <select
              name="currency"
              required
              defaultValue={company?.currency ?? ""}
              className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
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
          <label className="grid gap-2 text-sm font-semibold">
            Phone number
            <input
              name="phone"
              defaultValue={company?.phone ?? ""}
              className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
            />
          </label>

          <LogoField defaultValue={company?.logoUrl} />
        </div>

        <div>
          <button className="rounded-lg bg-[#1f6f56] px-5 py-3 text-sm font-semibold text-white">
            Save company profile
          </button>
        </div>
      </form>
    </DashboardShell>
  );
}
