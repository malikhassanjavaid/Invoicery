"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { createInvoice, deleteInvoice } from "../../actions";
import { formatCents } from "@/lib/format";

type DialogState = { ok: boolean; error: string };

type LineItem = { id: number; description: string; quantity: string; unitPrice: string };

const INITIAL_STATE: DialogState = { ok: false, error: "" };

const STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];

const primaryButton =
  "rounded-lg bg-[#1f6f56] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9bb5aa]";
const secondaryButton =
  "rounded-lg border border-[#cfd8ca] bg-white px-5 py-3 text-sm font-semibold text-[#17201b]";
const inputClass =
  "rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]";
const cellInput =
  "w-full rounded-lg border border-[#cfd8ca] px-3 py-2 font-normal outline-none focus:border-[#1f6f56]";

function toCents(value: string) {
  return Math.round((Number(value) || 0) * 100);
}

function InvoiceDialog({
  clients,
  currency,
  onClose,
}: {
  clients: { id: string; name: string }[];
  currency: string;
  onClose: () => void;
}) {
  const nextId = useRef(1);
  const [items, setItems] = useState<LineItem[]>([
    { id: 0, description: "", quantity: "1", unitPrice: "" },
  ]);
  const [taxRate, setTaxRate] = useState("0");
  const [discount, setDiscount] = useState("0");

  const [state, formAction, pending] = useActionState(
    async (_prev: DialogState, formData: FormData): Promise<DialogState> => {
      try {
        await createInvoice(formData);
        return { ok: true, error: "" };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : "Could not create invoice.",
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

  const serializedItems = JSON.stringify(
    items.map(({ description, quantity, unitPrice }) => ({ description, quantity, unitPrice })),
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create invoice"
        className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#dbe3d5] bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">Create invoice</h2>
        <p className="mt-1 text-sm text-[#607066]">
          The invoice number is generated automatically.
        </p>

        <form action={formAction} className="mt-5 grid gap-4">
          <input type="hidden" name="items" value={serializedItems} />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Client
              <select name="clientId" required defaultValue="" className={inputClass}>
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
            <label className="grid gap-2 text-sm font-semibold">
              Status
              <select name="status" defaultValue="DRAFT" className={inputClass}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Issue date
              <input name="issueDate" type="date" required className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Due date
              <input name="dueDate" type="date" required className={inputClass} />
            </label>
          </div>

          {/* Line items */}
          <div className="rounded-lg border border-[#e3e9dd]">
            <div className="flex items-center justify-between border-b border-[#e3e9dd] px-4 py-3">
              <span className="text-sm font-semibold">Items</span>
              <button
                type="button"
                onClick={addItem}
                className="rounded-lg border border-[#cfd8ca] px-3 py-1.5 text-sm font-semibold text-[#1f6f56]"
              >
                + Add item
              </button>
            </div>

            <div className="grid gap-3 p-4">
              {items.map((item, index) => {
                const lineTotal = toCents(item.unitPrice) * (Math.round(Number(item.quantity)) || 0);
                return (
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
                      className={`col-span-2 ${cellInput}`}
                    />
                    <span className="col-span-2 text-right text-sm font-semibold">
                      {money(lineTotal)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      aria-label={`Remove item ${index + 1}`}
                      className="col-span-1 text-center text-lg font-semibold text-[#a13d3d] disabled:opacity-30"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
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
            <label className="grid gap-2 text-sm font-semibold">
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
            <label className="grid gap-2 text-sm font-semibold md:col-span-2">
              Notes
              <textarea name="notes" rows={2} className={inputClass} />
            </label>
          </div>

          {/* Live totals */}
          <div className="grid gap-1 rounded-lg bg-[#f7f8f4] p-4 text-sm">
            <div className="flex justify-between text-[#607066]">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#607066]">
              <span>Discount</span>
              <span>-{money(discountCents)}</span>
            </div>
            <div className="flex justify-between text-[#607066]">
              <span>Tax ({Number(taxRate) || 0}%)</span>
              <span>{money(taxCents)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-[#e3e9dd] pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>

          {state.error ? (
            <p className="text-sm font-semibold text-[#a13d3d]">{state.error}</p>
          ) : null}

          <div className="mt-1 flex justify-end gap-3">
            <button type="button" onClick={onClose} className={secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={pending || !hasValidItems} className={primaryButton}>
              {pending ? "Saving..." : "Save invoice"}
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
}: {
  clients: { id: string; name: string }[];
  currency: string;
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
        <InvoiceDialog clients={clients} currency={currency} onClose={() => setOpen(false)} />
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
