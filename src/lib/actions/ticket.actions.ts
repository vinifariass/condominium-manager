"use server";

// Interfaces para tipagem - preparado para backend/Prisma
export interface TicketComment {
  id?: number;
  author: string;
  date: string;
  text: string;
  ticketId?: number;
  userId?: number;
}

export interface TicketData {
  id: number;
  title: string;
  description: string;
  condominium: string;
  condominiumId: number;
  apartment: string;
  resident: string;
  residentPhone: string;
  residentEmail: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string | null;
  assignedToId?: number | null;
  estimatedCompletion?: string;
  cost: number;
  comments: TicketComment[];
}

// Filtros interface - preparado para backend
export interface TicketFilters {
  search?: string;
  status?: string[];
  category?: string[];
  priority?: string[];
  condominium?: string[];
  condominiumId?: number[];
  assignedTo?: string[];
  assignedToId?: number[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Constantes para filtros - futuramente virão do banco de dados
export const TICKET_FILTER_OPTIONS = {
  status: ["Aberto", "Em Andamento", "Aguardando Orçamento", "Concluído", "Cancelado"],
  category: ["Hidráulica", "Elétrica", "Segurança", "Climatização", "Tecnologia", "Manutenção", "Limpeza"],
  priority: ["Baixa", "Média", "Alta", "Crítica"],
  condominiums: [
    "Condomínio Santos Dumont",
    "Condomínio Vila Rica", 
    "Condomínio Griffe",
    "Condomínio Artagus",
    "Condomínio Cachoeira Dourada",
    "Condomínio Recanto",
    "Condomínio Vivenda",
    "Condomínio OCAPORAN",
    "Condomínio Romeu",
    "Condomínio Visconde Albuquerque"
  ]
};

// Dados mockados - futuramente substituído por consultas ao Prisma
const MOCK_TICKETS: TicketData[] = [
  {
    id: 1,
    title: "Vazamento no banheiro do apartamento 301",
    description: "Há um vazamento constante na torneira da pia do banheiro. A água está gotejando e causando desperdício.",
    condominium: "Condomínio Santos Dumont",
    condominiumId: 1,
    apartment: "301",
    resident: "Maria Santos",
    residentPhone: "(21) 99999-8888",
    residentEmail: "maria.santos@email.com",
    category: "Hidráulica",
    priority: "Média",
    status: "Em Andamento",
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-01-16T14:20:00",
    assignedTo: "Paulo Santos",
    assignedToId: 1,
    estimatedCompletion: "2024-01-18",
    cost: 150.00,
    comments: [
      {
        id: 1,
        author: "João Silva",
        date: "2024-01-15T10:45:00",
        text: "Chamado registrado. Verificarei hoje à tarde.",
        ticketId: 1,
        userId: 2
      },
      {
        id: 2,
        author: "Paulo Santos",
        date: "2024-01-16T14:20:00",
        text: "Peças pedidas ao fornecedor. Instalação amanhã.",
        ticketId: 1,
        userId: 1
      }
    ]
  },
  {
    id: 2,
    title: "Lâmpada queimada no corredor do 5º andar",
    description: "A lâmpada do corredor próximo ao elevador está queimada há 3 dias, deixando o local muito escuro.",
    condominium: "Condomínio Santos Dumont",
    condominiumId: 1,
    apartment: "Área Comum",
    resident: "Carlos Santos",
    residentPhone: "(21) 98765-1234",
    residentEmail: "carlos.santos@santosdumont.com.br",
    category: "Elétrica",
    priority: "Alta",
    status: "Aberto",
    createdAt: "2024-01-14T08:15:00",
    updatedAt: "2024-01-14T08:15:00",
    assignedTo: null,
    assignedToId: null,
    estimatedCompletion: "2024-01-17",
    cost: 25.00,
    comments: []
  },
  {
    id: 3,
    title: "Portão eletrônico com defeito",
    description: "O portão da garagem não está abrindo com o controle remoto. Precisa ser verificado urgentemente.",
    condominium: "Condomínio Griffe",
    condominiumId: 2,
    apartment: "Área Comum",
    resident: "Ana Paula Griffe",
    residentPhone: "(21) 98765-5678",
    residentEmail: "ana.griffe@griffe.com.br",
    category: "Segurança",
    priority: "Alta",
    status: "Concluído",
    createdAt: "2024-01-10T16:20:00",
    updatedAt: "2024-01-12T11:30:00",
    assignedTo: "Pedro Oliveira",
    assignedToId: 3,
    estimatedCompletion: "2024-01-12",
    cost: 320.00,
    comments: [
      {
        id: 3,
        author: "Pedro Oliveira",
        date: "2024-01-11T09:00:00",
        text: "Motor do portão substituído.",
        ticketId: 3,
        userId: 3
      },
      {
        id: 4,
        author: "Ana Paula Griffe",
        date: "2024-01-12T11:30:00",
        text: "Testado e funcionando perfeitamente. Obrigada!",
        ticketId: 3,
        userId: 4
      }
    ]
  }
  // ... mais tickets mockados podem ser adicionados aqui
];

// Função para buscar tickets com filtros - preparada para Prisma
export async function getTickets(filters: TicketFilters = {}): Promise<{
  tickets: TicketData[];
  totalCount: number;
  totalPages: number;
}> {
  try {
    // TODO: Substituir por consulta ao Prisma quando implementado
    // const tickets = await prisma.ticket.findMany({
    //   where: buildWhereClause(filters),
    //   include: {
    //     comments: true,
    //     assignedUser: true,
    //     condominium: true
    //   },
    //   orderBy: {
    //     [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc'
    //   },
    //   skip: filters.page ? (filters.page - 1) * (filters.limit || 10) : 0,
    //   take: filters.limit || 10
    // });

    // Por enquanto, filtrar dados mockados
    let filteredTickets = [...MOCK_TICKETS];

    // Filtro de pesquisa por texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.resident.toLowerCase().includes(searchLower) ||
        ticket.apartment.toLowerCase().includes(searchLower) ||
        ticket.condominium.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por status
    if (filters.status && filters.status.length > 0) {
      filteredTickets = filteredTickets.filter(ticket =>
        filters.status!.includes(ticket.status)
      );
    }

    // Filtro por categoria
    if (filters.category && filters.category.length > 0) {
      filteredTickets = filteredTickets.filter(ticket =>
        filters.category!.includes(ticket.category)
      );
    }

    // Filtro por prioridade
    if (filters.priority && filters.priority.length > 0) {
      filteredTickets = filteredTickets.filter(ticket =>
        filters.priority!.includes(ticket.priority)
      );
    }

    // Filtro por condomínio
    if (filters.condominium && filters.condominium.length > 0) {
      filteredTickets = filteredTickets.filter(ticket =>
        filters.condominium!.includes(ticket.condominium)
      );
    }

    // Filtro por ID do condomínio
    if (filters.condominiumId && filters.condominiumId.length > 0) {
      filteredTickets = filteredTickets.filter(ticket =>
        filters.condominiumId!.includes(ticket.condominiumId)
      );
    }

    // Filtro por responsável
    if (filters.assignedTo && filters.assignedTo.length > 0) {
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.assignedTo && filters.assignedTo!.includes(ticket.assignedTo)
      );
    }

    // Filtro por data
    if (filters.dateRange?.start || filters.dateRange?.end) {
      filteredTickets = filteredTickets.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        if (filters.dateRange?.start && ticketDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange?.end && ticketDate > new Date(filters.dateRange.end)) {
          return false;
        }
        return true;
      });
    }

