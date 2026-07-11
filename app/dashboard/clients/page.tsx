import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell } from "../_components/dashboard-shell";
import { OnboardingSteps } from "../_components/onboarding-steps";
import {
  AddClientButton,
  DeleteClientButton,
  EditClientButton,
} from "./_components/client-dialog";
import { getClients, getCompanyProfile } from "@/lib/data";
import { requireSyncedUser } from "@/lib/auth-sync";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Store client records, contact details, and invoice relationships for faster billing in Invoicery.",
};

const avatarColors = [
  "bg-[#cdd3fb] text-[#3a3f8f]",
  "bg-[#f9d9df] text-[#a13d3d]",
  "bg-[#d7ebdd] text-[#1f6f56]",
  "bg-[#fbe8cf] text-[#9a6a1f]",
  "bg-[#e8eaee] text-[#4b5563]",
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "?";
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const userId = await requireSyncedUser();
  const [company, clients] = await Promise.all([
    getCompanyProfile(userId),
    getClients(userId),
  ]);

  if (!company) {
    redirect("/dashboard/profile");
  }

  const onboarding = (await searchParams).welcome === "1";

  // Guided onboarding: add the first client, then confirm the workspace is ready.
  if (onboarding) {
    const done = clients.length > 0;
    return (
      <DashboardShell
        active="Clients"
        title={done ? "You're all set" : "Add your first client"}
        subtitle={done ? "Your workspace is ready" : "One more step"}
        companyName={company.name}
      >
        <div className="space-y-6">
          <OnboardingSteps current={done ? 3 : 2} />

          {done ? (
            <div className="grid place-items-center rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] px-6 py-14 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-[var(--dash-primary)] text-[var(--dash-primary-text)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-7">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <h2 className="mt-5 text-2xl font-bold text-[var(--dash-text)]">Your workspace is ready!</h2>
              <p className="mt-2 max-w-md text-sm text-[var(--dash-subtle)]">
                Company profile set and first client added. You can now create and send
                professional invoices.
              </p>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex rounded-xl bg-[var(--dash-primary)] px-6 py-3 text-sm font-semibold text-[var(--dash-primary-text)] shadow-[var(--dash-shadow)] transition hover:bg-[var(--dash-primary-hover)]"
              >
                Go to dashboard
              </Link>
            </div>
          ) : (
            <div className="grid place-items-center rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] px-6 py-14 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-[var(--dash-panel-soft)] text-[var(--dash-primary)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-7">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <h2 className="mt-5 text-2xl font-bold text-[var(--dash-text)]">Add your first client</h2>
              <p className="mt-2 max-w-md text-sm text-[var(--dash-subtle)]">
                A client is anyone you send invoices to. Just their name and email — you can
                add more anytime.
              </p>
              <div className="mt-6">
                <AddClientButton />
              </div>
            </div>
          )}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      active="Clients"
      title="Clients"
      subtitle="Customer records"
      companyName={company?.name}
      actions={<AddClientButton />}
    >
      <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)]">
        <div className="border-b border-[var(--dash-border-soft)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--dash-text)]">All clients</h2>
          <p className="mt-1 text-sm text-[var(--dash-muted)]">
            {clients.length} {clients.length === 1 ? "client" : "clients"} saved for invoicing.
          </p>
        </div>

        {clients.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[var(--dash-muted)]">
                <tr className="border-b border-[var(--dash-border-soft)]">
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Invoices</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--dash-border-soft)]">
                {clients.map((client, index) => (
                  <tr key={client.id} className="transition hover:bg-[var(--dash-hover)]">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                            avatarColors[index % avatarColors.length]
                          }`}
                        >
                          {getInitials(client.name)}
                        </span>
                        <span className="font-semibold text-[var(--dash-text)]">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-[var(--dash-subtle)]">{client.email}</td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-full bg-[var(--dash-panel-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--dash-subtle)]">
                        {client._count.invoices} {client._count.invoices === 1 ? "invoice" : "invoices"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <EditClientButton
                          client={{ id: client.id, name: client.name, email: client.email }}
                        />
                        <DeleteClientButton id={client.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-[var(--dash-panel-soft)] text-[var(--dash-muted)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <p className="text-sm font-semibold text-[var(--dash-text)]">No clients yet</p>
            <p className="text-sm text-[var(--dash-muted)]">Use the New client button to add your first one.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
