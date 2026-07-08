"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { createClient, deleteClient, updateClient } from "../../actions";

type ClientAction = (formData: FormData) => Promise<void>;

type DialogState = { ok: boolean; error: string };

const INITIAL_STATE: DialogState = { ok: false, error: "" };

const primaryButton =
  "rounded-lg bg-[#1f6f56] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9bb5aa]";
const secondaryButton =
  "rounded-lg border border-[#cfd8ca] bg-white px-5 py-3 text-sm font-semibold text-[#17201b]";
const inputClass =
  "rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]";

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
        className="w-full max-w-md rounded-lg border border-[#dbe3d5] bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <form action={formAction} className="mt-5 grid gap-4">
          {defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}
          <label className="grid gap-2 text-sm font-semibold">
            Client name
            <input name="name" required defaultValue={defaults?.name ?? ""} className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
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
            <p className="text-sm font-semibold text-[#a13d3d]">{state.error}</p>
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-[#1f6f56] hover:underline"
      >
        Edit
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

  function handleDelete() {
    if (!confirm("Delete this client? This cannot be undone.")) return;
    const formData = new FormData();
    formData.set("id", id);
    startTransition(() => deleteClient(formData));
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
