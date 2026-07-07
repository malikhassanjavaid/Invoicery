type ModelClient = {
  findFirst(args?: unknown): Promise<unknown>;
  findMany(args?: unknown): Promise<unknown>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
};

type DbClient = {
  companyProfile: ModelClient;
  client: ModelClient;
  invoice: ModelClient;
};

type PrismaConstructor = new (args: { adapter: unknown; log: string[] }) => DbClient;

const globalForPrisma = globalThis as unknown as {
  prisma?: DbClient;
};

export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export async function getPrisma() {
  if (!hasDatabaseUrl) {
    throw new Error("DATABASE_URL is missing. Add your Neon connection string first.");
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  neonConfig.webSocketConstructor = ws;

  const prismaModule = (await import("@prisma/client")) as unknown as {
    PrismaClient: PrismaConstructor;
  };
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });

  globalForPrisma.prisma = new prismaModule.PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  return globalForPrisma.prisma;
}
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
