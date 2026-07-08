"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { createInvoice, deleteInvoice } from "../../actions";

type DialogState = { ok: boolean; error: string };

const INITIAL_STATE: DialogState = { ok: false, error: "" };

const STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];

const primaryButton =
  "rounded-lg bg-[#1f6f56] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9bb5aa]";
const secondaryButton =
  "rounded-lg border border-[#cfd8ca] bg-white px-5 py-3 text-sm font-semibold text-[#17201b]";
const inputClass =
  "rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]";

function InvoiceDialog({
  clients,
  onClose,
}: {
  clients: { id: string; name: string }[];
  onClose: () => void;
}) {
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
        <form action={formAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Invoice number
            <input name="invoiceNo" required placeholder="INV-1001" className={inputClass} />
          </label>
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
            Issue date
            <input name="issueDate" type="date" required className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Due date
            <input name="dueDate" type="date" required className={inputClass} />
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
            Tax rate (%)
            <input name="taxRate" type="number" min="0" defaultValue="0" className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold md:col-span-2">
            Line item description
            <input name="description" required placeholder="Design retainer" className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Quantity
            <input name="quantity" type="number" min="1" defaultValue="1" required className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Unit price
            <input name="unitPrice" type="number" min="0" step="0.01" required className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Discount
            <input name="discount" type="number" min="0" step="0.01" defaultValue="0" className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold md:col-span-2">
            Notes
            <textarea name="notes" rows={3} className={inputClass} />
          </label>

          {state.error ? (
            <p className="text-sm font-semibold text-[#a13d3d] md:col-span-2">{state.error}</p>
          ) : null}

          <div className="mt-2 flex justify-end gap-3 md:col-span-2">
            <button type="button" onClick={onClose} className={secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={pending} className={primaryButton}>
              {pending ? "Saving..." : "Save invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateInvoiceButton({ clients }: { clients: { id: string; name: string }[] }) {
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
      {open ? <InvoiceDialog clients={clients} onClose={() => setOpen(false)} /> : null}
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
