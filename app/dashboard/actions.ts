"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";
import { toCents } from "@/lib/format";

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

async function requireCompany() {
  const prisma = await getPrisma();
  const company = (await prisma.companyProfile.findFirst({
    orderBy: { createdAt: "asc" },
  })) as CompanyRecord | null;

  if (!company) {
    redirect("/dashboard/profile");
  }

  return company;
}

export async function saveCompanyProfile(formData: FormData) {
  requireDatabase();
  const prisma = await getPrisma();

  const data = {
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    phone: readString(formData, "phone") || null,
    address: readString(formData, "address") || null,
    city: readString(formData, "city") || null,
    country: readString(formData, "country") || null,
    taxId: readString(formData, "taxId") || null,
    logoUrl: readString(formData, "logoUrl") || null,
  };

  if (!data.name || !data.email) {
    throw new Error("Company name and email are required.");
  }

  const existingCompany = (await prisma.companyProfile.findFirst({
    orderBy: { createdAt: "asc" },
  })) as CompanyRecord | null;

  if (existingCompany) {
    await prisma.companyProfile.update({
      where: { id: existingCompany.id },
      data,
    });
  } else {
    await prisma.companyProfile.create({ data });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  redirect("/dashboard");
}

export async function createClient(formData: FormData) {
  requireDatabase();
  const prisma = await getPrisma();
  const company = await requireCompany();

  await prisma.client.create({
    data: {
      companyId: company.id,
      name: readString(formData, "name"),
      email: readString(formData, "email"),
      phone: readString(formData, "phone") || null,
      address: readString(formData, "address") || null,
      city: readString(formData, "city") || null,
      country: readString(formData, "country") || null,
      notes: readString(formData, "notes") || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clients");
}

export async function updateClient(formData: FormData) {
  requireDatabase();
  const prisma = await getPrisma();

  const id = readString(formData, "id");

  await prisma.client.update({
    where: { id },
    data: {
      name: readString(formData, "name"),
      email: readString(formData, "email"),
      phone: readString(formData, "phone") || null,
      address: readString(formData, "address") || null,
      city: readString(formData, "city") || null,
      country: readString(formData, "country") || null,
      notes: readString(formData, "notes") || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clients");
}

export async function deleteClient(formData: FormData) {
  requireDatabase();
  const prisma = await getPrisma();

  await prisma.client.delete({
    where: { id: readString(formData, "id") },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clients");
}

export async function createInvoice(formData: FormData) {
  requireDatabase();
  const prisma = await getPrisma();
  const company = await requireCompany();
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
  requireDatabase();
  const prisma = await getPrisma();

  await prisma.invoice.update({
    where: { id: readString(formData, "id") },
    data: {
      status: readString(formData, "status") || "DRAFT",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
}

export async function deleteInvoice(formData: FormData) {
  requireDatabase();
  const prisma = await getPrisma();

  await prisma.invoice.delete({
    where: { id: readString(formData, "id") },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
}
