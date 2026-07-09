import { DashboardShell } from "../_components/dashboard-shell";
import { ProfileForm } from "./_components/profile-form";
import { getCompanyProfile } from "@/lib/data";
import { requireSyncedUser } from "@/lib/auth-sync";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage() {
  const userId = await requireSyncedUser();
  const company = await getCompanyProfile(userId);

  return (
    <DashboardShell
      active="Company Profile"
      title="Company profile"
      subtitle="Stored business details"
      companyName={company?.name}
    >
      <ProfileForm
        company={
          company
            ? {
                name: company.name,
                email: company.email,
                address: company.address,
                country: company.country,
                currency: company.currency,
                brandColor: company.brandColor,
                phone: company.phone,
                logoUrl: company.logoUrl,
              }
            : null
        }
      />
    </DashboardShell>
  );
}
