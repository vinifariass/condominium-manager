import { prisma } from "@/lib/prisma"
import { Condominium } from "@/lib/types/condominium"

export async function getCondominiums(): Promise<Condominium[]> {
  try {
    const condominiums = await prisma.condominium.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return condominiums.map(condominium => ({
      ...condominium,
      phone: condominium.phone || undefined,
      email: condominium.email || undefined,
      cnpj: condominium.cnpj || undefined,
      city: condominium.city || undefined,
      state: condominium.state || undefined,
      zipCode: condominium.zipCode || undefined,
      manager: condominium.manager || undefined,
      status: condominium.status.toLowerCase() as "active" | "inactive" | "maintenance",
      totalUnits: condominium.totalUnits || 0,
      totalBlocks: condominium.totalBlocks || 0,
    }))
  } catch (error) {
    console.error('Error fetching condominiums:', error)
    throw new Error('Failed to fetch condominiums')
  }
}

// Alias for getAllCondominiums to maintain compatibility
export async function getAllCondominiums(): Promise<Condominium[]> {
  return getCondominiums()
}

export async function getCondominiumById(id: string): Promise<Condominium | null> {
  try {
    const condominium = await prisma.condominium.findUnique({
      where: { id }
    })
    
    if (!condominium) return null
    
    return {
      ...condominium,
      phone: condominium.phone || undefined,
      email: condominium.email || undefined,
      cnpj: condominium.cnpj || undefined,
      city: condominium.city || undefined,
      state: condominium.state || undefined,
      zipCode: condominium.zipCode || undefined,
      manager: condominium.manager || undefined,
      status: condominium.status.toLowerCase() as "active" | "inactive" | "maintenance",
      totalUnits: condominium.totalUnits || 0,
      totalBlocks: condominium.totalBlocks || 0,
    }
  } catch (error) {
    console.error('Error fetching condominium:', error)
    throw new Error('Failed to fetch condominium')
  }
}

export async function createCondominium(data: Omit<Condominium, 'id' | 'createdAt' | 'updatedAt'>): Promise<Condominium> {
  try {
    const condominium = await prisma.condominium.create({
      data: {
        ...data,
        status: data.status.toUpperCase() as "ACTIVE" | "INACTIVE" | "MAINTENANCE",
      }
    })
    
    return {
      ...condominium,
      phone: condominium.phone || undefined,
      email: condominium.email || undefined,
      cnpj: condominium.cnpj || undefined,
      city: condominium.city || undefined,
      state: condominium.state || undefined,
      zipCode: condominium.zipCode || undefined,
      manager: condominium.manager || undefined,
      status: condominium.status.toLowerCase() as "active" | "inactive" | "maintenance",
      totalUnits: condominium.totalUnits || 0,
      totalBlocks: condominium.totalBlocks || 0,
    }
  } catch (error) {
    console.error('Error creating condominium:', error)
    throw new Error('Failed to create condominium')
  }
}

export async function updateCondominium(id: string, data: Partial<Omit<Condominium, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Condominium> {
  try {
    const updateData: any = { ...data }
    if (updateData.status) {
      updateData.status = updateData.status.toUpperCase()
    }
    
    const condominium = await prisma.condominium.update({
      where: { id },
      data: updateData
    })
    
    return {
      ...condominium,
      phone: condominium.phone || undefined,
      email: condominium.email || undefined,
      cnpj: condominium.cnpj || undefined,
      city: condominium.city || undefined,
      state: condominium.state || undefined,
      zipCode: condominium.zipCode || undefined,
      manager: condominium.manager || undefined,
      status: condominium.status.toLowerCase() as "active" | "inactive" | "maintenance",
      totalUnits: condominium.totalUnits || 0,
      totalBlocks: condominium.totalBlocks || 0,
    }
  } catch (error) {
    console.error('Error updating condominium:', error)
    throw new Error('Failed to update condominium')
  }
}

export async function deleteCondominium(id: string): Promise<boolean> {
  try {
    await prisma.condominium.delete({
      where: { id }
    })
    return true
  } catch (error) {
    console.error('Error deleting condominium:', error)
    throw new Error('Failed to delete condominium')
  }
}
