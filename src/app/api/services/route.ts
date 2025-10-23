import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Buscar serviços
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const condominiumId = searchParams.get('condominiumId');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const active = searchParams.get('active') || 'all';

    // Construir filtros para o Prisma
    const where: any = {};

    if (condominiumId) {
      where.condominiumId = condominiumId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (active !== 'all') {
      where.active = active === 'true';
    }

    console.log('Buscando serviços no banco de dados...');
    const services = await prisma.service.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Encontrados ${services.length} serviços`);
    return NextResponse.json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST: Criar novo serviço
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      price,
      unit,
      active,
      condominiumId
    } = body;

    // Validações básicas
    if (!name || !condominiumId) {
      return NextResponse.json(
        { error: 'Nome e condomínio são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('Criando novo serviço no banco de dados...');
    const newService = await prisma.service.create({
      data: {
        name,
        description: description || null,
        category: category || null,
        price: price ? parseFloat(price) : null,
        unit: unit || null,
        active: active !== undefined ? active : true,
        condominiumId
      }
    });

    console.log('Serviço criado:', newService.id);
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT: Atualizar serviço
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
        { error: 'ID do serviço é obrigatório' },
        { status: 400 }
      );
    }

    console.log('Atualizando serviço:', id);
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.price && { price: parseFloat(updateData.price) })
      }
    });

    console.log('Serviço atualizado:', updatedService.id);
    return NextResponse.json(updatedService);
  } catch (error: any) {
    console.error('Erro ao atualizar serviço:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE: Remover serviço
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do serviço é obrigatório' },
        { status: 400 }
      );
    }

    console.log('Removendo serviço:', id);
    await prisma.service.delete({
      where: { id }
    });

    console.log('Serviço removido:', id);
    return NextResponse.json({ message: 'Serviço removido com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover serviço:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