    // Ordenação
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    
    filteredTickets.sort((a, b) => {
      let aValue: any = a[sortBy as keyof TicketData];
      let bValue: any = b[sortBy as keyof TicketData];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Paginação
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const totalCount = filteredTickets.length;
    const totalPages = Math.ceil(totalCount / limit);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    return {
      tickets: paginatedTickets,
      totalCount,
      totalPages
    };
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    throw new Error('Falha ao buscar tickets');
  }
}

// Função para buscar um ticket por ID - preparada para Prisma
export async function getTicketById(id: number): Promise<TicketData | null> {
  try {
    // TODO: Substituir por consulta ao Prisma
    // const ticket = await prisma.ticket.findUnique({
    //   where: { id },
    //   include: {
    //     comments: {
    //       include: { user: true }
    //     },
    //     assignedUser: true,
    //     condominium: true
    //   }
    // });

    const ticket = MOCK_TICKETS.find(t => t.id === id);
    return ticket || null;
  } catch (error) {
    console.error('Erro ao buscar ticket:', error);
    throw new Error('Falha ao buscar ticket');
  }
}

// Função para criar um novo ticket - preparada para Prisma
export async function createTicket(ticketData: Omit<TicketData, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<TicketData> {
  try {
    // TODO: Substituir por inserção no Prisma
    // const ticket = await prisma.ticket.create({
    //   data: {
    //     ...ticketData,
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   },
    //   include: {
    //     comments: true,
    //     assignedUser: true,
    //     condominium: true
    //   }
    // });

    const newTicket: TicketData = {
      ...ticketData,
      id: Math.max(...MOCK_TICKETS.map(t => t.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };

    MOCK_TICKETS.push(newTicket);
    return newTicket;
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    throw new Error('Falha ao criar ticket');
  }
}

// Função para atualizar um ticket - preparada para Prisma
export async function updateTicket(id: number, ticketData: Partial<TicketData>): Promise<TicketData | null> {
  try {
    // TODO: Substituir por atualização no Prisma
    // const ticket = await prisma.ticket.update({
    //   where: { id },
    //   data: {
    //     ...ticketData,
    //     updatedAt: new Date()
    //   },
    //   include: {
    //     comments: true,
    //     assignedUser: true,
    //     condominium: true
    //   }
    // });

    const ticketIndex = MOCK_TICKETS.findIndex(t => t.id === id);
    if (ticketIndex === -1) return null;

    MOCK_TICKETS[ticketIndex] = {
      ...MOCK_TICKETS[ticketIndex],
      ...ticketData,
      updatedAt: new Date().toISOString()
    };

    return MOCK_TICKETS[ticketIndex];
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    throw new Error('Falha ao atualizar ticket');
  }
}

// Função para deletar um ticket - preparada para Prisma
export async function deleteTicket(id: number): Promise<boolean> {
  try {
    // TODO: Substituir por deleção no Prisma
    // await prisma.ticket.delete({
    //   where: { id }
    // });

    const ticketIndex = MOCK_TICKETS.findIndex(t => t.id === id);
    if (ticketIndex === -1) return false;

    MOCK_TICKETS.splice(ticketIndex, 1);
    return true;
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    throw new Error('Falha ao deletar ticket');
  }
}

// Função para adicionar comentário a um ticket - preparada para Prisma
export async function addTicketComment(ticketId: number, commentData: Omit<TicketComment, 'id' | 'date' | 'ticketId'>): Promise<TicketComment | null> {
  try {
    // TODO: Substituir por inserção no Prisma
    // const comment = await prisma.ticketComment.create({
    //   data: {
    //     ...commentData,
    //     ticketId,
    //     date: new Date()
    //   },
    //   include: { user: true }
    // });

    const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
    if (!ticket) return null;

    const newComment: TicketComment = {
      id: Math.max(...ticket.comments.map(c => c.id || 0), 0) + 1,
      ...commentData,
      date: new Date().toISOString(),
      ticketId
    };

    ticket.comments.push(newComment);
    return newComment;
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    throw new Error('Falha ao adicionar comentário');
  }
}

// Função para obter estatísticas dos tickets - preparada para Prisma
export async function getTicketStats(): Promise<{
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  totalCost: number;
}> {
  try {
    // TODO: Substituir por agregações do Prisma
    // const stats = await prisma.ticket.aggregate({
    //   _count: { id: true },
    //   _sum: { cost: true }
    // });

    const total = MOCK_TICKETS.length;
    const open = MOCK_TICKETS.filter(t => t.status === 'Aberto').length;
    const inProgress = MOCK_TICKETS.filter(t => t.status === 'Em Andamento').length;
    const completed = MOCK_TICKETS.filter(t => t.status === 'Concluído').length;
    const totalCost = MOCK_TICKETS.reduce((sum, ticket) => sum + ticket.cost, 0);

    return {
      total,
      open,
      inProgress,
      completed,
      totalCost
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw new Error('Falha ao buscar estatísticas');
  }
}

// Função para obter opções de filtro dinâmicas - preparada para Prisma
export async function getFilterOptions(): Promise<typeof TICKET_FILTER_OPTIONS> {
  try {
    // TODO: Buscar opções dinâmicas do banco de dados
    // const condominiums = await prisma.condominium.findMany({
    //   select: { id: true, name: true }
    // });
    // const assignedUsers = await prisma.user.findMany({
    //   where: { role: 'EMPLOYEE' },
    //   select: { id: true, name: true }
    // });

    return TICKET_FILTER_OPTIONS;
  } catch (error) {
    console.error('Erro ao buscar opções de filtro:', error);
    return TICKET_FILTER_OPTIONS;
  }
}
