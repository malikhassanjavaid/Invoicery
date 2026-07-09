"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";
import { toCents } from "@/lib/format";
import { requireSyncedUser } from "@/lib/auth-sync";

function requireDatabase() {
  if (!hasDatabaseUrl) {
    throw new Error("DATABASE_URL is missing. Add your Neon connection string first.");
  }
}

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

type CompanyRecord = {
  id: string;
};

async function requireUser() {
  return requireSyncedUser();
}

async function requireCompany(userId: string) {
  const prisma = await getPrisma();
  const company = (await prisma.companyProfile.findFirst({
    where: { clerkUserId: userId },
    orderBy: { createdAt: "asc" },
  })) as CompanyRecord | null;

  if (!company) {
    redirect("/dashboard/profile");
  }

  return company;
}

export async function saveCompanyProfile(formData: FormData) {
  const userId = await requireUser();
  requireDatabase();
  const prisma = await getPrisma();

  const data = {
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    address: readString(formData, "address") || null,
    country: readString(formData, "country") || null,
    currency: readString(formData, "currency") || null,
    brandColor: readString(formData, "brandColor") || null,
    phone: readString(formData, "phone") || null,
    logoUrl: readString(formData, "logoUrl") || null,
  };

  if (!data.name || !data.email || !data.address || !data.country || !data.currency) {
    throw new Error("Company name, email, address, country, and currency are required.");
  }

  const existingCompany = (await prisma.companyProfile.findFirst({
    where: { clerkUserId: userId },
    orderBy: { createdAt: "asc" },
  })) as CompanyRecord | null;

  if (existingCompany) {
    await prisma.companyProfile.update({
      where: { id: existingCompany.id },
      data,
    });
  } else {
    await prisma.companyProfile.create({
      data: {
        ...data,
        clerkUserId: userId,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  redirect("/dashboard");
}

export async function createClient(formData: FormData) {
  const userId = await requireUser();
  requireDatabase();
  const prisma = await getPrisma();
  const company = await requireCompany(userId);

  const name = readString(formData, "name");
  const email = readString(formData, "email");

  if (!name || !email) {
    throw new Error("Client name and email are required.");
  }

  await prisma.client.create({
    data: {
      companyId: company.id,
      name,
      email,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clients");
}

export async function updateClient(formData: FormData) {
  const userId = await requireUser();
  requireDatabase();
  const prisma = await getPrisma();
  const company = await requireCompany(userId);

  const id = readString(formData, "id");
  const name = readString(formData, "name");
  const email = readString(formData, "email");

  if (!name || !email) {
    throw new Error("Client name and email are required.");
  }

  await prisma.client.updateMany({
    where: { id, companyId: company.id },
    data: {
      name,
      email,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clients");
}

export async function deleteClient(formData: FormData) {
  const userId = await requireUser();
  requireDatabase();
  const prisma = await getPrisma();
  const company = await requireCompany(userId);

  await prisma.client.deleteMany({
    where: { id: readString(formData, "id"), companyId: company.id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clients");
}

type LineItemInput = {
  description?: string;
  quantity?: string | number;
  unitPrice?: string | number;
};

function parseLineItems(formData: FormData) {
  let raw: LineItemInput[] = [];
  try {
    raw = JSON.parse(readString(formData, "items") || "[]") as LineItemInput[];
  } catch {
    raw = [];
  }

  return raw
    .map((item) => ({
      description: String(item.description ?? "").trim(),
      quantity: Math.max(1, Math.round(Number(item.quantity ?? 1)) || 1),
      unitPrice: toCents(String(item.unitPrice ?? "0")),
    }))
    .filter((item) => item.description && item.unitPrice >= 0);
}

// Generate the next sequential invoice number for a company (e.g. INV-0007),
// so users never type one manually.
async function nextInvoiceNo(
  prisma: Awaited<ReturnType<typeof getPrisma>>,
  companyId: string,
) {
  const existing = (await prisma.invoice.findMany({
    where: { companyId },
  })) as { invoiceNo: string }[];

  let max = 0;
  for (const invoice of existing) {
    const match = /(\d+)\s*$/.exec(invoice.invoiceNo ?? "");
    if (match) {
      max = Math.max(max, Number(match[1]));
    }
  }

  return `INV-${String(max + 1).padStart(4, "0")}`;
}

export async function createInvoice(formData: FormData) {
  const userId = await requireUser();
  requireDatabase();
  const prisma = await getPrisma();
  const company = await requireCompany(userId);

  const lineItems = parseLineItems(formData);
  if (!lineItems.length) {
    throw new Error("Add at least one item with a description and price.");
  }

  const invoiceNo = await nextInvoiceNo(prisma, company.id);

  await prisma.invoice.create({
    data: {
      companyId: company.id,
      clientId: readString(formData, "clientId"),
      invoiceNo,
      issueDate: new Date(readString(formData, "issueDate")),
      dueDate: new Date(readString(formData, "dueDate")),
      status: readString(formData, "status") || "DRAFT",
      taxRate: Number(formData.get("taxRate") ?? 0),
      discount: toCents(formData.get("discount")),
      notes: readString(formData, "notes") || null,
      lineItems: {
        create: lineItems,
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
}

export async function updateInvoice(formData: FormData) {
  const userId = await requireUser();
  requireDatabase();
  const prisma = await getPrisma();
  const company = await requireCompany(userId);

  const id = readString(formData, "id");
  const lineItems = parseLineItems(formData);
  if (!lineItems.length) {
    throw new Error("Add at least one item with a description and price.");
  }

  // Confirm the invoice belongs to this company before mutating it.
  const existing = (await prisma.invoice.findFirst({
    where: { id, companyId: company.id },
  })) as { id: string } | null;
  if (!existing) {
    throw new Error("Invoice not found.");
  }

  await prisma.invoice.update({
    where: { id },
    data: {
      clientId: readString(formData, "clientId"),
      issueDate: new Date(readString(formData, "issueDate")),
      dueDate: new Date(readString(formData, "dueDate")),
      status: readString(formData, "status") || "DRAFT",
      taxRate: Number(formData.get("taxRate") ?? 0),
      discount: toCents(formData.get("discount")),
      notes: readString(formData, "notes") || null,
      lineItems: {
        deleteMany: {},
        create: lineItems,
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
}

export async function updateInvoiceStatus(formData: FormData) {
  const userId = await requireUser();
  requireDatabase();
  const prisma = await getPrisma();
  const company = await requireCompany(userId);

  await prisma.invoice.updateMany({
    where: { id: readString(formData, "id"), companyId: company.id },
    data: {
      status: readString(formData, "status") || "DRAFT",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
}

export async function deleteInvoice(formData: FormData) {
  const userId = await requireUser();
  requireDatabase();
  const prisma = await getPrisma();
  const company = await requireCompany(userId);

  await prisma.invoice.deleteMany({
    where: { id: readString(formData, "id"), companyId: company.id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
}
