import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export function getPrisma() {
  console.log("DATABASE_URL at runtime is:", process.env.DATABASE_URL ? "SET" : "UNDEFINED");
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL!;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ['error', 'warn'],
    });
  }
  return globalForPrisma.prisma;
}
