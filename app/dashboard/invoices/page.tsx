import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "../_components/dashboard-shell";
import { CreateInvoiceButton, DeleteInvoiceButton } from "./_components/invoice-dialog";
import { updateInvoiceStatus } from "../actions";
import {
  getClients,
  getCompanyProfile,
  getInvoiceSubtotal,
  getInvoiceTotal,
  getInvoices,
} from "@/lib/data";
import { formatCents, formatDate } from "@/lib/format";
import { requireSyncedUser } from "@/lib/auth-sync";

const statuses = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const userId = await requireSyncedUser();
  const [company, clients, invoices] = await Promise.all([
    getCompanyProfile(userId),
    getClients(userId),
    getInvoices(userId),
  ]);

  if (!company) {
    redirect("/dashboard/profile");
  }

  const currency = company.currency ?? "USD";
  const clientOptions = clients.map((client) => ({ id: client.id, name: client.name }));

  return (
    <DashboardShell
      active="Invoices"
      title="Invoices"
      subtitle="Create and manage billing"
      companyName={company?.name}
      actions={<CreateInvoiceButton clients={clientOptions} />}
    >
      <div className="rounded-lg border border-[#dbe3d5] bg-white">
        <div className="border-b border-[#e3e9dd] px-5 py-4">
          <h2 className="text-lg font-semibold">All invoices</h2>
          <p className="mt-1 text-sm text-[#607066]">
            {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"} stored.
          </p>
        </div>

        {invoices.length ? (
          <div className="divide-y divide-[#edf1e9]">
            {invoices.map((invoice) => (
              <article key={invoice.id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{invoice.invoiceNo}</h3>
                    <p className="mt-1 text-sm text-[#607066]">
                      {invoice.client.name} · Due {formatDate(invoice.dueDate)}
                    </p>
                    <p className="mt-3 text-sm text-[#607066]">
                      Subtotal {formatCents(getInvoiceSubtotal(invoice), currency)} · Total{" "}
                      <strong className="text-[#17201b]">
                        {formatCents(getInvoiceTotal(invoice), currency)}
                      </strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <form action={updateInvoiceStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={invoice.id} />
                      <select
                        name="status"
                        defaultValue={invoice.status}
                        className="rounded-lg border border-[#cfd8ca] px-3 py-2 text-sm outline-none focus:border-[#1f6f56]"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button className="rounded-lg bg-[#17201b] px-4 py-2 text-sm font-semibold text-white">
                        Update
                      </button>
                    </form>
                    <DeleteInvoiceButton id={invoice.id} />
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-[#f7f8f4] p-4">
                  {invoice.lineItems.map((item) => (
                    <p key={item.id} className="text-sm text-[#52625a]">
                      {item.description}: {item.quantity} x {formatCents(item.unitPrice, currency)}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-sm text-[#607066]">
            <p>No invoices yet. Use the Create invoice button to add your first one.</p>
            {!clients.length ? (
              <Link href="/dashboard/clients" className="mt-3 inline-flex font-semibold text-[#1f6f56]">
                Add a client first
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
