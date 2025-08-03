import { db } from "@/lib/db/mock-db"
import { Condominium } from "@/lib/types/condominium"

export async function getCondominiums(): Promise<Condominium[]> {
  try {
    const condominiums = await db.condominiums.findMany()
    return condominiums
  } catch (error) {
    console.error('Error fetching condominiums:', error)
    throw new Error('Failed to fetch condominiums')
  }
}

// Alias for getAllCondominiums to maintain compatibility
export async function getAllCondominiums(): Promise<Condominium[]> {
  return getCondominiums()
}

export async function getCondominiumById(id: number): Promise<Condominium | null> {
  try {
    const condominium = await db.condominiums.findById(id)
    return condominium || null
  } catch (error) {
    console.error('Error fetching condominium:', error)
    throw new Error('Failed to fetch condominium')
  }
}
