import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
  throw new Error("Database URL is missing.");
}

declare global {
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  const adapter = new PrismaPg({
    connectionString: databaseURL,
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn", "query"]
        : ["error"],
  });
};

const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV === "production") {
  globalThis.prisma = prisma;
}

export default prisma;
