import type { Metadata } from "next";
import { DashboardThemeProvider } from "./_components/dashboard-theme";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard | Invoicery",
  },
  description:
    "Manage company settings, clients, invoices, and billing activity from your Invoicery dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardThemeProvider>{children}</DashboardThemeProvider>;
}
