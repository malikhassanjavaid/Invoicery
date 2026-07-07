import { DashboardShell } from "../_components/dashboard-shell";
import { createClient, deleteClient, updateClient } from "../actions";
import { getClients, getCompanyProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const [company, clients] = await Promise.all([getCompanyProfile(), getClients()]);

  return (
    <DashboardShell
      active="Clients"
      title="Clients"
      subtitle="Customer records"
      companyName={company?.name}
    >
      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form action={createClient} className="rounded-lg border border-[#dbe3d5] bg-white p-6">
          <h2 className="text-xl font-semibold">Add client</h2>
          <div className="mt-5 grid gap-4">
            {[
              ["name", "Client name", "text", true],
              ["email", "Email", "email", true],
              ["phone", "Phone", "text", false],
              ["address", "Address", "text", false],
              ["city", "City", "text", false],
              ["country", "Country", "text", false],
            ].map(([name, label, type, required]) => (
              <label key={String(name)} className="grid gap-2 text-sm font-semibold">
                {label}
                <input
                  name={String(name)}
                  type={String(type)}
                  required={Boolean(required)}
                  className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-semibold">
              Notes
              <textarea
                name="notes"
                rows={4}
                className="rounded-lg border border-[#cfd8ca] px-4 py-3 font-normal outline-none focus:border-[#1f6f56]"
              />
            </label>
          </div>
          <button className="mt-5 rounded-lg bg-[#1f6f56] px-5 py-3 text-sm font-semibold text-white">
            Save client
          </button>
        </form>

        <div className="rounded-lg border border-[#dbe3d5] bg-white">
          <div className="border-b border-[#e3e9dd] px-5 py-4">
            <h2 className="text-lg font-semibold">Stored clients</h2>
            <p className="mt-1 text-sm text-[#607066]">
              Client information saved for invoice creation.
            </p>
          </div>

          <div className="divide-y divide-[#edf1e9]">
            {clients.length ? (
              clients.map((client) => (
                <div key={client.id} className="p-5">
                  <form action={updateClient} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="id" value={client.id} />
                    <label className="grid gap-2 text-sm font-semibold">
                      Name
                      <input
                        name="name"
                        required
                        defaultValue={client.name}
                        className="rounded-lg border border-[#cfd8ca] px-3 py-2 font-normal outline-none focus:border-[#1f6f56]"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold">
                      Email
                      <input
                        name="email"
                        type="email"
                        required
                        defaultValue={client.email}
                        className="rounded-lg border border-[#cfd8ca] px-3 py-2 font-normal outline-none focus:border-[#1f6f56]"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold">
                      Phone
                      <input
                        name="phone"
                        defaultValue={client.phone ?? ""}
                        className="rounded-lg border border-[#cfd8ca] px-3 py-2 font-normal outline-none focus:border-[#1f6f56]"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold">
                      City
                      <input
                        name="city"
                        defaultValue={client.city ?? ""}
                        className="rounded-lg border border-[#cfd8ca] px-3 py-2 font-normal outline-none focus:border-[#1f6f56]"
                      />
                    </label>
                    <input type="hidden" name="address" value={client.address ?? ""} />
                    <input type="hidden" name="country" value={client.country ?? ""} />
                    <input type="hidden" name="notes" value={client.notes ?? ""} />
                    <div className="flex items-center gap-3 md:col-span-2">
                      <button className="rounded-lg bg-[#17201b] px-4 py-2 text-sm font-semibold text-white">
                        Update
                      </button>
                      <span className="text-sm text-[#607066]">
                        {client._count.invoices} invoice records
                      </span>
                    </div>
                  </form>
                  <form action={deleteClient} className="mt-3">
                    <input type="hidden" name="id" value={client.id} />
                    <button className="text-sm font-semibold text-red-700">
                      Delete client
                    </button>
                  </form>
                </div>
              ))
            ) : (
              <p className="p-5 text-sm text-[#607066]">
                No clients stored yet. Add one to start creating invoices.
              </p>
            )}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
