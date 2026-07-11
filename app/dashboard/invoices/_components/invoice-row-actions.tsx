"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { deleteInvoice } from "../../actions";
import { InvoiceDialog, type EditInvoice } from "./invoice-dialog";
import { InvoiceDocument, type DocCompany, type DocInvoice } from "@/app/_components/invoice-document";

const iconButton =
  "grid size-9 place-items-center rounded-lg text-[var(--dash-subtle)] transition hover:bg-[var(--dash-hover)] hover:text-[var(--dash-text)] disabled:opacity-40";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function menuIcon(path: string) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d={path} />
    </svg>
  );
}

export function InvoiceRowActions({
  invoice,
  company,
  currency,
  clients,
  editInvoice,
}: {
  invoice: DocInvoice;
  company: DocCompany;
  currency: string;
  clients: { id: string; name: string }[];
  editInvoice: EditInvoice;
}) {
  const [preview, setPreview] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const invoiceUrl = () =>
    typeof window !== "undefined" ? `${window.location.origin}/invoice/${invoice.id}` : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(invoiceUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable; ignore.
    }
  }

  function handleDownload() {
    window.open(`/invoice/${invoice.id}?download=1`, "_blank");
    setMenuOpen(false);
  }

  function handleEmail() {
    const link = invoiceUrl();
    const subject = `Invoice ${invoice.invoiceNo} from ${company.name}`;
    const body = `Hi ${invoice.client.name},\n\nPlease find your invoice ${invoice.invoiceNo}.\n\nView & download: ${link}\n\nThank you,\n${company.name}`;
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      invoice.client.email,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
    setMenuOpen(false);
  }

  function handleDelete() {
    const formData = new FormData();
    formData.set("id", invoice.id);
    startTransition(() => {
      deleteInvoice(formData);
      setConfirmOpen(false);
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Edit */}
      <button type="button" onClick={() => setEditOpen(true)} title="Edit invoice" aria-label="Edit invoice" className={iconButton}>
        <PencilIcon />
      </button>

      {/* Preview */}
      <button type="button" onClick={() => setPreview(true)} title="Preview invoice" aria-label="Preview invoice" className={iconButton}>
        <EyeIcon />
      </button>

      {/* Share */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          title="Share invoice"
          aria-label="Share invoice"
          className={iconButton}
        >
          <ShareIcon />
        </button>
        {menuOpen ? (
          <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-1 shadow-[var(--dash-shadow)]">
            <button
              type="button"
              onClick={handleCopy}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--dash-text)] hover:bg-[var(--dash-hover)]"
            >
              {menuIcon("M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M13 11h6 M16 8l3 3-3 3")}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--dash-text)] hover:bg-[var(--dash-hover)]"
            >
              {menuIcon("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3")}
              Download invoice
            </button>
            <button
              type="button"
              onClick={handleEmail}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--dash-text)] hover:bg-[var(--dash-hover)]"
            >
              {menuIcon("M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M22 6l-10 7L2 6")}
              Send via email
            </button>
          </div>
        ) : null}
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={pending}
        title="Delete invoice"
        aria-label="Delete invoice"
        className="grid size-9 place-items-center rounded-lg text-[var(--dash-subtle)] transition hover:bg-[var(--dash-danger-soft)] hover:text-[var(--dash-danger)] disabled:opacity-40"
      >
        <TrashIcon />
      </button>

      {/* Delete confirmation */}
      {confirmOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setConfirmOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Delete invoice"
            className="w-full max-w-sm rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 text-[var(--dash-text)] shadow-[var(--dash-shadow)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-bold">Delete this invoice?</h2>
            <p className="mt-2 text-sm text-[var(--dash-muted)]">This cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2.5 text-sm font-semibold text-[var(--dash-text)] transition hover:bg-[var(--dash-hover)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={handleDelete}
                className="rounded-xl bg-[var(--dash-danger)] px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
              >
                {pending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Preview modal */}
      {preview ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setPreview(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Invoice preview"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] shadow-[var(--dash-shadow)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--dash-border-soft)] px-5 py-3">
              <span className="text-sm font-semibold text-[var(--dash-text)]">Invoice preview</span>
              <button
                type="button"
                onClick={() => setPreview(false)}
                aria-label="Close"
                className="grid size-8 place-items-center rounded-lg text-[var(--dash-muted)] transition hover:bg-[var(--dash-hover)] hover:text-[var(--dash-text)]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <InvoiceDocument invoice={invoice} company={company} currency={currency} />
          </div>
        </div>
      ) : null}

      {/* Edit dialog */}
      {editOpen ? (
        <InvoiceDialog
          mode="edit"
          invoice={editInvoice}
          clients={clients}
          currency={currency}
          company={company}
          onClose={() => setEditOpen(false)}
        />
      ) : null}
    </div>
  );
}
