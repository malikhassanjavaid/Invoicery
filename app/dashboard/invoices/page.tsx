import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "../_components/dashboard-shell";
import { CreateInvoiceButton } from "./_components/invoice-dialog";
import { InvoiceRowActions } from "./_components/invoice-row-actions";
import { StatusSelect } from "./_components/status-select";
import { getClients, getCompanyProfile, getInvoiceTotal, getInvoices } from "@/lib/data";
import { formatCents, formatDate } from "@/lib/format";
import { requireSyncedUser } from "@/lib/auth-sync";

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
  const accent = company.brandColor || "#4f46e5";
  const clientOptions = clients.map((client) => ({ id: client.id, name: client.name }));
  const companyInfo = {
    name: company.name,
    logoUrl: company.logoUrl,
    brandColor: company.brandColor,
  };
  const docCompany = {
    name: company.name,
    email: company.email,
    address: company.address,
    phone: company.phone,
    logoUrl: company.logoUrl,
    brandColor: company.brandColor,
  };

  return (
    <DashboardShell
      active="Invoices"
      title="Invoices"
      subtitle="Create and manage billing"
      companyName={company?.name}
      actions={
        <CreateInvoiceButton clients={clientOptions} currency={currency} company={companyInfo} />
      }
    >
      <div className="rounded-2xl border border-[#eef0f2] bg-white">
        <div className="border-b border-[#f1f2f4] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1a1a2e]">All invoices</h2>
          <p className="mt-1 text-sm text-[#9aa0a6]">
            {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"} stored.
          </p>
        </div>

        {invoices.length ? (
          <div>
            {/* Column header */}
            <div className="hidden items-center gap-4 border-b border-[#f1f2f4] px-6 py-2.5 text-xs font-medium uppercase tracking-wide text-[#9aa0a6] md:flex">
              <div className="min-w-0 flex-1">Invoice</div>
              <div className="min-w-0 flex-1">Client</div>
              <div className="w-28 shrink-0 text-right">Amount</div>
              <div className="hidden w-28 shrink-0 text-right lg:block">Due date</div>
              <div className="w-28 shrink-0">Status</div>
              <div className="w-36 shrink-0 text-right">Actions</div>
            </div>

            <div className="divide-y divide-[#f4f5f6]">
              {invoices.map((invoice) => {
                const docInvoice = {
                  id: invoice.id,
                  invoiceNo: invoice.invoiceNo,
                  status: invoice.status,
                  issueDate: formatDate(invoice.issueDate),
                  dueDate: formatDate(invoice.dueDate),
                  taxRate: invoice.taxRate,
                  discount: invoice.discount,
                  notes: invoice.notes,
                  client: { name: invoice.client.name, email: invoice.client.email },
                  lineItems: invoice.lineItems,
                };
                const editInvoice = {
                  id: invoice.id,
                  clientId: invoice.client.id,
                  status: invoice.status,
                  issueDate: invoice.issueDate.toISOString().slice(0, 10),
                  dueDate: invoice.dueDate.toISOString().slice(0, 10),
                  taxRate: invoice.taxRate,
                  discount: (invoice.discount / 100).toString(),
                  notes: invoice.notes ?? "",
                  lineItems: invoice.lineItems.map((item) => ({
                    description: item.description,
                    quantity: String(item.quantity),
                    unitPrice: (item.unitPrice / 100).toString(),
                  })),
                };
                return (
                  <div
                    key={invoice.id}
                    className="flex items-center gap-4 px-6 py-3 transition hover:bg-[#fafbfc]"
                  >
                    {/* Invoice */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-lg"
                        style={{ backgroundColor: `${accent}14`, color: accent }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                          <path d="M14 2v6h6" />
                          <path d="M16 13H8M16 17H8M10 9H8" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#1a1a2e]">{invoice.invoiceNo}</p>
                        <p className="truncate text-xs text-[#9aa0a6]">
                          Issued {formatDate(invoice.issueDate)}
                        </p>
                      </div>
                    </div>

                    {/* Client */}
                    <div className="hidden min-w-0 flex-1 md:block">
                      <p className="truncate text-sm font-medium text-[#1a1a2e]">
                        {invoice.client.name}
                      </p>
                      <p className="truncate text-xs text-[#9aa0a6]">{invoice.client.email}</p>
                    </div>

                    {/* Amount */}
                    <div className="w-28 shrink-0 text-right text-sm font-semibold text-[#1a1a2e]">
                      {formatCents(getInvoiceTotal(invoice), currency)}
                    </div>

                    {/* Due date */}
                    <div className="hidden w-28 shrink-0 text-right text-sm text-[#6b7280] lg:block">
                      {formatDate(invoice.dueDate)}
                    </div>

                    {/* Status */}
                    <div className="w-28 shrink-0">
                      <StatusSelect id={invoice.id} status={invoice.status} />
                    </div>

                    {/* Actions */}
                    <div className="w-36 shrink-0">
                      <InvoiceRowActions
                        invoice={docInvoice}
                        company={docCompany}
                        currency={currency}
                        clients={clientOptions}
                        editInvoice={editInvoice}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="px-6 py-8 text-sm text-[#9aa0a6]">
            <p>No invoices yet. Use the Create invoice button to add your first one.</p>
            {!clients.length ? (
              <Link href="/dashboard/clients" className="mt-3 inline-flex font-semibold text-[#1a1a2e]">
                Add a client first
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
