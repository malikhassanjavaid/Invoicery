import { getPrisma, hasDatabaseUrl } from "./prisma";

export type StoredCompany = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  taxId: string | null;
  logoUrl: string | null;
};

export type StoredClient = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  _count: {
    invoices: number;
  };
};

export type StoredInvoice = {
  id: string;
  invoiceNo: string;
  issueDate: Date;
  dueDate: Date;
  status: string;
  taxRate: number;
  discount: number;
  notes: string | null;
  client: {
    id: string;
    name: string;
    email: string;
  };
  lineItems: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
};

export async function getCompanyProfile(): Promise<StoredCompany | null> {
  if (!hasDatabaseUrl) {
    return null;
  }

  const prisma = await getPrisma();
  const company = await prisma.companyProfile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  return company as StoredCompany | null;
}

export async function getClients(): Promise<StoredClient[]> {
  if (!hasDatabaseUrl) {
    return [];
  }

  const company = await getCompanyProfile();

  if (!company) {
    return [];
  }

  const prisma = await getPrisma();
  const clients = await prisma.client.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { invoices: true },
      },
    },
  });

  return clients as StoredClient[];
}

export async function getInvoices(): Promise<StoredInvoice[]> {
  if (!hasDatabaseUrl) {
    return [];
  }

  const company = await getCompanyProfile();

  if (!company) {
    return [];
  }

  const prisma = await getPrisma();
  const invoices = await prisma.invoice.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: "desc" },
    include: {
      client: true,
      lineItems: true,
    },
  });

  return invoices as StoredInvoice[];
}

export function getInvoiceSubtotal(invoice: { lineItems: { quantity: number; unitPrice: number }[] }) {
  return invoice.lineItems.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );
}

export function getInvoiceTotal(invoice: {
  discount: number;
  taxRate: number;
  lineItems: { quantity: number; unitPrice: number }[];
}) {
  const subtotal = getInvoiceSubtotal(invoice);
  const discounted = Math.max(subtotal - invoice.discount, 0);
  return discounted + Math.round((discounted * invoice.taxRate) / 100);
}

export async function getDashboardData() {
  const [company, clients, invoices] = await Promise.all([
    getCompanyProfile(),
    getClients(),
    getInvoices(),
  ]);

  const paidRevenue = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((total, invoice) => total + getInvoiceTotal(invoice), 0);

  const outstanding = invoices
    .filter((invoice) => invoice.status === "SENT" || invoice.status === "OVERDUE")
    .reduce((total, invoice) => total + getInvoiceTotal(invoice), 0);

  return {
    company,
    clients,
    invoices,
    metrics: {
      paidRevenue,
      outstanding,
      paidInvoices: invoices.filter((invoice) => invoice.status === "PAID").length,
      activeClients: clients.length,
    },
  };
}
