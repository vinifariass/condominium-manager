import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function updatePasswords() {
  console.log('🔑 Atualizando senhas dos usuários...')

  const hashedPassword = await bcrypt.hash('123456', 10)

  const users = [
    'admin@condely.com',
    'manager@condely.com',
    'employee@condely.com',
    'resident1@condely.com',
    'resident2@condely.com',
  ]

  for (const email of users) {
    try {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      })
      console.log(`✅ Senha atualizada para: ${email}`)
    } catch (error: any) {
      console.log(`❌ Erro ao atualizar ${email}:`, error.message)
    }
  }

  console.log('✅ Atualização de senhas concluída!')
  await prisma.$disconnect()
}

updatePasswords()
