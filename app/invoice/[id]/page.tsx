import { notFound } from "next/navigation";
import { InvoiceDocument } from "@/app/_components/invoice-document";
import { InvoicePageActions } from "./_components/invoice-page-actions";
import { getInvoiceById } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ download?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  const docInvoice = {
    id: invoice.id,
    invoiceNo: invoice.invoiceNo,
    status: invoice.status,
    issueDate: formatDate(invoice.issueDate),
    dueDate: formatDate(invoice.dueDate),
    taxRate: invoice.taxRate,
    discount: invoice.discount,
    notes: invoice.notes,
    client: invoice.client,
    lineItems: invoice.lineItems,
  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] px-4 py-8 print:bg-white print:p-0">
      <InvoicePageActions autoPrint={sp.download === "1"} />
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#eef0f2] bg-white shadow-[0_10px_40px_rgba(16,24,40,0.08)] print:border-0 print:shadow-none">
        <InvoiceDocument
          invoice={docInvoice}
          company={invoice.company}
          currency={invoice.company.currency ?? "USD"}
        />
      </div>
    </main>
  );
}
