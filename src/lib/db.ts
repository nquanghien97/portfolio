import { PrismaClient } from '@/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    // Fallback if DATABASE_URL is not set (e.g. during build-time)
    // We instantiate with a dummy pg pool so PrismaClient constructor doesn't throw
    const dummyPool = new Pool({ connectionString: 'postgresql://dummy:dummy@localhost:5432/dummy' });
    const dummyAdapter = new PrismaPg(dummyPool);
    return new PrismaClient({ adapter: dummyAdapter });
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
