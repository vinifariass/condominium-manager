import { Condominium } from "@/lib/types/condominium"

// Mock database - In a real app, this would be your database connection
let condominiums: Condominium[] = [
  {
    id: 1,
    name: "Condomínio Santos Dumont",
    address: "Estrada dos Três Rios, 1306 - Freguesia - Jacarepaguá",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22745-004",
    description: "Condomínio residencial de alto padrão com 85 apartamentos distribuídos em uma torre principal de 20 andares. Localizado na Freguesia, Jacarepaguá, oferece toda infraestrutura de lazer e segurança.",
    totalUnits: 85,
    totalBlocks: 1,
    manager: "Carlos Santos",
    managerId: 1,
    phone: "(21) 2443-7890",
    email: "admin@santosdumont.com.br",
    cnpj: "29.008.729/0001-96",
    status: "active",
    createdAt: new Date("2018-03-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: 2,
    name: "Condomínio Griffe",
    address: "Rua da Passagem, 160 - Botafogo",
    city: "Rio de Janeiro",
    state: "RJ", 
    zipCode: "22290-030",
    description: "Condomínio moderno com ótima localização em Botafogo. Possui 45 apartamentos distribuídos em 2 blocos, com área de lazer completa incluindo piscina, salão de festas e academia.",
    totalUnits: 45,
    totalBlocks: 2,
    manager: "Ana Paula Griffe",
    managerId: 2,
    phone: "(21) 2541-6789",
    email: "admin@griffe.com.br",
    cnpj: "14.473.420/0001-08",
    status: "active",
    createdAt: new Date("2019-08-22"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: 3,
    name: "Condomínio Artagus",
    address: "Rua Santa Clara, 142, Copacabana",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22041-012",
    description: "Condomínio clássico localizado no coração de Copacabana. Com 80 apartamentos distribuídos em 3 blocos, oferece vista para o mar em alguns apartamentos e localização privilegiada.",
    totalUnits: 80,
    totalBlocks: 3,
    manager: "Roberto Artagus",
    managerId: 3,
    phone: "(21) 2256-5432",
    email: "sindico@artagus.com.br",
    cnpj: "04.543.049/0001-41",
    status: "active",
    createdAt: new Date("2017-05-10"),
    updatedAt: new Date("2024-01-25")
  },
  {
    id: 4,
    name: "Residencial Villa Real",
    address: "Av. das Américas, 2500 - Barra da Tijuca",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22640-102",
    description: "Complexo residencial de luxo na Barra da Tijuca com 200 unidades distribuídas em 4 torres. Área de lazer completa com piscinas, quadras esportivas, spa e kids club.",
    totalUnits: 200,
    totalBlocks: 4,
    manager: "Fernanda Real",
    managerId: 4,
    phone: "(21) 3025-8888",
    email: "administracao@villareal.com.br",
    cnpj: "18.234.567/0001-23",
    status: "active",
    createdAt: new Date("2020-11-15"),
    updatedAt: new Date("2024-01-30")
  },
  {
    id: 5,
    name: "Edifício Green Park",
    address: "Rua Jardim Botânico, 300 - Jardim Botânico",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22470-050",
    description: "Edifício sustentável no Jardim Botânico com conceito eco-friendly. 60 apartamentos distribuídos em 2 torres, com sistema de captação de água da chuva e energia solar.",
    totalUnits: 60,
    totalBlocks: 2,
    manager: "Marina Green",
    managerId: 5,
    phone: "(21) 2537-9999",
    email: "sustentavel@greenpark.com.br",
    cnpj: "25.678.901/0001-34",
    status: "active",
    createdAt: new Date("2021-06-20"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: 6,
    name: "Condomínio Sunset",
    address: "Estrada da Barra da Tijuca, 1200 - Recreio dos Bandeirantes",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "22795-123",
    description: "Condomínio familiar no Recreio com vista para o pôr do sol. 150 apartamentos em 5 blocos baixos, com extensa área verde, playground e quadra poliesportiva.",
    totalUnits: 150,
    totalBlocks: 5,
    manager: "Paulo Sunset",
    managerId: 6,
    phone: "(21) 2428-7777",
    email: "contato@sunset.com.br",
    cnpj: "31.456.789/0001-45",
    status: "maintenance",
    createdAt: new Date("2016-09-08"),
    updatedAt: new Date("2024-02-05")
  }
]

export const db = {
  condominiums: {
    findMany: async () => {
      return condominiums
    },
    
    findById: async (id: number) => {
      return condominiums.find(c => c.id === id)
    },
    
    create: async (data: any) => {
      const newCondominium = {
        id: Math.max(...condominiums.map(c => c.id), 0) + 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      condominiums.push(newCondominium)
      return newCondominium
    },
    
    update: async (id: number, data: any) => {
      const index = condominiums.findIndex(c => c.id === id)
      if (index === -1) throw new Error('Condomínio não encontrado')
      
      condominiums[index] = {
        ...condominiums[index],
        ...data,
        updatedAt: new Date()
      }
      return condominiums[index]
    },
    
    delete: async (id: number) => {
      const index = condominiums.findIndex(c => c.id === id)
      if (index === -1) throw new Error('Condomínio não encontrado')
      
      const deleted = condominiums[index]
      condominiums.splice(index, 1)
      return deleted
    }
  }
}
