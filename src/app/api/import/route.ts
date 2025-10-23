import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as XLSX from 'xlsx';

// POST: Upload e processamento de arquivo Excel
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'residents', 'apartments', 'services'
    const condominiumId = formData.get('condominiumId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo é obrigatório' },
        { status: 400 }
      );
    }

    if (!condominiumId) {
      return NextResponse.json(
        { error: 'Condomínio é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se é um arquivo Excel
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo inválido. Use Excel (.xlsx, .xls) ou CSV' },
        { status: 400 }
      );
    }

    // Converter arquivo para buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Ler arquivo Excel
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Converter para JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return NextResponse.json(
        { error: 'Arquivo está vazio ou não contém dados válidos' },
        { status: 400 }
      );
    }

    let processResult;

    // Processar baseado no tipo
    switch (type) {
      case 'residents':
        processResult = await processResidentsImport(jsonData, condominiumId, session.user.id);
        break;
      case 'apartments':
        processResult = await processApartmentsImport(jsonData, condominiumId, session.user.id);
        break;
      case 'services':
        processResult = await processServicesImport(jsonData, condominiumId, session.user.id);
        break;
      default:
        return NextResponse.json(
          { error: 'Tipo de importação inválido' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: 'Importação processada com sucesso',
      ...processResult
    });

  } catch (error) {
    console.error('Erro ao processar importação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função para processar importação de moradores
async function processResidentsImport(data: any[], condominiumId: string, userId: string) {
  const results = {
    total: data.length,
    success: 0,
    errors: [] as string[]
  };

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      // Validar campos obrigatórios
      if (!row.nome || !row.email) {
        results.errors.push(`Linha ${i + 2}: Nome e email são obrigatórios`);
        continue;
      }

      // Simular criação (será implementado quando o Prisma funcionar)
      const residentData = {
        name: row.nome,
        email: row.email,
        phone: row.telefone || null,
        role: mapRole(row.tipo) || 'RESIDENT',
        status: mapStatus(row.status) || 'ACTIVE',
        condominiumId,
        apartmentNumber: row.apartamento || null,
        blockName: row.bloco || null
      };

      // Aqui seria a criação no banco de dados
      // await createResident(residentData);
      
      results.success++;
    } catch (error) {
      results.errors.push(`Linha ${i + 2}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  return results;
}

// Função para processar importação de apartamentos
async function processApartmentsImport(data: any[], condominiumId: string, userId: string) {
  const results = {
    total: data.length,
    success: 0,
    errors: [] as string[]
  };

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      if (!row.numero) {
        results.errors.push(`Linha ${i + 2}: Número do apartamento é obrigatório`);
        continue;
      }

      const apartmentData = {
        number: row.numero.toString(),
        floor: row.andar ? parseInt(row.andar) : null,
        bedrooms: row.quartos ? parseInt(row.quartos) : null,
        bathrooms: row.banheiros ? parseInt(row.banheiros) : null,
        area: row.area ? parseFloat(row.area) : null,
        condominiumId,
        blockName: row.bloco || null
      };

      // Aqui seria a criação no banco de dados
      // await createApartment(apartmentData);
      
      results.success++;
    } catch (error) {
      results.errors.push(`Linha ${i + 2}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  return results;
}

// Função para processar importação de serviços
async function processServicesImport(data: any[], condominiumId: string, userId: string) {
  const results = {
    total: data.length,
    success: 0,
    errors: [] as string[]
  };

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      if (!row.nome) {
        results.errors.push(`Linha ${i + 2}: Nome do serviço é obrigatório`);
        continue;
      }

      const serviceData = {
        name: row.nome,
        description: row.descricao || null,
        category: row.categoria || null,
        price: row.preco ? parseFloat(row.preco) : null,
        unit: row.unidade || null,
        active: row.ativo ? row.ativo.toLowerCase() === 'sim' : true,
        condominiumId
      };

      // Aqui seria a criação no banco de dados
      // await createService(serviceData);
      
      results.success++;
    } catch (error) {
      results.errors.push(`Linha ${i + 2}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  return results;
}

// Funções auxiliares para mapear dados
function mapRole(tipo: string): string {
  if (!tipo) return 'RESIDENT';
  
  const tipoLower = tipo.toLowerCase();
  if (tipoLower.includes('admin')) return 'ADMIN';
  if (tipoLower.includes('síndico') || tipoLower.includes('sindico')) return 'MANAGER';
  if (tipoLower.includes('funcionário') || tipoLower.includes('funcionario')) return 'EMPLOYEE';
  return 'RESIDENT';
}

function mapStatus(status: string): string {
  if (!status) return 'ACTIVE';
  
  const statusLower = status.toLowerCase();
  if (statusLower.includes('inativo')) return 'INACTIVE';
  if (statusLower.includes('suspenso')) return 'SUSPENDED';
  return 'ACTIVE';
}
