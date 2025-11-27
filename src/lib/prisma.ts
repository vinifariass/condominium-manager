import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Log da URL do banco para debug
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 DATABASE_URL configurado:', process.env.DATABASE_URL?.substring(0, 50) + '...')
}
