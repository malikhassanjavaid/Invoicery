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

export async function createInvoice(formData: FormData) {
  const userId = await requireUser();
  requireDatabase();
  const prisma = await getPrisma();
  const company = await requireCompany(userId);
  const description = readString(formData, "description");

  await prisma.invoice.create({
    data: {
      companyId: company.id,
      clientId: readString(formData, "clientId"),
      invoiceNo: readString(formData, "invoiceNo"),
      issueDate: new Date(readString(formData, "issueDate")),
      dueDate: new Date(readString(formData, "dueDate")),
      status: readString(formData, "status") || "DRAFT",
      taxRate: Number(formData.get("taxRate") ?? 0),
      discount: toCents(formData.get("discount")),
      notes: readString(formData, "notes") || null,
      lineItems: {
        create: {
          description,
          quantity: Number(formData.get("quantity") ?? 1),
          unitPrice: toCents(formData.get("unitPrice")),
        },
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
