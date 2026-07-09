import { redirect } from "next/navigation";
import { DashboardShell } from "../_components/dashboard-shell";
import {
  AddClientButton,
  DeleteClientButton,
  EditClientButton,
} from "./_components/client-dialog";
import { getClients, getCompanyProfile } from "@/lib/data";
import { requireSyncedUser } from "@/lib/auth-sync";

export const dynamic = "force-dynamic";

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

export default async function ClientsPage() {
  const userId = await requireSyncedUser();
  const [company, clients] = await Promise.all([
    getCompanyProfile(userId),
    getClients(userId),
  ]);

  if (!company) {
    redirect("/dashboard/profile");
  }

  return (
    <DashboardShell
      active="Clients"
      title="Clients"
      subtitle="Customer records"
      companyName={company?.name}
      actions={<AddClientButton />}
    >
      <div className="rounded-2xl border border-[#eef0f2] bg-white">
        <div className="border-b border-[#f1f2f4] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1a1a2e]">All clients</h2>
          <p className="mt-1 text-sm text-[#9aa0a6]">
            {clients.length} {clients.length === 1 ? "client" : "clients"} saved for invoicing.
          </p>
        </div>

        {clients.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[#9aa0a6]">
                <tr className="border-b border-[#f1f2f4]">
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Invoices</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f5f6]">
                {clients.map((client, index) => (
                  <tr key={client.id} className="transition hover:bg-[#fafbfc]">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                            avatarColors[index % avatarColors.length]
                          }`}
                        >
                          {getInitials(client.name)}
                        </span>
                        <span className="font-semibold text-[#1a1a2e]">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-[#6b7280]">{client.email}</td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-full bg-[#f1f2f4] px-2.5 py-1 text-xs font-semibold text-[#6b7280]">
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
            <span className="grid size-12 place-items-center rounded-full bg-[#f1f2f4] text-[#9aa0a6]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <p className="text-sm font-semibold text-[#1a1a2e]">No clients yet</p>
            <p className="text-sm text-[#9aa0a6]">Use the New client button to add your first one.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
