import Link from "next/link";
import { DashboardShell } from "../_components/dashboard-shell";
import { createInvoice, deleteInvoice, updateInvoiceStatus } from "../actions";
import {
  getClients,
  getCompanyProfile,
  getInvoiceSubtotal,
  getInvoiceTotal,
  getInvoices,
} from "@/lib/data";
import { formatCents, formatDate } from "@/lib/format";

const statuses = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const [company, clients, invoices] = await Promise.all([
    getCompanyProfile(),
    getClients(),
    getInvoices(),
  ]);

  return (
    <DashboardShell
      active="Invoices"
      title="Invoices"
      subtitle="Create and manage billing"
      companyName={company?.name}
    >
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form action={createInvoice} className="rounded-lg border border-[#dbe3d5] bg-white p-6">
          <h2 className="text-xl font-semibold">Create invoice</h2>
          <p className="mt-2 text-sm text-[#607066]">
            Start with one line item for now. We can add multi-item editing next.
          </p>

          {!company ? (
            <div className="mt-5 rounded-lg bg-[#fff7dd] p-4 text-sm text-[#765a16]">
              Add a company profile before creating invoices.
            </div>
          ) : null}

          {!clients.length ? (
            <div className="mt-5 rounded-lg bg-[#fff7dd] p-4 text-sm text-[#765a16]">
              Add a client before creating invoices.
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Invoice number
              <input
                name="invoiceNo"
                required
                placeholder="INV-1001"
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Client
              <select
                name="clientId"
                required
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              >
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Issue date
              <input
                name="issueDate"
                type="date"
                required
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Due date
              <input
                name="dueDate"
                type="date"
                required
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Status
              <select
                name="status"
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Tax rate
              <input
                name="taxRate"
                type="number"
                min="0"
                defaultValue="0"
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold md:col-span-2">
              Line item description
              <input
                name="description"
                required
                placeholder="Design retainer"
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Quantity
              <input
                name="quantity"
                type="number"
                min="1"
                defaultValue="1"
                required
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Unit price
              <input
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                required
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Discount
              <input
                name="discount"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold md:col-span-2">
              Notes
              <textarea
                name="notes"
                rows={4}
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              />
            </label>
          </div>

          <button
            disabled={!company || !clients.length}
            className="mt-5 rounded-lg bg-[#1f6f56] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9bb5aa]"
          >
            Save invoice
          </button>
        </form>

        <div className="rounded-lg border border-[#dbe3d5] bg-white">
          <div className="border-b border-[#e3e9dd] px-5 py-4">
            <h2 className="text-lg font-semibold">Stored invoices</h2>
            <p className="mt-1 text-sm text-[#607066]">
              Invoice records backed by Prisma and Neon once configured.
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
                        Subtotal {formatCents(getInvoiceSubtotal(invoice))} · Total{" "}
                        <strong className="text-[#17201b]">
                          {formatCents(getInvoiceTotal(invoice))}
                        </strong>
                      </p>
                    </div>
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
                  </div>
                  <div className="mt-4 rounded-lg bg-[#f7f8f4] p-4">
                    {invoice.lineItems.map((item) => (
                      <p key={item.id} className="text-sm text-[#52625a]">
                        {item.description}: {item.quantity} x {formatCents(item.unitPrice)}
                      </p>
                    ))}
                  </div>
                  <form action={deleteInvoice} className="mt-3">
                    <input type="hidden" name="id" value={invoice.id} />
                    <button className="text-sm font-semibold text-red-700">
                      Delete invoice
                    </button>
                  </form>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-5 text-sm text-[#607066]">
              <p>No invoices stored yet.</p>
              {!clients.length ? (
                <Link href="/dashboard/clients" className="mt-3 inline-flex font-semibold text-[#1f6f56]">
                  Add a client first
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
