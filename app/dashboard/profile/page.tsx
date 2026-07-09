import { DashboardShell } from "../_components/dashboard-shell";
import { OnboardingSteps } from "../_components/onboarding-steps";
import { ProfileForm } from "./_components/profile-form";
import { getCompanyProfile } from "@/lib/data";
import { requireSyncedUser } from "@/lib/auth-sync";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage() {
  const userId = await requireSyncedUser();
  const company = await getCompanyProfile(userId);
  const onboarding = !company;

  return (
    <DashboardShell
      active="Company Profile"
      title={onboarding ? "Welcome to Invoicery" : "Company profile"}
      subtitle={onboarding ? "Let's set up your workspace" : "Stored business details"}
      companyName={company?.name}
    >
      {onboarding ? (
        <div className="mb-6 space-y-5">
          <OnboardingSteps current={1} />
          <div>
            <h2 className="text-xl font-bold text-[#1a1a2e]">Step 1 — Set up your company</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              These details appear on your invoices. You can change them anytime.
            </p>
          </div>
        </div>
      ) : null}

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
