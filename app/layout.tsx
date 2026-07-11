import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Invoicery",
  title: {
    default: "Invoicery | Professional Invoice Management",
    template: "%s | Invoicery",
  },
  description:
    "Create branded invoices, manage clients, and track billing activity from a clean SaaS dashboard built for growing businesses.",
  keywords: ["invoicing", "invoice software", "client billing", "SaaS invoicing", "Invoicery"],
  authors: [{ name: "Invoicery" }],
  creator: "Invoicery",
  publisher: "Invoicery",
  openGraph: {
    title: "Invoicery | Professional Invoice Management",
    description:
      "Create branded invoices, manage clients, and track billing activity from one polished dashboard.",
    siteName: "Invoicery",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" className={`${poppins.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
