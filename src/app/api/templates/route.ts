import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as XLSX from 'xlsx';

// Templates de exemplo para cada tipo
const templates = {
  residents: [
    {
      'Nome Completo': 'João Silva Santos',
      'Email': 'joao.silva@email.com',
      'Telefone': '(11) 99999-1234',
      'CPF': '123.456.789-01',
      'Bloco': 'A',
      'Apartamento': '101',
      'Tipo': 'PROPRIETARIO',
      'Data Nascimento': '1985-03-15',
      'Ativo': 'SIM'
    },
    {
      'Nome Completo': 'Maria Oliveira Costa',
      'Email': 'maria.oliveira@email.com',
      'Telefone': '(11) 99999-5678',
      'CPF': '987.654.321-09',
      'Bloco': 'B',
      'Apartamento': '202',
      'Tipo': 'INQUILINO',
      'Data Nascimento': '1990-07-22',
      'Ativo': 'SIM'
    }
  ],
  apartments: [
    {
      'Bloco': 'A',
      'Numero': '101',
      'Andar': '1',
      'Quartos': '2',
      'Banheiros': '1',
      'Area (m²)': '65.5',
      'Valor Condominio': '450.00',
      'Observacoes': 'Apartamento com vista para jardim',
      'Ativo': 'SIM'
    },
    {
      'Bloco': 'A',
      'Numero': '102',
      'Andar': '1',
      'Quartos': '3',
      'Banheiros': '2',
      'Area (m²)': '85.0',
      'Valor Condominio': '580.00',
      'Observacoes': 'Apartamento com sacada',
      'Ativo': 'SIM'
    }
  ],
  services: [
    {
      'Nome': 'Limpeza Residencial',
      'Descricao': 'Serviço completo de limpeza de apartamentos',
      'Categoria': 'Limpeza',
      'Preco': '120.00',
      'Unidade': 'hora',
      'Ativo': 'SIM'
    },
    {
      'Nome': 'Manutenção Elétrica',
      'Descricao': 'Serviços de eletricista predial',
      'Categoria': 'Manutenção',
      'Preco': '85.00',
      'Unidade': 'hora',
      'Ativo': 'SIM'
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || !templates[type as keyof typeof templates]) {
      return NextResponse.json(
        { error: 'Tipo de template inválido. Use: residents, apartments ou services' },
        { status: 400 }
      );
    }

    // Criar planilha Excel
    const templateData = templates[type as keyof typeof templates];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    // Gerar buffer do arquivo
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    // Definir nome do arquivo
    const typeNames = {
      residents: 'moradores',
      apartments: 'apartamentos', 
      services: 'servicos'
    };
    
    const fileName = `template-${typeNames[type as keyof typeof typeNames]}.xlsx`;

    // Retornar arquivo
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Erro ao gerar template:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
