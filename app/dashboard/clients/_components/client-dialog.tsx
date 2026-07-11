"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { createClient, deleteClient, updateClient } from "../../actions";

type ClientAction = (formData: FormData) => Promise<void>;

type DialogState = { ok: boolean; error: string };

const INITIAL_STATE: DialogState = { ok: false, error: "" };

const primaryButton =
  "inline-flex items-center gap-2 rounded-xl bg-[var(--dash-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--dash-primary-text)] transition hover:bg-[var(--dash-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton =
  "rounded-xl border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2.5 text-sm font-semibold text-[var(--dash-text)] transition hover:bg-[var(--dash-hover)]";
const inputClass =
  "rounded-xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] px-4 py-2.5 font-normal text-[var(--dash-text)] outline-none transition placeholder:text-[var(--dash-muted)] focus:border-[var(--dash-primary)]";
const iconButton =
  "grid size-9 place-items-center rounded-lg text-[var(--dash-subtle)] transition hover:bg-[var(--dash-hover)] hover:text-[var(--dash-text)] disabled:opacity-40";
const deleteIconButton =
  "grid size-9 place-items-center rounded-lg text-[var(--dash-subtle)] transition hover:bg-[var(--dash-danger-soft)] hover:text-[var(--dash-danger)] disabled:opacity-40";

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
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

function ClientDialog({
  title,
  submitLabel,
  action,
  onClose,
  defaults,
}: {
  title: string;
  submitLabel: string;
  action: ClientAction;
  onClose: () => void;
  defaults?: { id?: string; name?: string; email?: string };
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: DialogState, formData: FormData): Promise<DialogState> => {
      try {
        await action(formData);
        return { ok: true, error: "" };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : "Could not save client.",
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
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 text-[var(--dash-text)] shadow-[var(--dash-shadow)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-[var(--dash-text)]">{title}</h2>
        <form action={formAction} className="mt-5 grid gap-4">
          {defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}
          <label className="grid gap-2 text-sm font-semibold text-[var(--dash-text)]">
            Client name
            <input name="name" required defaultValue={defaults?.name ?? ""} className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--dash-text)]">
            Email
            <input
              name="email"
              type="email"
              required
              defaultValue={defaults?.email ?? ""}
              className={inputClass}
            />
          </label>
          {state.error ? (
            <p className="text-sm font-semibold text-[var(--dash-danger)]">{state.error}</p>
          ) : null}
          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className={secondaryButton}>
              Cancel
            </button>
            <button type="submit" disabled={pending} className={primaryButton}>
              {pending ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddClientButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={primaryButton}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
          <path d="M12 5v14M5 12h14" />
        </svg>
        New client
      </button>
      {open ? (
        <ClientDialog
          title="New client"
          submitLabel="Create client"
          action={createClient}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

export function EditClientButton({
  client,
}: {
  client: { id: string; name: string; email: string };
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} title="Edit client" aria-label="Edit client" className={iconButton}>
        <PencilIcon />
      </button>
      {open ? (
        <ClientDialog
          title="Edit client"
          submitLabel="Save changes"
          action={updateClient}
          defaults={client}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

export function DeleteClientButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDelete() {
    const formData = new FormData();
    formData.set("id", id);
    startTransition(() => {
      deleteClient(formData);
      setConfirmOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => setConfirmOpen(true)}
        title="Delete client"
        aria-label="Delete client"
        className={deleteIconButton}
      >
        <TrashIcon />
      </button>
      {confirmOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setConfirmOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Delete client"
            className="w-full max-w-sm rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 text-[var(--dash-text)] shadow-[var(--dash-shadow)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-bold">Delete this client?</h2>
            <p className="mt-2 text-sm text-[var(--dash-muted)]">This cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmOpen(false)} className={secondaryButton}>
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
    </>
  );
}
