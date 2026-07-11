import Link from "next/link";
import { BrandLogo } from "@/app/_components/brand-logo";
import { DashboardThemeToggle } from "./dashboard-theme";
import { SidebarUser } from "./sidebar-user";

type IconProps = { className?: string };

const icons: Record<string, (props: IconProps) => React.ReactElement> = {
  Dashboard: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  ),
  Clients: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Invoices: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  ),
  "Company Profile": ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 13v.01M9 17v.01" />
    </svg>
  ),
};

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Clients", href: "/dashboard/clients" },
  { label: "Invoices", href: "/dashboard/invoices" },
  { label: "Company Profile", href: "/dashboard/profile" },
];

type DashboardShellProps = {
  active: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  companyName?: string | null;
};

export function DashboardShell({
  active,
  title,
  subtitle,
  children,
  actions,
  companyName,
}: DashboardShellProps) {
  const visibleSidebarItems = companyName
    ? sidebarItems
    : sidebarItems.filter((item) => item.label === "Company Profile");

  return (
    <main className="min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text)] transition-colors">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="flex flex-col border-b border-[var(--dash-border)] bg-[var(--dash-sidebar)] px-4 py-6 transition-colors lg:w-72 lg:border-b-0 lg:border-r">
          <div>
            <div className="px-2">
              <BrandLogo iconSize="sm" />
            </div>

            <div className="mt-6">
              <SidebarUser />
            </div>

            <nav className="mt-6 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {visibleSidebarItems.map((item) => {
                const Icon = icons[item.label];
                const isActive = item.label === active;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-[var(--dash-panel-soft)] text-[var(--dash-text)]"
                        : "text-[var(--dash-muted)] hover:bg-[var(--dash-hover)] hover:text-[var(--dash-text)]"
                    }`}
                  >
                    {Icon ? <Icon className="size-5 shrink-0" /> : null}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 border-t border-[var(--dash-border)] pt-4 lg:mt-auto">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-[var(--dash-muted)]">
              Appearance
            </p>
            <DashboardThemeToggle sidebar />
          </div>
        </aside>

        <section className="flex-1 bg-[var(--dash-bg)] transition-colors">
          <div className="px-6 py-7 lg:px-9 lg:py-9">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--dash-muted)]">{subtitle}</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--dash-text)]">{title}</h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {actions}
              </div>
            </div>

            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
