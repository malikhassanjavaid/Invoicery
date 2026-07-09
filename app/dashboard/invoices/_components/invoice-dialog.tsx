"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { createInvoice, deleteInvoice, updateInvoice } from "../../actions";
import { formatCents } from "@/lib/format";

type DialogState = { ok: boolean; error: string };

type LineItem = { id: number; description: string; quantity: string; unitPrice: string };

type Company = { name: string; logoUrl: string | null; brandColor: string | null };

export type EditInvoice = {
  id: string;
  clientId: string;
  status: string;
  issueDate: string;
  dueDate: string;
  taxRate: number;
  discount: string;
  notes: string;
  lineItems: { description: string; quantity: string; unitPrice: string }[];
};

const INITIAL_STATE: DialogState = { ok: false, error: "" };

const STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];
const DEFAULT_ACCENT = "#4f46e5";

const primaryButton =
  "rounded-xl bg-[#1a1a2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a2a42] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton =
  "rounded-xl border border-[#e5e7eb] bg-white px-5 py-2.5 text-sm font-semibold text-[#1a1a2e] transition hover:bg-[#f7f7f8]";
const inputClass =
  "rounded-xl border border-[#e5e7eb] px-4 py-2.5 font-normal text-[#1a1a2e] outline-none transition focus:border-[#1a1a2e]";
const cellInput =
  "w-full rounded-lg border border-[#e5e7eb] px-3 py-2 font-normal text-[#1a1a2e] outline-none transition focus:border-[#1a1a2e]";

function toCents(value: string) {
  return Math.round((Number(value) || 0) * 100);
}

