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
      <div className="rounded-lg border border-[#dbe3d5] bg-white">
        <div className="border-b border-[#e3e9dd] px-5 py-4">
          <h2 className="text-lg font-semibold">All clients</h2>
          <p className="mt-1 text-sm text-[#607066]">
            {clients.length} {clients.length === 1 ? "client" : "clients"} saved for invoicing.
          </p>
        </div>

        {clients.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-[#f7f8f4] text-[#607066]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Invoices</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1e9]">
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-5 py-4 font-semibold">{client.name}</td>
                    <td className="px-5 py-4 text-[#52625a]">{client.email}</td>
                    <td className="px-5 py-4 text-[#52625a]">{client._count.invoices}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-4">
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
          <p className="px-5 py-8 text-sm text-[#607066]">
            No clients yet. Use the New client button to add your first one.
          </p>
        )}
      </div>
    </DashboardShell>
  );
}
