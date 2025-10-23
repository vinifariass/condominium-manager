import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean database (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning database...')
  await prisma.notification.deleteMany()
  await prisma.financialRecord.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.visitor.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.commonArea.deleteMany()
  await prisma.pet.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.resident.deleteMany()
  await prisma.apartment.deleteMany()
  await prisma.block.deleteMany()
  await prisma.condominium.deleteMany()

  // Create Condominium
  console.log('🏢 Creating condominium...')
  const condominium = await prisma.condominium.create({
    data: {
      name: 'Condominio Santos Dumont',
      cnpj: '29.008.729/0001-96',
      address: 'Estrada dos Tres Rios, 1306',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22745-004',
      phone: '(21) 2443-7890',
      email: 'admin@santosdumont.com.br',
      managerName: 'Carlos Santos',
      totalApartments: 4,
      totalResidents: 3,
      occupancyRate: 75,
      monthlyRevenue: 3400,
      status: 'ACTIVE',
    },
  })

  console.log('✅ Condominium created:', condominium.name)

  // Create Block
  console.log('🏗️ Creating block...')
  const block = await prisma.block.create({
    data: {
      name: 'Torre A',
      floors: 2,
      apartmentsCount: 4,
      condominiumId: condominium.id,
    },
  })

  console.log('✅ Block created:', block.name)

  // Create Apartments
  console.log('🏠 Creating apartments...')
  const apartment1 = await prisma.apartment.create({
    data: {
      number: '101',
      floor: 1,
      area: 75,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpots: 1,
      monthlyFee: 850,
      status: 'OCCUPIED',
      balance: 0,
      condominiumId: condominium.id,
      blockId: block.id,
    },
  })

  const apartment2 = await prisma.apartment.create({
    data: {
      number: '102',
      floor: 1,
      area: 75,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpots: 1,
      monthlyFee: 850,
      status: 'OCCUPIED',
      balance: -1700,
      condominiumId: condominium.id,
      blockId: block.id,
    },
  })

  const apartment3 = await prisma.apartment.create({
    data: {
      number: '201',
      floor: 2,
      area: 75,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpots: 1,
      monthlyFee: 850,
      status: 'VACANT',
      balance: 0,
      condominiumId: condominium.id,
      blockId: block.id,
    },
  })

  const apartment4 = await prisma.apartment.create({
    data: {
      number: '202',
      floor: 2,
      area: 90,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpots: 2,
      monthlyFee: 950,
      status: 'OCCUPIED',
      balance: 0,
      condominiumId: condominium.id,
      blockId: block.id,
    },
  })

  console.log('✅ Created 4 apartments')

  // Create Residents
  console.log('👥 Creating residents...')
  const resident1 = await prisma.resident.create({
    data: {
      name: 'Joao Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-1111',
      cpf: '123.456.789-10',
      rg: '12.345.678-9',
      birthDate: new Date('1980-05-15'),
      type: 'OWNER',
      isOwner: true,
      status: 'ACTIVE',
      apartmentId: apartment1.id,
      condominiumId: condominium.id,
      emergencyContactName: 'Maria Silva',
      emergencyContactPhone: '(11) 98888-2222',
      emergencyContactRelationship: 'Esposa',
    },
  })

  const resident2 = await prisma.resident.create({
    data: {
      name: 'Carlos Souza',
      email: 'carlos@email.com',
      phone: '(11) 97777-3333',
      cpf: '456.789.123-45',
      rg: '45.678.912-3',
      birthDate: new Date('1992-11-30'),
      type: 'TENANT',
      isOwner: false,
      status: 'ACTIVE',
      apartmentId: apartment2.id,
      condominiumId: condominium.id,
      emergencyContactName: 'Ana Souza',
      emergencyContactPhone: '(11) 96666-4444',
      emergencyContactRelationship: 'Irma',
    },
  })

  const resident3 = await prisma.resident.create({
    data: {
      name: 'Ana Paula',
      email: 'ana@email.com',
      phone: '(11) 96666-4444',
      cpf: '321.654.987-00',
      rg: '32.165.498-7',
      birthDate: new Date('1988-03-25'),
      type: 'OWNER',
      isOwner: true,
      status: 'ACTIVE',
      apartmentId: apartment4.id,
      condominiumId: condominium.id,
      emergencyContactName: 'Roberto Paula',
      emergencyContactPhone: '(11) 95555-5555',
      emergencyContactRelationship: 'Pai',
    },
  })

  console.log('✅ Created 3 residents')

  // Create Vehicles
  console.log('🚗 Creating vehicles...')
  await prisma.vehicle.createMany({
    data: [
      {
        plate: 'ABC-1234',
        model: 'Honda Civic',
        brand: 'Honda',
        color: 'Preto',
        year: 2020,
        residentId: resident1.id,
        apartmentId: apartment1.id,
      },
      {
        plate: 'XYZ-5678',
        model: 'Toyota Corolla',
        brand: 'Toyota',
        color: 'Branco',
        year: 2019,
        residentId: resident2.id,
        apartmentId: apartment2.id,
      },
      {
        plate: 'DEF-9012',
        model: 'Jeep Renegade',
        brand: 'Jeep',
        color: 'Vermelho',
        year: 2021,
        residentId: resident3.id,
        apartmentId: apartment4.id,
      },
    ],
  })

  console.log('✅ Created 3 vehicles')

  // Create Pets
  console.log('🐾 Creating pets...')
  await prisma.pet.create({
    data: {
      name: 'Mia',
      species: 'Gato',
      breed: 'Persa',
      age: 3,
      residentId: resident3.id,
    },
  })

  console.log('✅ Created 1 pet')

  // Create Employees
  console.log('👔 Creating employees...')
  await prisma.employee.createMany({
    data: [
      {
        name: 'Pedro Porteiro',
        phone: '(11) 91111-2222',
        cpf: '111.222.333-44',
        role: 'Porteiro',
        salary: 2500,
        status: 'ACTIVE',
        condominiumId: condominium.id,
      },
      {
        name: 'Jose Zelador',
        phone: '(11) 92222-3333',
        cpf: '222.333.444-55',
        role: 'Zelador',
        salary: 2200,
        status: 'ACTIVE',
        condominiumId: condominium.id,
      },
    ],
  })

  console.log('✅ Created 2 employees')

  // Create Common Areas
  console.log('🏊 Creating common areas...')
  const commonArea1 = await prisma.commonArea.create({
    data: {
      name: 'Salao de Festas',
      description: 'Espaco para eventos com capacidade para 80 pessoas',
      capacity: 80,
      bookingFee: 300,
      requiresApproval: true,
      status: 'AVAILABLE',
      condominiumId: condominium.id,
    },
  })

  const commonArea2 = await prisma.commonArea.create({
    data: {
      name: 'Churrasqueira 1',
      description: 'Area de churrasqueira com capacidade para 20 pessoas',
      capacity: 20,
      bookingFee: 100,
      requiresApproval: false,
      status: 'AVAILABLE',
      condominiumId: condominium.id,
    },
  })

  const commonArea3 = await prisma.commonArea.create({
    data: {
      name: 'Piscina',
      description: 'Piscina aquecida com area de lazer',
      capacity: 40,
      bookingFee: 0,
      requiresApproval: false,
      status: 'AVAILABLE',
      condominiumId: condominium.id,
    },
  })

  console.log('✅ Created 3 common areas')

  // Create Reservations
  console.log('📅 Creating reservations...')
  await prisma.reservation.createMany({
    data: [
      {
        commonAreaId: commonArea1.id,
        residentId: resident1.id,
        condominiumId: condominium.id,
        date: new Date('2024-02-15'),
        startTime: '18:00',
        endTime: '23:00',
        guests: 60,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        amount: 300,
        observation: 'Festa de aniversario',
      },
      {
        commonAreaId: commonArea2.id,
        residentId: resident2.id,
        condominiumId: condominium.id,
        date: new Date('2024-02-10'),
        startTime: '12:00',
        endTime: '18:00',
        guests: 15,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        amount: 100,
        observation: 'Almoco de familia',
      },
    ],
  })

  console.log('✅ Created 2 reservations')

  // Create Visitors
  console.log('👋 Creating visitors...')
  await prisma.visitor.createMany({
    data: [
      {
        name: 'Maria Visitante',
        phone: '(11) 99999-9999',
        document: '999.888.777-66',
        visitingResidentId: resident1.id,
        condominiumId: condominium.id,
        purpose: 'Visita pessoal',
        type: 'VISITOR',
        status: 'WAITING',
      },
    ],
  })

  console.log('✅ Created 1 visitor')

  // Create Tickets
  console.log('🎫 Creating tickets...')
  await prisma.ticket.createMany({
    data: [
      {
        title: 'Vazamento no apartamento',
        description: 'Ha um vazamento no banheiro principal',
        category: 'MAINTENANCE',
        priority: 'HIGH',
        status: 'OPEN',
        residentId: resident1.id,
        condominiumId: condominium.id,
      },
      {
        title: 'Limpeza do corredor',
        description: 'Corredor do 2º andar precisa de limpeza',
        category: 'CLEANING',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        residentId: resident3.id,
        condominiumId: condominium.id,
      },
    ],
  })

  console.log('✅ Created 2 tickets')

  // Create Financial Records
  console.log('💰 Creating financial records...')
  await prisma.financialRecord.createMany({
    data: [
      {
        type: 'INCOME',
        category: 'Taxa Condominial',
        description: 'Taxa condominial - Apartamento 101',
        amount: 850,
        dueDate: new Date('2024-01-15'),
        paymentDate: new Date('2024-01-14'),
        paymentMethod: 'PIX',
        status: 'PAID',
        apartmentId: apartment1.id,
        condominiumId: condominium.id,
      },
      {
        type: 'INCOME',
        category: 'Taxa Condominial',
        description: 'Taxa condominial - Apartamento 102',
        amount: 850,
        dueDate: new Date('2024-01-15'),
        status: 'OVERDUE',
        apartmentId: apartment2.id,
        condominiumId: condominium.id,
      },
      {
        type: 'EXPENSE',
        category: 'Manutencao',
        description: 'Conserto do elevador',
        amount: 2500,
        dueDate: new Date('2024-01-20'),
        paymentDate: new Date('2024-01-19'),
        paymentMethod: 'Transferencia',
        status: 'PAID',
        condominiumId: condominium.id,
      },
      {
        type: 'EXPENSE',
        category: 'Limpeza',
        description: 'Material de limpeza',
        amount: 450,
        dueDate: new Date('2024-01-25'),
        paymentDate: new Date('2024-01-25'),
        paymentMethod: 'Dinheiro',
        status: 'PAID',
        condominiumId: condominium.id,
      },
    ],
  })

  console.log('✅ Created 4 financial records')

  console.log('✨ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