export function InvoiceDialog({
  clients,
  currency,
  company,
  onClose,
  mode = "create",
  invoice,
}: {
  clients: { id: string; name: string }[];
  currency: string;
  company: Company;
  onClose: () => void;
  mode?: "create" | "edit";
  invoice?: EditInvoice;
}) {
  const isEdit = mode === "edit";
  const nextId = useRef(invoice?.lineItems.length ?? 1);
  const [items, setItems] = useState<LineItem[]>(() =>
    invoice && invoice.lineItems.length
      ? invoice.lineItems.map((item, index) => ({
          id: index,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }))
      : [{ id: 0, description: "", quantity: "1", unitPrice: "" }],
  );
  const [taxRate, setTaxRate] = useState(invoice ? String(invoice.taxRate) : "0");
  const [discount, setDiscount] = useState(invoice ? invoice.discount : "0");
  const [clientId, setClientId] = useState(invoice ? invoice.clientId : "");
  const [status, setStatus] = useState(invoice ? invoice.status : "DRAFT");
  const [issueDate, setIssueDate] = useState(invoice ? invoice.issueDate : "");
  const [dueDate, setDueDate] = useState(invoice ? invoice.dueDate : "");

  const [state, formAction, pending] = useActionState(
    async (_prev: DialogState, formData: FormData): Promise<DialogState> => {
      try {
        await (isEdit ? updateInvoice : createInvoice)(formData);
        return { ok: true, error: "" };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : "Could not save invoice.",
        };
      }
    },
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: nextId.current++, description: "", quantity: "1", unitPrice: "" },
    ]);
  }

  function updateItem(id: number, field: keyof LineItem, value: string) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function removeItem(id: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  }

  const accent = company.brandColor || DEFAULT_ACCENT;
  const money = (cents: number) => formatCents(cents, currency);

  const subtotal = items.reduce(
    (sum, item) => sum + toCents(item.unitPrice) * (Math.round(Number(item.quantity)) || 0),
    0,
  );
  const discountCents = toCents(discount);
  const discounted = Math.max(subtotal - discountCents, 0);
  const taxCents = Math.round((discounted * (Number(taxRate) || 0)) / 100);
  const total = discounted + taxCents;

  const hasValidItems = items.some(
    (item) => item.description.trim() && toCents(item.unitPrice) > 0,
  );

  const clientName = clients.find((client) => client.id === clientId)?.name ?? "";

  const serializedItems = JSON.stringify(
    items.map(({ description, quantity, unitPrice }) => ({ description, quantity, unitPrice })),
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit invoice" : "Create invoice"}
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#eef0f2] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1a1a2e]">
              {isEdit ? "Edit invoice" : "Create invoice"}
            </h2>
            <p className="mt-1 text-sm text-[#9aa0a6]">
              {isEdit
                ? "Update the invoice details below."
                : "The invoice number is generated automatically."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-lg text-[#9aa0a6] transition hover:bg-[#f1f2f4] hover:text-[#1a1a2e]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form action={formAction} className="mt-5">
          <input type="hidden" name="items" value={serializedItems} />
          {isEdit && invoice ? <input type="hidden" name="id" value={invoice.id} /> : null}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT: form */}
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#1a1a2e]">
                  Client
                  <select
                    name="clientId"
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select client
                    </option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#1a1a2e]">
                  Status
                  <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={inputClass}
                  >
                    {STATUSES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#1a1a2e]">
                  Issue date
                  <input
                    name="issueDate"
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#1a1a2e]">
                  Due date
                  <input
                    name="dueDate"
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              {/* Line items */}
              <div className="rounded-xl border border-[#eef0f2]">
                <div className="flex items-center justify-between border-b border-[#f1f2f4] px-4 py-3">
                  <span className="text-sm font-semibold text-[#1a1a2e]">Items</span>
                  <button
                    type="button"
                    onClick={addItem}
                    className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-sm font-semibold text-[#1a1a2e] hover:bg-[#f7f7f8]"
                  >
                    + Add item
                  </button>
                </div>
                <div className="grid gap-3 p-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 items-center gap-2">
                      <input
                        aria-label={`Item ${index + 1} description`}
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        className={`col-span-5 ${cellInput}`}
                      />
                      <input
                        aria-label={`Item ${index + 1} quantity`}
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                        className={`col-span-2 ${cellInput}`}
                      />
                      <input
                        aria-label={`Item ${index + 1} unit price`}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                        className={`col-span-3 ${cellInput}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        aria-label={`Remove item ${index + 1}`}
                        className="col-span-2 text-center text-lg font-semibold text-[#a13d3d] disabled:opacity-30"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#1a1a2e]">
                  Tax rate (%)
                  <input
                    name="taxRate"
                    type="number"
                    min="0"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#1a1a2e]">
                  Discount
                  <input
                    name="discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#1a1a2e] sm:col-span-2">
                  Notes
                  <textarea name="notes" rows={2} defaultValue={invoice?.notes ?? ""} className={inputClass} />
                </label>
              </div>

              {state.error ? (
                <p className="text-sm font-semibold text-[#a13d3d]">{state.error}</p>
              ) : null}
            </div>

            {/* RIGHT: live preview */}
            <div className="lg:sticky lg:top-0 lg:self-start">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9aa0a6]">
                Live preview
              </p>
              <div className="overflow-hidden rounded-2xl border border-[#eef0f2] shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <div className="h-2" style={{ backgroundColor: accent }} />
                <div className="bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {company.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={company.logoUrl} alt="" className="size-9 rounded-md object-contain" />
                      ) : null}
                      <p className="text-sm font-bold text-[#1a1a2e]">{company.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold tracking-tight" style={{ color: accent }}>
                        INVOICE
                      </p>
                      <p className="text-[11px] text-[#9aa0a6]">No. auto-generated</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between gap-4 text-[11px]">
                    <div>
                      <p className="font-semibold text-[#9aa0a6]">Bill to</p>
                      <p className="mt-0.5 font-semibold text-[#1a1a2e]">{clientName || "—"}</p>
                    </div>
                    <div className="text-right text-[#6b7280]">
                      <p>
                        Issue: <span className="font-medium text-[#1a1a2e]">{issueDate || "—"}</span>
                      </p>
                      <p>
                        Due: <span className="font-medium text-[#1a1a2e]">{dueDate || "—"}</span>
                      </p>
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
                      {items.map((item) => {
                        const qty = Math.round(Number(item.quantity)) || 0;
                        const line = toCents(item.unitPrice) * qty;
                        return (
                          <div key={item.id} className="flex items-start justify-between gap-2 px-3 py-2 text-[11px]">
                            <div className="min-w-0">
                              <p className="truncate text-[#1a1a2e]">{item.description || "Item"}</p>
                              <p className="text-[10px] text-[#9aa0a6]">
                                {qty} × {money(toCents(item.unitPrice))}
                              </p>
                            </div>
                            <span className="shrink-0 font-semibold text-[#1a1a2e]">{money(line)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 ml-auto grid w-full max-w-[220px] gap-1 text-[11px]">
                    <div className="flex justify-between text-[#6b7280]">
                      <span>Subtotal</span>
                      <span>{money(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#6b7280]">
                      <span>Discount</span>
                      <span>-{money(discountCents)}</span>
                    </div>
                    <div className="flex justify-between text-[#6b7280]">
                      <span>Tax ({Number(taxRate) || 0}%)</span>
                      <span>{money(taxCents)}</span>
                    </div>
                    <div
                      className="mt-1 flex justify-between border-t border-[#eef0f2] pt-1 text-sm font-bold"
                      style={{ color: accent }}
                    >
                      <span>Total</span>
                      <span>{money(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className={secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={pending || !hasValidItems} className={primaryButton}>
              {pending ? "Saving..." : isEdit ? "Save changes" : "Save invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateInvoiceButton({
  clients,
  currency,
  company,
}: {
  clients: { id: string; name: string }[];
  currency: string;
  company: Company;
}) {
  const [open, setOpen] = useState(false);
  const canCreate = clients.length > 0;

  return (
    <>
      <button
        type="button"
        disabled={!canCreate}
        title={canCreate ? undefined : "Add a client first"}
        onClick={() => setOpen(true)}
        className={primaryButton}
      >
        Create invoice
      </button>
      {open ? (
        <InvoiceDialog
          clients={clients}
          currency={currency}
          company={company}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

export function DeleteInvoiceButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    const formData = new FormData();
    formData.set("id", id);
    startTransition(() => deleteInvoice(formData));
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleDelete}
      className="text-sm font-semibold text-[#a13d3d] hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
