import { DashboardShell } from "../_components/dashboard-shell";
import { getCompanyProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const company = await getCompanyProfile();

  return (
    <DashboardShell
      active="Settings"
      title="Settings"
      subtitle="Workspace configuration"
      companyName={company?.name}
    >
      <div className="rounded-lg border border-[#dbe3d5] bg-white p-6">
        <h2 className="text-xl font-semibold">Database setup</h2>
        <p className="mt-3 max-w-2xl leading-7 text-[#607066]">
          Add your Neon Postgres connection string as DATABASE_URL, then run the
          Prisma scripts to generate the client and push the schema.
        </p>
        <div className="mt-5 rounded-lg bg-[#f7f8f4] p-4 font-mono text-sm text-[#52625a]">
          npm run db:generate
          <br />
          npm run db:push
        </div>
      </div>
    </DashboardShell>
  );
}
