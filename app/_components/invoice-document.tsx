import { formatCents } from "@/lib/format";

export type DocInvoice = {
  id: string;
  invoiceNo: string;
  status: string;
  issueDate: string;
  dueDate: string;
  taxRate: number;
  discount: number;
  notes?: string | null;
  client: { name: string; email: string };
  lineItems: { id: string; description: string; quantity: number; unitPrice: number }[];
};

export type DocCompany = {
  name: string;
  email: string;
  address: string | null;
  phone: string | null;
  logoUrl: string | null;
  brandColor: string | null;
};

const DEFAULT_ACCENT = "#4f46e5";

export function InvoiceDocument({
  invoice,
  company,
  currency,
}: {
  invoice: DocInvoice;
  company: DocCompany;
  currency: string;
}) {
  const accent = company.brandColor || DEFAULT_ACCENT;
  const money = (cents: number) => formatCents(cents, currency || "USD");

  const subtotal = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const discounted = Math.max(subtotal - invoice.discount, 0);
  const tax = Math.round((discounted * invoice.taxRate) / 100);
  const total = discounted + tax;

  return (
    <div className="mx-auto w-full max-w-2xl bg-white p-8 text-[#1a1a2e]">
      <div
        className="flex items-start justify-between gap-4 border-b-4 pb-6"
        style={{ borderColor: accent }}
      >
        <div className="flex items-center gap-3">
          {company.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.logoUrl} alt="" className="size-14 rounded-lg object-contain" />
          ) : null}
          <div>
            <p className="text-lg font-bold">{company.name}</p>
            {company.address ? <p className="text-xs text-[#6b7280]">{company.address}</p> : null}
            <p className="text-xs text-[#6b7280]">
              {[company.email, company.phone].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-extrabold tracking-tight" style={{ color: accent }}>
            INVOICE
          </p>
          <p className="mt-1 text-sm font-semibold">{invoice.invoiceNo}</p>
          <span
            className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
            style={{ backgroundColor: `${accent}1a`, color: accent }}
          >
            {invoice.status}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-4 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa0a6]">Bill to</p>
          <p className="mt-1 font-semibold">{invoice.client.name}</p>
          <p className="text-[#6b7280]">{invoice.client.email}</p>
        </div>
        <div className="text-right text-[#6b7280]">
          <p>
            Issue date: <span className="font-medium text-[#1a1a2e]">{invoice.issueDate}</span>
          </p>
          <p>
            Due date: <span className="font-medium text-[#1a1a2e]">{invoice.dueDate}</span>
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-[#f1f2f4]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white" style={{ backgroundColor: accent }}>
              <th className="px-3 py-2 font-semibold">Description</th>
              <th className="px-3 py-2 text-right font-semibold">Qty</th>
              <th className="px-3 py-2 text-right font-semibold">Unit price</th>
              <th className="px-3 py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f2f4]">
            {invoice.lineItems.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2">{item.description}</td>
                <td className="px-3 py-2 text-right text-[#6b7280]">{item.quantity}</td>
                <td className="px-3 py-2 text-right text-[#6b7280]">{money(item.unitPrice)}</td>
                <td className="px-3 py-2 text-right font-semibold">
                  {money(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 ml-auto w-64 space-y-1 text-sm">
        <div className="flex justify-between text-[#6b7280]">
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[#6b7280]">
          <span>Discount</span>
          <span>-{money(invoice.discount)}</span>
        </div>
        <div className="flex justify-between text-[#6b7280]">
          <span>Tax ({invoice.taxRate}%)</span>
          <span>{money(tax)}</span>
        </div>
        <div
          className="flex justify-between border-t-2 pt-2 text-base font-bold"
          style={{ borderColor: accent, color: accent }}
        >
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
      </div>

      {invoice.notes ? (
        <div className="mt-6 border-t border-[#f1f2f4] pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa0a6]">Notes</p>
          <p className="mt-1 text-sm text-[#6b7280]">{invoice.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
