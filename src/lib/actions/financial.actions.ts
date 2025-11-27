"use server";

import { FINANCIAL_FILTER_OPTIONS } from "@/lib/constants";

// Interfaces para tipagem - preparado para backend/Prisma
export interface FinancialData {
  id: number;
  description: string;
  type: 'Receita' | 'Despesa';
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: 'Pendente' | 'Pago' | 'Atrasado' | 'Cancelado';
  condominiumId: number;
  condominium: string;
  apartmentId?: number;
  apartment?: string;
  dueDate?: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Filtros interface - preparado para backend
export interface FinancialFilters {
  search?: string;
  type?: string[];
  category?: string[];
  status?: string[];
  paymentMethod?: string[];
  condominiumId?: number[];
  apartmentId?: number[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  amountRange?: {
    min?: number;
    max?: number;
  };
  dueDate?: {
    start?: string;
    end?: string;
  };
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Função para obter opções de filtro - preparada para "use server"
export async function getFinancialFilterOptions() {
  return FINANCIAL_FILTER_OPTIONS;
}

// Dados mockados - futuramente substituído por consultas ao Prisma
const MOCK_FINANCIALS: FinancialData[] = [
  {
    id: 1,
    description: "Taxa de condomínio - Janeiro 2024",
    type: "Receita",
    category: "Taxa de Condomínio",
    amount: 450.00,
    date: "2024-01-05",
    dueDate: "2024-01-05",
    paidDate: "2024-01-05",
    paymentMethod: "PIX",
    status: "Pago",
    condominiumId: 1,
    condominium: "Condomínio Santos Dumont",
    apartmentId: 301,
    apartment: "301",
    notes: "Pagamento em dia",
    createdAt: "2024-01-01T08:00:00",
    updatedAt: "2024-01-05T10:30:00"
  },
  {
    id: 2,
    description: "Manutenção do elevador",
    type: "Despesa",
    category: "Manutenção",
    amount: 850.00,
    date: "2024-01-10",
    dueDate: "2024-01-15",
    paymentMethod: "Transferência Bancária",
    status: "Pago",
    condominiumId: 1,
    condominium: "Condomínio Santos Dumont",
    notes: "Manutenção preventiva mensal",
    createdAt: "2024-01-10T09:00:00",
    updatedAt: "2024-01-15T14:20:00"
  },
  {
    id: 3,
    description: "Taxa de condomínio - Janeiro 2024",
    type: "Receita",
    category: "Taxa de Condomínio",
    amount: 680.00,
    date: "2024-01-15",
    dueDate: "2024-01-05",
    paymentMethod: "Boleto",
    status: "Atrasado",
    condominiumId: 2,
    condominium: "Condomínio Griffe",
    apartmentId: 502,
    apartment: "502",
    notes: "Pagamento em atraso",
    createdAt: "2024-01-01T08:00:00",
    updatedAt: "2024-01-15T16:45:00"
  },
  {
    id: 4,
    description: "Conta de energia elétrica",
    type: "Despesa",
    category: "Energia Elétrica",
    amount: 1240.00,
    date: "2024-01-20",
    dueDate: "2024-01-25",
    paymentMethod: "Débito Automático",
    status: "Pendente",
    condominiumId: 2,
    condominium: "Condomínio Griffe",
    notes: "Conta referente a dezembro",
    createdAt: "2024-01-20T10:00:00",
    updatedAt: "2024-01-20T10:00:00"
  },
  {
    id: 5,
    description: "Salário - Porteiro",
    type: "Despesa",
    category: "Salários",
    amount: 2800.00,
    date: "2024-01-01",
    dueDate: "2024-01-05",
    paidDate: "2024-01-05",
    paymentMethod: "Transferência Bancária",
    status: "Pago",
    condominiumId: 3,
    condominium: "Condomínio Artagus",
    notes: "Salário de Janeiro - Pedro Silva",
    createdAt: "2024-01-01T08:00:00",
    updatedAt: "2024-01-05T09:15:00"
  },
  {
    id: 6,
    description: "Fundo de reserva - Janeiro 2024",
    type: "Receita",
    category: "Fundo de Reserva",
    amount: 200.00,
    date: "2024-01-08",
    dueDate: "2024-01-05",
    paidDate: "2024-01-08",
    paymentMethod: "PIX",
    status: "Pago",
    condominiumId: 4,
    condominium: "Condomínio Cachoeira Dourada",
    apartmentId: 1502,
    apartment: "1502",
    createdAt: "2024-01-01T08:00:00",
    updatedAt: "2024-01-08T11:20:00"
  }
];

// Função para buscar registros financeiros com filtros - preparada para Prisma
export async function getFinancials(filters: FinancialFilters = {}): Promise<{
  financials: FinancialData[];
  totalCount: number;
  totalPages: number;
  totalReceita: number;
  totalDespesa: number;
  saldo: number;
}> {
  try {
    // TODO: Substituir por consulta ao Prisma
    // const financials = await prisma.financial.findMany({
    //   where: buildWhereClause(filters),
    //   include: { 
    //     condominium: true,
    //     apartment: true 
    //   },
    //   orderBy: {
    //     [filters.sortBy || 'date']: filters.sortOrder || 'desc'
    //   },
    //   skip: filters.page ? (filters.page - 1) * (filters.limit || 10) : 0,
    //   take: filters.limit || 10
    // });

    let filteredFinancials = [...MOCK_FINANCIALS];

    // Filtro de pesquisa por texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredFinancials = filteredFinancials.filter(financial =>
        financial.description.toLowerCase().includes(searchLower) ||
        financial.category.toLowerCase().includes(searchLower) ||
        financial.condominium.toLowerCase().includes(searchLower) ||
        (financial.apartment && financial.apartment.toLowerCase().includes(searchLower)) ||
        (financial.notes && financial.notes.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por tipo
    if (filters.type && filters.type.length > 0) {
      filteredFinancials = filteredFinancials.filter(financial =>
        filters.type!.includes(financial.type)
      );
    }

    // Filtro por categoria
    if (filters.category && filters.category.length > 0) {
      filteredFinancials = filteredFinancials.filter(financial =>
        filters.category!.includes(financial.category)
      );
    }

    // Filtro por status
    if (filters.status && filters.status.length > 0) {
      filteredFinancials = filteredFinancials.filter(financial =>
        filters.status!.includes(financial.status)
      );
    }

    // Filtro por método de pagamento
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      filteredFinancials = filteredFinancials.filter(financial =>
        filters.paymentMethod!.includes(financial.paymentMethod)
      );
    }

    // Filtro por condomínio
    if (filters.condominiumId && filters.condominiumId.length > 0) {
      filteredFinancials = filteredFinancials.filter(financial =>
        filters.condominiumId!.includes(financial.condominiumId)
      );
    }

    // Filtro por apartamento
    if (filters.apartmentId && filters.apartmentId.length > 0) {
      filteredFinancials = filteredFinancials.filter(financial =>
        financial.apartmentId && filters.apartmentId!.includes(financial.apartmentId)
      );
    }

    // Filtro por data
    if (filters.dateRange?.start || filters.dateRange?.end) {
      filteredFinancials = filteredFinancials.filter(financial => {
        const financialDate = new Date(financial.date);
        if (filters.dateRange?.start && financialDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange?.end && financialDate > new Date(filters.dateRange.end)) {
          return false;
        }
        return true;
      });
    }

    // Filtro por data de vencimento
    if (filters.dueDate?.start || filters.dueDate?.end) {
      filteredFinancials = filteredFinancials.filter(financial => {
        if (!financial.dueDate) return false;
        const dueDate = new Date(financial.dueDate);
        if (filters.dueDate?.start && dueDate < new Date(filters.dueDate.start)) {
          return false;
        }
        if (filters.dueDate?.end && dueDate > new Date(filters.dueDate.end)) {
          return false;
        }
        return true;
      });
    }

    // Filtro por valor
    if (filters.amountRange?.min !== undefined || filters.amountRange?.max !== undefined) {
      filteredFinancials = filteredFinancials.filter(financial => {
        if (filters.amountRange?.min !== undefined && financial.amount < filters.amountRange.min) {
          return false;
        }
        if (filters.amountRange?.max !== undefined && financial.amount > filters.amountRange.max) {
          return false;
        }
        return true;
      });
    }

    // Ordenação
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';

    filteredFinancials.sort((a, b) => {
      let aValue: any = a[sortBy as keyof FinancialData];
      let bValue: any = b[sortBy as keyof FinancialData];

      if (sortBy === 'date' || sortBy === 'dueDate' || sortBy === 'paidDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Calcular totais
    const totalReceita = filteredFinancials
      .filter(f => f.type === 'Receita')
      .reduce((sum, f) => sum + f.amount, 0);

    const totalDespesa = filteredFinancials
      .filter(f => f.type === 'Despesa')
      .reduce((sum, f) => sum + f.amount, 0);

    const saldo = totalReceita - totalDespesa;

    // Paginação
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const totalCount = filteredFinancials.length;
    const totalPages = Math.ceil(totalCount / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFinancials = filteredFinancials.slice(startIndex, endIndex);

    return {
      financials: paginatedFinancials,
      totalCount,
      totalPages,
      totalReceita,
      totalDespesa,
      saldo
    };
  } catch (error) {
    console.error('Erro ao buscar registros financeiros:', error);
    throw new Error('Falha ao buscar registros financeiros');
  }
}

// Função para buscar um registro financeiro por ID - preparada para Prisma
export async function getFinancialById(id: number): Promise<FinancialData | null> {
  try {
    // TODO: Substituir por consulta ao Prisma
    const financial = MOCK_FINANCIALS.find(f => f.id === id);
    return financial || null;
  } catch (error) {
    console.error('Erro ao buscar registro financeiro:', error);
    throw new Error('Falha ao buscar registro financeiro');
  }
}

// Função para criar um novo registro financeiro - preparada para Prisma
export async function createFinancial(financialData: Omit<FinancialData, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancialData> {
  try {
    // TODO: Substituir por inserção no Prisma
    const newFinancial: FinancialData = {
      ...financialData,
      id: Math.max(...MOCK_FINANCIALS.map(f => f.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    MOCK_FINANCIALS.push(newFinancial);
    return newFinancial;
  } catch (error) {
    console.error('Erro ao criar registro financeiro:', error);
    throw new Error('Falha ao criar registro financeiro');
  }
}

// Função para atualizar um registro financeiro - preparada para Prisma
export async function updateFinancial(id: number, financialData: Partial<FinancialData>): Promise<FinancialData | null> {
  try {
    // TODO: Substituir por atualização no Prisma
    const financialIndex = MOCK_FINANCIALS.findIndex(f => f.id === id);
    if (financialIndex === -1) return null;

    MOCK_FINANCIALS[financialIndex] = {
      ...MOCK_FINANCIALS[financialIndex],
      ...financialData,
      updatedAt: new Date().toISOString()
    };

    return MOCK_FINANCIALS[financialIndex];
  } catch (error) {
    console.error('Erro ao atualizar registro financeiro:', error);
    throw new Error('Falha ao atualizar registro financeiro');
  }
}

// Função para deletar um registro financeiro - preparada para Prisma
export async function deleteFinancial(id: number): Promise<boolean> {
  try {
    // TODO: Substituir por deleção no Prisma
    const financialIndex = MOCK_FINANCIALS.findIndex(f => f.id === id);
    if (financialIndex === -1) return false;

    MOCK_FINANCIALS.splice(financialIndex, 1);
    return true;
  } catch (error) {
    console.error('Erro ao deletar registro financeiro:', error);
    throw new Error('Falha ao deletar registro financeiro');
  }
}

// Função para obter estatísticas financeiras - preparada para Prisma
export async function getFinancialStats(condominiumId?: number): Promise<{
  totalReceita: number;
  totalDespesa: number;
  saldo: number;
  receitasPendentes: number;
  despesasPendentes: number;
  receitasAtrasadas: number;
  despesasAtrasadas: number;
  projecaoMensal: number;
}> {
  try {
    // TODO: Substituir por agregações do Prisma
    let financials = MOCK_FINANCIALS;

    if (condominiumId) {
      financials = financials.filter(f => f.condominiumId === condominiumId);
    }

    const receitas = financials.filter(f => f.type === 'Receita');
    const despesas = financials.filter(f => f.type === 'Despesa');

    const totalReceita = receitas.reduce((sum, f) => sum + f.amount, 0);
    const totalDespesa = despesas.reduce((sum, f) => sum + f.amount, 0);
    const saldo = totalReceita - totalDespesa;

    const receitasPendentes = receitas
      .filter(f => f.status === 'Pendente')
      .reduce((sum, f) => sum + f.amount, 0);

    const despesasPendentes = despesas
      .filter(f => f.status === 'Pendente')
      .reduce((sum, f) => sum + f.amount, 0);

    const receitasAtrasadas = receitas
      .filter(f => f.status === 'Atrasado')
      .reduce((sum, f) => sum + f.amount, 0);

    const despesasAtrasadas = despesas
      .filter(f => f.status === 'Atrasado')
      .reduce((sum, f) => sum + f.amount, 0);

    // Projeção baseada na média dos últimos 3 meses
    const projecaoMensal = saldo; // Simplificado para o mock

    return {
      totalReceita,
      totalDespesa,
      saldo,
      receitasPendentes,
      despesasPendentes,
      receitasAtrasadas,
      despesasAtrasadas,
      projecaoMensal
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas financeiras:', error);
    throw new Error('Falha ao buscar estatísticas financeiras');
  }
}

// Função para gerar relatório financeiro - preparada para Prisma
export async function generateFinancialReport(filters: FinancialFilters): Promise<{
  reportData: FinancialData[];
  summary: {
    totalReceita: number;
    totalDespesa: number;
    saldo: number;
    quantidadeReceitas: number;
    quantidadeDespesas: number;
  };
}> {
  try {
    const result = await getFinancials(filters);

    const summary = {
      totalReceita: result.totalReceita,
      totalDespesa: result.totalDespesa,
      saldo: result.saldo,
      quantidadeReceitas: result.financials.filter(f => f.type === 'Receita').length,
      quantidadeDespesas: result.financials.filter(f => f.type === 'Despesa').length
    };

    return {
      reportData: result.financials,
      summary
    };
  } catch (error) {
    console.error('Erro ao gerar relatório financeiro:', error);
    throw new Error('Falha ao gerar relatório financeiro');
  }
}
