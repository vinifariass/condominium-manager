import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock data para contratos de serviços
let mockContracts: Array<{
  id: string;
  serviceId: string;
  serviceName: string;
  condominiumId: string;
  condominiumName: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  value: number;
  paymentFrequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  description: string | null;
  createdAt: string;
  updatedAt: string;
}> = [
  {
    id: '1',
    serviceId: '1',
    serviceName: 'Limpeza de Apartamento',
    condominiumId: '1',
    condominiumName: 'Residencial Jardim das Flores',
    contractNumber: 'CONT-2025-001',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    value: 3600.00,
    paymentFrequency: 'MONTHLY',
    status: 'ACTIVE',
    description: 'Contrato anual para limpeza de áreas comuns',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    serviceId: '2',
    serviceName: 'Jardinagem',
    condominiumId: '1',
    condominiumName: 'Residencial Jardim das Flores',
    contractNumber: 'CONT-2025-002',
    startDate: '2025-02-01',
    endDate: '2025-09-05', // Vence em 5 dias para teste
    value: 2400.00,
    paymentFrequency: 'QUARTERLY',
    status: 'ACTIVE',
    description: 'Manutenção trimestral dos jardins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    serviceId: '3',
    serviceName: 'Manutenção Elétrica',
    condominiumId: '2',
    condominiumName: 'Condomínio Bela Vista',
    contractNumber: 'CONT-2025-003',
    startDate: '2025-03-01',
    endDate: '2025-09-15', // Vence em 15 dias para teste
    value: 1800.00,
    paymentFrequency: 'MONTHLY',
    status: 'ACTIVE',
    description: 'Suporte elétrico mensal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    serviceId: '4',
    serviceName: 'Pintura',
    condominiumId: '3',
    condominiumName: 'Edifício Central Park',
    contractNumber: 'CONT-2025-004',
    startDate: '2025-01-15',
    endDate: '2025-09-03', // Vence em 3 dias para teste
    value: 5000.00,
    paymentFrequency: 'YEARLY',
    status: 'ACTIVE',
    description: 'Pintura anual das fachadas',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET: Buscar contratos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const condominiumId = searchParams.get('condominiumId');
    const status = searchParams.get('status') || 'all';
    const daysToExpire = searchParams.get('daysToExpire');

    let filteredContracts = mockContracts;

    if (condominiumId) {
      filteredContracts = filteredContracts.filter(c => c.condominiumId === condominiumId);
    }

    if (status !== 'all') {
      filteredContracts = filteredContracts.filter(c => c.status === status);
    }

    // Filtrar por dias até vencimento
    if (daysToExpire) {
      const days = parseInt(daysToExpire);
      const currentDate = new Date();
      const targetDate = new Date();
      targetDate.setDate(currentDate.getDate() + days);

      filteredContracts = filteredContracts.filter(contract => {
        const endDate = new Date(contract.endDate);
        return endDate <= targetDate && endDate >= currentDate;
      });
    }

    // Adicionar informação de dias até vencimento
    const contractsWithDaysToExpire = filteredContracts.map(contract => {
      const currentDate = new Date();
      const endDate = new Date(contract.endDate);
      const timeDiff = endDate.getTime() - currentDate.getTime();
      const daysToExpire = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return {
        ...contract,
        daysToExpire,
        isExpiringSoon: daysToExpire <= 30 && daysToExpire > 0,
        isExpired: daysToExpire < 0
      };
    });

    return NextResponse.json(contractsWithDaysToExpire);
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST: Criar novo contrato
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      serviceId,
      serviceName,
      condominiumId,
      condominiumName,
      contractNumber,
      startDate,
      endDate,
      value,
      paymentFrequency,
      description
    } = body;

    // Validações básicas
    if (!serviceId || !condominiumId || !startDate || !endDate || !value) {
      return NextResponse.json(
        { error: 'Dados obrigatórios: serviceId, condominiumId, startDate, endDate, value' },
        { status: 400 }
      );
    }

    // Criar novo contrato
    const newContract = {
      id: (mockContracts.length + 1).toString(),
      serviceId,
      serviceName: serviceName || 'Serviço',
      condominiumId,
      condominiumName: condominiumName || 'Condomínio',
      contractNumber: contractNumber || `CONT-${new Date().getFullYear()}-${String(mockContracts.length + 1).padStart(3, '0')}`,
      startDate,
      endDate,
      value: parseFloat(value),
      paymentFrequency: paymentFrequency || 'MONTHLY',
      status: 'ACTIVE' as 'ACTIVE' | 'EXPIRED' | 'CANCELLED',
      description: description || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockContracts.push(newContract);

    return NextResponse.json(newContract, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT: Atualizar contrato
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do contrato é obrigatório' },
        { status: 400 }
      );
    }

    const contractIndex = mockContracts.findIndex(c => c.id === id);
    if (contractIndex === -1) {
      return NextResponse.json(
        { error: 'Contrato não encontrado' },
        { status: 404 }
      );
    }

    mockContracts[contractIndex] = {
      ...mockContracts[contractIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(mockContracts[contractIndex]);
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
