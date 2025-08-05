import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { seedCondominiums } from './seed-condominiums'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeding...')

  // Deletar dados existentes
  console.log('🗑️  Limpando dados existentes...')
  await prisma.apartment.deleteMany()
  await prisma.user.deleteMany()
  await prisma.condominium.deleteMany()

  // Criar condomínios dos recibos
  console.log('🏢 Criando condomínios dos recibos...')
  await seedCondominiums()

  // Pegar o primeiro condomínio para os usuários demo
  const firstCondominium = await prisma.condominium.findFirst()
  
  if (!firstCondominium) {
    throw new Error('Nenhum condomínio criado')
  }

  // Criar apartamentos
  console.log('🏠 Criando bloco e apartamentos...')
  
  // Primeiro criar o bloco
  const block = await prisma.block.create({
    data: {
      name: 'Bloco A',
      description: 'Bloco principal do condomínio',
      condominiumId: firstCondominium.id,
    },
  })

  const apartments = []
  for (let i = 1; i <= 5; i++) {
    const apartment = await prisma.apartment.create({
      data: {
        number: `${i}01`,
        floor: i,
        blockId: block.id,
        condominiumId: firstCondominium.id,
      },
    })
    apartments.push(apartment)
  }

  // Criar usuários
  console.log('👥 Criando usuários...')
  
  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Sistema',
      email: 'admin@condely.com',
      phone: '(11) 99999-0001',
      role: 'ADMIN',
      condominiumId: firstCondominium.id,
    },
  })

  // Manager
  const manager = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'manager@condely.com',
      phone: '(11) 99999-0002',
      role: 'MANAGER',
      condominiumId: firstCondominium.id,
    },
  })

  // Employee
  const employee = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'employee@condely.com',
      phone: '(11) 99999-0003',
      role: 'EMPLOYEE',
      condominiumId: firstCondominium.id,
    },
  })

  // Residents
  const resident1 = await prisma.user.create({
    data: {
      name: 'Carlos Oliveira',
      email: 'resident1@condely.com',
      phone: '(11) 99999-0004',
      role: 'RESIDENT',
      condominiumId: firstCondominium.id,
    },
  })

  const resident2 = await prisma.user.create({
    data: {
      name: 'Ana Costa',
      email: 'resident2@condely.com',
      phone: '(11) 99999-0005',
      role: 'RESIDENT',
      condominiumId: firstCondominium.id,
    },
  })

  console.log('✅ Seeding completo!')
  console.log(`📊 Criados:`)
  console.log(`  - 9 condomínios dos recibos`)
  console.log(`  - 5 apartamentos`)
  console.log(`  - 5 usuários:`)
  console.log(`    Admin: ${admin.email} (senha: 123456)`)
  console.log(`    Manager: ${manager.email} (senha: 123456)`)
  console.log(`    Employee: ${employee.email} (senha: 123456)`)
  console.log(`    Resident1: ${resident1.email} (senha: 123456)`)
  console.log(`    Resident2: ${resident2.email} (senha: 123456)`)
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
