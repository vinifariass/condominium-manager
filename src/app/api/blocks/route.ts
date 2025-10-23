import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET: Buscar blocos por condomínio
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const condominiumId = searchParams.get('condominiumId');

    if (!condominiumId) {
      return NextResponse.json(
        { error: 'ID do condomínio é obrigatório' },
        { status: 400 }
      );
    }

    const blocks = await prisma.block.findMany({
      where: {
        condominiumId
      },
      include: {
        _count: {
          select: {
            apartments: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedBlocks = blocks.map(block => ({
      id: block.id,
      name: block.name,
      description: block.description,
      apartmentCount: block._count.apartments,
      condominiumId: block.condominiumId
    }));

    return NextResponse.json(formattedBlocks);
  } catch (error) {
    console.error('Erro ao buscar blocos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
