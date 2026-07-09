import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "./_components/dashboard-shell";
import { getDashboardData, getInvoiceTotal } from "@/lib/data";
import { formatCents, formatDate } from "@/lib/format";
import { requireSyncedUser } from "@/lib/auth-sync";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  PAID: "bg-[#d7ebdd] text-[#1f6f56]",
  SENT: "bg-[#cdd3fb] text-[#3a3f8f]",
  OVERDUE: "bg-[#f9d9df] text-[#a13d3d]",
  DRAFT: "bg-[#f1f2f4] text-[#6b7280]",
  CANCELLED: "bg-[#f1f2f4] text-[#6b7280]",
};

export default async function DashboardPage() {
  const userId = await requireSyncedUser();
  const { company, clients, invoices, metrics } = await getDashboardData(userId);
  const recentInvoices = invoices.slice(0, 5);

  // Guided onboarding for new users: set up the company, then add a first client.
  if (!company) {
    redirect("/dashboard/profile");
  }
  if (!clients.length) {
    redirect("/dashboard/clients?welcome=1");
  }

  const currency = company.currency ?? "USD";

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
            className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a2e] hover:bg-[#f7f7f8]"
          >
            Add client
          </Link>
          <Link
            href="/dashboard/invoices"
            className="rounded-xl bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2a2a42]"
          >
            Create invoice
          </Link>
        </>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total revenue",
            value: formatCents(metrics.paidRevenue, currency),
            detail: "Paid invoice value",
            bg: "bg-[#cdd3fb]",
            icon: (
              <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z M16 12h.01 M3 10h18" />
            ),
          },
          {
            label: "Outstanding",
            value: formatCents(metrics.outstanding, currency),
            detail: "Sent and overdue",
            bg: "bg-[#f9d9df]",
            icon: <path d="M12 8v4l3 2 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />,
          },
          {
            label: "Paid invoices",
            value: String(metrics.paidInvoices),
            detail: "Completed invoices",
            bg: "bg-[#d7ebdd]",
            icon: <path d="m9 12 2 2 4-4 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
          },
          {
            label: "Active clients",
            value: String(metrics.activeClients),
            detail: "Stored client records",
            bg: "bg-[#e8eaee]",
            icon: (
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
            ),
          },
        ].map((card) => (
          <article key={card.label} className={`rounded-3xl p-5 text-[#1a1a2e] ${card.bg}`}>
            <span className="grid size-11 place-items-center rounded-full border border-black/10 bg-white/50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                {card.icon}
              </svg>
            </span>
            <p className="mt-4 text-sm font-semibold">{card.label}</p>
            <p className="mt-1 text-xs font-medium text-black/45">{card.detail}</p>
            <p className="mt-3 text-3xl font-bold">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-[#eef0f2] bg-white">
        <div className="flex items-center justify-between border-b border-[#f1f2f4] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a2e]">Recent invoices</h2>
            <p className="mt-1 text-sm text-[#9aa0a6]">Latest invoice activity</p>
          </div>
          <Link
            href="/dashboard/invoices"
            className="text-sm font-semibold text-[#1a1a2e] hover:underline"
          >
            View all
          </Link>
        </div>

        {recentInvoices.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-[#9aa0a6]">
                <tr className="border-b border-[#f1f2f4]">
                  <th className="px-6 py-3 font-medium">Invoice</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Due date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f5f6]">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 font-semibold text-[#1a1a2e]">{invoice.invoiceNo}</td>
                    <td className="px-6 py-4 text-[#6b7280]">{invoice.client.name}</td>
                    <td className="px-6 py-4 font-semibold text-[#1a1a2e]">
                      {formatCents(getInvoiceTotal(invoice), currency)}
                    </td>
                    <td className="px-6 py-4 text-[#6b7280]">{formatDate(invoice.dueDate)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[invoice.status] ?? statusStyles.DRAFT
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-8 text-sm text-[#9aa0a6]">
            No invoices yet. Create your first invoice from the Invoices tab.
          </p>
        )}
      </section>
    </DashboardShell>
  );
}
