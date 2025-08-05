import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET: Buscar moradores por condomínio
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const condominiumId = searchParams.get('condominiumId');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const role = searchParams.get('role') || 'all';
    const apartment = searchParams.get('apartment') || '';

    // Construir filtros para a query
    const where: any = {};
    
    if (condominiumId) {
      where.condominiumId = condominiumId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { apartment: { number: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (status !== 'all') {
      where.status = status === 'ACTIVE' ? 'ACTIVE' : status === 'INACTIVE' ? 'INACTIVE' : 'SUSPENDED';
    }

    if (role !== 'all') {
      where.role = role;
    }

    if (apartment) {
      where.apartment = {
        number: { contains: apartment, mode: 'insensitive' }
      };
    }

    const residents = await prisma.user.findMany({
      where,
      include: {
        apartment: {
          include: {
            block: true
          }
        },
        condominium: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transformar os dados para o formato esperado pelo frontend
    const formattedResidents = residents.map(resident => ({
      id: resident.id,
      name: resident.name || '',
      email: resident.email,
      phone: resident.phone || '',
      apartment: resident.apartment?.number || '',
      block: resident.apartment?.block?.name || '',
      role: resident.role,
      status: resident.status,
      avatar: resident.image,
      createdAt: resident.createdAt.toISOString().split('T')[0],
      condominiumId: resident.condominiumId,
      condominiumName: resident.condominium?.name || ''
    }));

    return NextResponse.json(formattedResidents);
  } catch (error) {
    console.error('Erro ao buscar moradores:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST: Criar novo morador
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      apartmentNumber,
      blockId,
      role,
      status,
      condominiumId
    } = body;

    // Validações básicas
    if (!name || !email || !condominiumId) {
      return NextResponse.json(
        { error: 'Nome, email e condomínio são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado no sistema' },
        { status: 400 }
      );
    }

    // Encontrar ou criar o apartamento
    let apartment = null;
    if (apartmentNumber) {
      apartment = await prisma.apartment.findFirst({
        where: {
          number: apartmentNumber,
          condominiumId: condominiumId,
          ...(blockId && { blockId })
        }
      });

      // Se não encontrar o apartamento, criar um novo
      if (!apartment) {
        apartment = await prisma.apartment.create({
          data: {
            number: apartmentNumber,
            condominiumId: condominiumId,
            ...(blockId && { blockId })
          }
        });
      }
    }

    // Criar o morador
    const newResident = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: role || 'RESIDENT',
        status: status || 'ACTIVE',
        condominiumId,
        ...(apartment && { apartmentId: apartment.id })
      },
      include: {
        apartment: {
          include: {
            block: true
          }
        },
        condominium: true
      }
    });

    // Formatar resposta
    const formattedResident = {
      id: newResident.id,
      name: newResident.name,
      email: newResident.email,
      phone: newResident.phone,
      apartment: newResident.apartment?.number || '',
      block: newResident.apartment?.block?.name || '',
      role: newResident.role,
      status: newResident.status,
      avatar: newResident.image,
      createdAt: newResident.createdAt.toISOString().split('T')[0],
      condominiumId: newResident.condominiumId,
      condominiumName: newResident.condominium?.name || ''
    };

    return NextResponse.json(formattedResident, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar morador:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT: Atualizar morador
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      email,
      phone,
      apartmentNumber,
      blockId,
      role,
      status,
      condominiumId
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do morador é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Morador não encontrado' },
        { status: 404 }
      );
    }

    // Encontrar ou criar o apartamento se foi fornecido
    let apartmentId = existingUser.apartmentId;
    if (apartmentNumber) {
      let apartment = await prisma.apartment.findFirst({
        where: {
          number: apartmentNumber,
          condominiumId: condominiumId || existingUser.condominiumId,
          ...(blockId && { blockId })
        }
      });

      if (!apartment) {
        apartment = await prisma.apartment.create({
          data: {
            number: apartmentNumber,
            condominiumId: condominiumId || existingUser.condominiumId!,
            ...(blockId && { blockId })
          }
        });
      }
      apartmentId = apartment.id;
    }

    // Atualizar o morador
    const updatedResident = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(role && { role }),
        ...(status && { status }),
        ...(condominiumId && { condominiumId }),
        ...(apartmentId && { apartmentId })
      },
      include: {
        apartment: {
          include: {
            block: true
          }
        },
        condominium: true
      }
    });

    // Formatar resposta
    const formattedResident = {
      id: updatedResident.id,
      name: updatedResident.name,
      email: updatedResident.email,
      phone: updatedResident.phone,
      apartment: updatedResident.apartment?.number || '',
      block: updatedResident.apartment?.block?.name || '',
      role: updatedResident.role,
      status: updatedResident.status,
      avatar: updatedResident.image,
      createdAt: updatedResident.createdAt.toISOString().split('T')[0],
      condominiumId: updatedResident.condominiumId,
      condominiumName: updatedResident.condominium?.name || ''
    };

    return NextResponse.json(formattedResident);
  } catch (error) {
    console.error('Erro ao atualizar morador:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE: Remover morador
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
        { error: 'ID do morador é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Morador não encontrado' },
        { status: 404 }
      );
    }

    // Remover o morador
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Morador removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover morador:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
