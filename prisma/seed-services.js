const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedServices() {
  console.log('🌱 Populando serviços...');
  
  try {
    // Primeiro vamos buscar os condomínios existentes
    const condominiums = await prisma.condominium.findMany();
    console.log(`Encontrados ${condominiums.length} condomínios`);
    
    if (condominiums.length === 0) {
      console.log('⚠️ Nenhum condomínio encontrado. Execute primeiro o seed de condomínios.');
      return;
    }
    
    // Usar os IDs reais dos condomínios
    const firstCondoId = condominiums[0].id;
    const secondCondoId = condominiums.length > 1 ? condominiums[1].id : firstCondoId;
    
    console.log(`Usando condomínio 1: ${condominiums[0].name} (${firstCondoId})`);
    if (condominiums.length > 1) {
      console.log(`Usando condomínio 2: ${condominiums[1].name} (${secondCondoId})`);
    }
    
    // Agora criar os serviços
    const services = [
      {
        name: 'Limpeza de Apartamento',
        description: 'Serviço completo de limpeza residencial',
        category: 'Limpeza',
        price: 150.00,
        unit: 'hora',
        active: true,
        condominiumId: firstCondoId
      },
      {
        name: 'Jardinagem',
        description: 'Manutenção de jardins e áreas verdes',
        category: 'Paisagismo',
        price: 80.00,
        unit: 'm²',
        active: true,
        condominiumId: firstCondoId
      },
      {
        name: 'Manutenção Elétrica',
        description: 'Serviços de eletricista residencial',
        category: 'Manutenção',
        price: 120.00,
        unit: 'hora',
        active: true,
        condominiumId: firstCondoId
      },
      {
        name: 'Pintura',
        description: 'Serviços de pintura interna e externa',
        category: 'Manutenção',
        price: 25.00,
        unit: 'm²',
        active: true,
        condominiumId: firstCondoId
      },
      {
        name: 'Segurança',
        description: 'Serviços de segurança patrimonial',
        category: 'Segurança',
        price: 200.00,
        unit: 'hora',
        active: true,
        condominiumId: secondCondoId
      },
      {
        name: 'Portaria',
        description: 'Serviços de portaria e recepção',
        category: 'Portaria',
        price: 180.00,
        unit: 'hora',
        active: true,
        condominiumId: secondCondoId
      }
    ];

    for (const service of services) {
      const existingService = await prisma.service.findFirst({
        where: {
          name: service.name,
          condominiumId: service.condominiumId
        }
      });

      if (!existingService) {
        await prisma.service.create({
          data: service
        });
        console.log(`✅ Criado serviço: ${service.name}`);
      } else {
        console.log(`⏭️ Serviço já existe: ${service.name}`);
      }
    }

    const totalServices = await prisma.service.count();
    console.log(`🎉 Seed concluído! Total de serviços: ${totalServices}`);
    
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
}

async function main() {
  await seedServices();
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
