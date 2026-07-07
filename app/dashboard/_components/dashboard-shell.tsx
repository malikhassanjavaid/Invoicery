import Link from "next/link";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Company Profile", href: "/dashboard/profile" },
  { label: "Invoices", href: "/dashboard/invoices" },
  { label: "Clients", href: "/dashboard/clients" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Settings", href: "/dashboard/settings" },
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
  return (
    <main className="min-h-screen bg-[#f4f7ef] text-[#17201b]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-[#dbe3d5] bg-white px-5 py-5 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between lg:block">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <span className="grid size-10 place-items-center rounded-lg bg-[#1f6f56] text-sm font-bold text-white">
                IV
              </span>
              <span className="text-xl">Invoicery</span>
            </Link>
            <span className="rounded-lg bg-[#eef5ec] px-3 py-2 text-xs font-semibold text-[#1f6f56] lg:mt-6 lg:inline-block">
              {companyName ?? "Setup workspace"}
            </span>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  item.label === active
                    ? "bg-[#17201b] text-white"
                    : "text-[#607066] hover:bg-[#eef5ec] hover:text-[#17201b]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 hidden rounded-lg border border-[#dbe3d5] bg-[#f7f8f4] p-4 lg:block">
            <p className="text-sm font-semibold">Next step</p>
            <p className="mt-2 text-sm leading-6 text-[#607066]">
              Add your company profile, then create clients and invoices backed by Neon.
            </p>
            <Link
              href="/dashboard/profile"
              className="mt-4 block rounded-lg bg-[#1f6f56] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Company profile
            </Link>
          </div>
        </aside>

        <section className="flex-1">
          <header className="border-b border-[#dbe3d5] bg-white px-6 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#607066]">{subtitle}</p>
                <h1 className="mt-1 text-3xl font-semibold">{title}</h1>
              </div>
              {actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
            </div>
          </header>

          <div className="px-6 py-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
