"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db/mock-db"
import { CreateCondominiumInput, UpdateCondominiumInput } from "@/lib/types/condominium"

export async function createCondominium(data: CreateCondominiumInput) {
  try {
    // Validate required fields
    if (!data.name || !data.address || !data.city || !data.state || !data.zipCode || !data.totalUnits || !data.totalBlocks) {
      return {
        success: false,
        error: "Nome, endereço, cidade, estado, CEP, número de unidades e blocos são obrigatórios"
      }
    }

    // Check if condominium with same name already exists
    const existingCondominiums = await db.condominiums.findMany()
    const nameExists = existingCondominiums.some(c => 
      c.name.toLowerCase() === data.name.toLowerCase()
    )

    if (nameExists) {
      return {
        success: false,
        error: "Já existe um condomínio com este nome"
      }
    }

    // Create the condominium
    const condominium = await db.condominiums.create(data)

    // Revalidate the condominiums page to show updated data
    revalidatePath("/condominiums")

    return {
      success: true,
      data: condominium,
      message: "Condomínio criado com sucesso!"
    }
  } catch (error) {
    console.error("Error creating condominium:", error)
    return {
      success: false,
      error: "Erro interno do servidor. Tente novamente."
    }
  }
}

export async function updateCondominium(data: UpdateCondominiumInput) {
  try {
    // Validate required fields
    if (!data.id) {
      return {
        success: false,
        error: "ID do condomínio é obrigatório"
      }
    }

    // Check if condominium exists
    const existing = await db.condominiums.findById(data.id)
    if (!existing) {
      return {
        success: false,
        error: "Condomínio não encontrado"
      }
    }

    // Check if name is being changed and if it conflicts with another condominium
    if (data.name && data.name !== existing.name) {
      const allCondominiums = await db.condominiums.findMany()
      const nameExists = allCondominiums.some(c => 
        c.name.toLowerCase() === data.name!.toLowerCase() && c.id !== data.id
      )

      if (nameExists) {
        return {
          success: false,
          error: "Já existe um condomínio com este nome"
        }
      }
    }

    // Update the condominium
    const { id, ...updateData } = data
    const condominium = await db.condominiums.update(id, updateData)

    // Revalidate the condominiums page
    revalidatePath("/condominiums")

    return {
      success: true,
      data: condominium,
      message: "Condomínio atualizado com sucesso!"
    }
  } catch (error) {
    console.error("Error updating condominium:", error)
    return {
      success: false,
      error: "Erro interno do servidor. Tente novamente."
    }
  }
}

export async function deleteCondominium(id: number) {
  try {
    // Check if condominium exists
    const existing = await db.condominiums.findById(id)
    if (!existing) {
      return {
        success: false,
        error: "Condomínio não encontrado"
      }
    }

    // Delete the condominium
    await db.condominiums.delete(id)

    // Revalidate the condominiums page
    revalidatePath("/condominiums")

    return {
      success: true,
      message: "Condomínio excluído com sucesso!"
    }
  } catch (error) {
    console.error("Error deleting condominium:", error)
    return {
      success: false,
      error: "Erro interno do servidor. Tente novamente."
    }
  }
}
