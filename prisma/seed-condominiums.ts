import { prisma } from "../src/lib/prisma";

const condominiumsData = [
  {
    name: "Condomínio Santos Dumont",
    cnpj: "29.008.729/0001-96",
    address: "Estrada dos Três Rios, nº 1306",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22750-002",
    status: "ACTIVE" as const,
    totalUnits: 48,
    totalBlocks: 2,
  },
  {
    name: "Condomínio Griffe",
    cnpj: "14.473.420/0001-08",
    address: "Rua da Passagem, nº 160",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22280-030",
    status: "ACTIVE" as const,
    totalUnits: 32,
    totalBlocks: 1,
  },
  {
    name: "Condomínio Artagus",
    cnpj: "04.543.049/0001-41",
    address: "Rua Santa Clara, nº 142",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22041-012",
    status: "ACTIVE" as const,
    totalUnits: 24,
    totalBlocks: 1,
  },
  {
    name: "Condomínio Cachoeira Dourada",
    cnpj: "73.383.614/0001-73",
    address: "Avenida Rainha Elizabeth, nº 122",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22081-031",
    status: "ACTIVE" as const,
    totalUnits: 36,
    totalBlocks: 1,
  },
  {
    name: "Condomínio Recanto",
    cnpj: "37.541.791/0001-77",
    address: "Rua Visconde de Silva, nº 85",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22271-043",
    status: "ACTIVE" as const,
    totalUnits: 28,
    totalBlocks: 1,
  },
  {
    name: "Condomínio Vivenda",
    cnpj: "39.937.662/0001-66",
    address: "Avenida Afrânio de Melo Franco, nº 74",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22430-060",
    status: "ACTIVE" as const,
    totalUnits: 42,
    totalBlocks: 2,
  },
  {
    name: "Condomínio OCAPORAN",
    cnpj: "68.768.027/0001-62",
    address: "Rua Rias da Rocha, nº 12",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22070-100",
    status: "ACTIVE" as const,
    totalUnits: 18,
    totalBlocks: 1,
  },
  {
    name: "Condomínio Romeu",
    cnpj: "68.607.969/0001-69",
    address: "Rua Cinco de Julho, nº 266",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22051-030",
    status: "ACTIVE" as const,
    totalUnits: 35,
    totalBlocks: 1,
  },
  {
    name: "Condomínio Visconde Albuquerque",
    cnpj: "12.307.108/0001-00",
    address: "Avenida Visconde de Albuquerque, nº 392",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22450-000",
    status: "ACTIVE" as const,
    totalUnits: 56,
    totalBlocks: 3,
  },
];

async function seedCondominiums() {
  console.log("🏢 Seeding condominiums...");

  for (const condominiumData of condominiumsData) {
    try {
      const existingCondominium = await prisma.condominium.findFirst({
        where: { cnpj: condominiumData.cnpj }
      });

      if (existingCondominium) {
        console.log(`⏭️  Condomínio ${condominiumData.name} já existe, pulando...`);
        continue;
      }

      const condominium = await prisma.condominium.create({
        data: condominiumData,
      });

      console.log(`✅ Condomínio criado: ${condominium.name} (${condominium.cnpj})`);
    } catch (error) {
      console.error(`❌ Erro ao criar condomínio ${condominiumData.name}:`, error);
    }
  }

  console.log("🎉 Seed de condomínios concluído!");
}

export { seedCondominiums };

// Para executar standalone
if (require.main === module) {
  seedCondominiums()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
