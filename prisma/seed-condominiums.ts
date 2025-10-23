import { prisma } from "../src/lib/prisma";

const condominiumsData = [
  {
    name: "Condomínio Santos Dumont",
    cnpj: "29.008.729/0001-96",
    address: "Estrada dos Três Rios, nº 1306",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22750-002",
    phone: "(21) 2443-7890",
    email: "contato@santosdumont.com.br",
    managerName: "Carlos Silva",
    status: "ACTIVE" as const,
    totalApartments: 48,
    totalResidents: 0,
  },
  {
    name: "Condomínio Griffe",
    cnpj: "14.473.420/0001-08",
    address: "Rua da Passagem, nº 160",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22280-030",
    phone: "(21) 2222-3333",
    email: "contato@griffe.com.br",
    managerName: "Ana Costa",
    status: "ACTIVE" as const,
    totalApartments: 32,
    totalResidents: 0,
  },
  {
    name: "Condomínio Artagus",
    cnpj: "04.543.049/0001-41",
    address: "Rua Santa Clara, nº 142",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22041-012",
    phone: "(21) 3333-4444",
    email: "contato@artagus.com.br",
    managerName: "Pedro Santos",
    status: "ACTIVE" as const,
    totalApartments: 24,
    totalResidents: 0,
  },
  {
    name: "Condomínio Cachoeira Dourada",
    cnpj: "73.383.614/0001-73",
    address: "Avenida Rainha Elizabeth, nº 122",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22081-031",
    phone: "(21) 4444-5555",
    email: "contato@cachoeiradourada.com.br",
    managerName: "Maria Oliveira",
    status: "ACTIVE" as const,
    totalApartments: 36,
    totalResidents: 0,
  },
  {
    name: "Condomínio Recanto",
    cnpj: "37.541.791/0001-77",
    address: "Rua Visconde de Silva, nº 85",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22271-043",
    phone: "(21) 5555-6666",
    email: "contato@recanto.com.br",
    managerName: "João Ferreira",
    status: "ACTIVE" as const,
    totalApartments: 28,
    totalResidents: 0,
  },
  {
    name: "Condomínio Vivenda",
    cnpj: "39.937.662/0001-66",
    address: "Avenida Afrânio de Melo Franco, nº 74",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22430-060",
    phone: "(21) 6666-7777",
    email: "contato@vivenda.com.br",
    managerName: "Lucia Mendes",
    status: "ACTIVE" as const,
    totalApartments: 42,
    totalResidents: 0,
  },
  {
    name: "Condomínio OCAPORAN",
    cnpj: "68.768.027/0001-62",
    address: "Rua Rias da Rocha, nº 12",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22070-100",
    phone: "(21) 7777-8888",
    email: "contato@ocaporan.com.br",
    managerName: "Roberto Lima",
    status: "ACTIVE" as const,
    totalApartments: 18,
    totalResidents: 0,
  },
  {
    name: "Condomínio Romeu",
    cnpj: "68.607.969/0001-69",
    address: "Rua Cinco de Julho, nº 266",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22051-030",
    phone: "(21) 8888-9999",
    email: "contato@romeu.com.br",
    managerName: "Fernanda Rocha",
    status: "ACTIVE" as const,
    totalApartments: 35,
    totalResidents: 0,
  },
  {
    name: "Condomínio Visconde Albuquerque",
    cnpj: "12.307.108/0001-00",
    address: "Avenida Visconde de Albuquerque, nº 392",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22450-000",
    phone: "(21) 9999-0000",
    email: "contato@viscondealbquerque.com.br",
    managerName: "Ricardo Alves",
    status: "ACTIVE" as const,
    totalApartments: 56,
    totalResidents: 0,
  },
];

export async function seedCondominiums() {
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

seedCondominiums()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
