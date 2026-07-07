import Link from "next/link";
import { DashboardShell } from "./_components/dashboard-shell";
import { getDashboardData, getInvoiceTotal } from "@/lib/data";
import { formatCents, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { company, clients, invoices, metrics } = await getDashboardData();
  const recentInvoices = invoices.slice(0, 5);

  return (
    <DashboardShell
      active="Dashboard"
      title="Dashboard"
      subtitle="Live workspace overview"
      companyName={company?.name}
      actions={
        <>
          <Link
            href="/dashboard/clients"
            className="rounded-lg border border-[#cfd8ca] bg-white px-4 py-3 text-sm font-semibold"
          >
            Add client
          </Link>
          <Link
            href="/dashboard/invoices"
            className="rounded-lg bg-[#1f6f56] px-4 py-3 text-sm font-semibold text-white"
          >
            Create invoice
          </Link>
        </>
      }
    >
      {!company ? (
        <div className="rounded-lg border border-[#dbe3d5] bg-white p-6">
          <h2 className="text-xl font-semibold">Set up your company profile first</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[#607066]">
            Invoices need your company details before they can be created. Add your
            company profile now; when Neon is connected it will be stored in Postgres.
          </p>
          <Link
            href="/dashboard/profile"
            className="mt-5 inline-flex rounded-lg bg-[#1f6f56] px-5 py-3 text-sm font-semibold text-white"
          >
            Add company profile
          </Link>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total revenue", formatCents(metrics.paidRevenue), "Paid invoice value"],
          ["Outstanding", formatCents(metrics.outstanding), "Sent and overdue"],
          ["Paid invoices", String(metrics.paidInvoices), "Completed invoices"],
          ["Active clients", String(metrics.activeClients), "Stored client records"],
        ].map(([label, value, detail]) => (
          <article key={label} className="rounded-lg border border-[#dbe3d5] bg-white p-5">
            <p className="text-sm font-semibold text-[#607066]">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-sm text-[#1f6f56]">{detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-lg border border-[#dbe3d5] bg-white">
          <div className="flex items-center justify-between border-b border-[#e3e9dd] px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">Recent invoices</h2>
              <p className="mt-1 text-sm text-[#607066]">Stored invoice activity</p>
            </div>
            <Link href="/dashboard/invoices" className="text-sm font-semibold text-[#1f6f56]">
              View all
            </Link>
          </div>

          {recentInvoices.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[#f7f8f4] text-[#607066]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Invoice</th>
                    <th className="px-5 py-3 font-semibold">Client</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Due date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf1e9]">
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-5 py-4 font-semibold">{invoice.invoiceNo}</td>
                      <td className="px-5 py-4 text-[#52625a]">{invoice.client.name}</td>
                      <td className="px-5 py-4 font-semibold">
                        {formatCents(getInvoiceTotal(invoice))}
                      </td>
                      <td className="px-5 py-4 text-[#52625a]">{formatDate(invoice.dueDate)}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-[#eef5ec] px-3 py-2 text-xs font-semibold text-[#1f6f56]">
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-5 py-8 text-sm text-[#607066]">
              No invoices yet. Create your first invoice from the Invoices tab.
            </p>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-[#dbe3d5] bg-white p-5">
            <h2 className="text-lg font-semibold">Workspace health</h2>
            <div className="mt-5 space-y-4 text-sm text-[#52625a]">
              <p>Company profile: {company ? "Complete" : "Needed"}</p>
              <p>Clients stored: {clients.length}</p>
              <p>Invoices stored: {invoices.length}</p>
            </div>
          </div>

          <div className="rounded-lg border border-[#dbe3d5] bg-white p-5">
            <h2 className="text-lg font-semibold">Database status</h2>
            <p className="mt-3 text-sm leading-6 text-[#607066]">
              {process.env.DATABASE_URL
                ? "Neon connection string is configured."
                : "Add DATABASE_URL from Neon to enable writes."}
            </p>
          </div>
        </aside>
      </section>
    </DashboardShell>
  );
}
