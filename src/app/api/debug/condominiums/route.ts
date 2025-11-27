import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Debug: Iniciando busca de condomínios...')

    const count = await prisma.condominium.count()
    console.log('Debug: Total de condomínios:', count)

    const condominiums = await prisma.condominium.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    console.log('Debug: Condomínios encontrados:', condominiums.length)

    const formatted = condominiums.map(condominium => ({
      ...condominium,
      phone: condominium.phone || undefined,
      email: condominium.email || undefined,
      cnpj: condominium.cnpj || undefined,
      city: condominium.city || undefined,
      state: condominium.state || undefined,
      zipCode: condominium.zipCode || undefined,
      manager: condominium.managerName || undefined,
      status: condominium.status.toLowerCase() as "active" | "inactive" | "maintenance",
      totalUnits: condominium.totalApartments || 0,
      totalBlocks: 0,
    }))

    return NextResponse.json({
      success: true,
      count,
      data: formatted
    })
  } catch (error) {
    console.error('Debug: Erro na API:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
