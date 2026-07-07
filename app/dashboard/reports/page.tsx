import { DashboardShell } from "../_components/dashboard-shell";
import { getCompanyProfile, getInvoices, getInvoiceTotal } from "@/lib/data";
import { formatCents } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [company, invoices] = await Promise.all([getCompanyProfile(), getInvoices()]);
  const total = invoices.reduce((sum, invoice) => sum + getInvoiceTotal(invoice), 0);

  return (
    <DashboardShell
      active="Reports"
      title="Reports"
      subtitle="Simple financial summary"
      companyName={company?.name}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-[#dbe3d5] bg-white p-5">
          <p className="text-sm font-semibold text-[#607066]">Invoice value</p>
          <p className="mt-3 text-3xl font-semibold">{formatCents(total)}</p>
        </article>
        <article className="rounded-lg border border-[#dbe3d5] bg-white p-5">
          <p className="text-sm font-semibold text-[#607066]">Invoice count</p>
          <p className="mt-3 text-3xl font-semibold">{invoices.length}</p>
        </article>
        <article className="rounded-lg border border-[#dbe3d5] bg-white p-5">
          <p className="text-sm font-semibold text-[#607066]">Paid count</p>
          <p className="mt-3 text-3xl font-semibold">
            {invoices.filter((invoice) => invoice.status === "PAID").length}
          </p>
        </article>
      </section>
    </DashboardShell>
  );
}
