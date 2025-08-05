"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createCondominium as createCondominiumData, updateCondominium as updateCondominiumData, deleteCondominium as deleteCondominiumData, getCondominiums } from "@/lib/data/condominiums"
import { CreateCondominiumInput, UpdateCondominiumInput } from "@/lib/types/condominium"

export async function createCondominium(data: CreateCondominiumInput) {
  try {
    // Validate required fields
    if (!data.name || !data.address) {
      return {
        success: false,
        error: "Nome e endereço são obrigatórios"
      }
    }

    // Check if condominium with same CNPJ already exists
    if (data.cnpj) {
      const existingCondominiums = await getCondominiums()
      const cnpjExists = existingCondominiums.some(c => 
        c.cnpj === data.cnpj
      )

      if (cnpjExists) {
        return {
          success: false,
          error: "Já existe um condomínio com este CNPJ"
        }
      }
    }

    // Create the condominium
    const condominium = await createCondominiumData(data)

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

    // Check if CNPJ is being changed and if it conflicts with another condominium
    if (data.cnpj) {
      const allCondominiums = await getCondominiums()
      const cnpjExists = allCondominiums.some(c => 
        c.cnpj === data.cnpj && c.id !== data.id
      )

      if (cnpjExists) {
        return {
          success: false,
          error: "Já existe um condomínio com este CNPJ"
        }
      }
    }

    // Update the condominium
    const { id, ...updateData } = data
    const condominium = await updateCondominiumData(id, updateData)

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

export async function deleteCondominium(id: string) {
  try {
    // Delete the condominium
    await deleteCondominiumData(id)

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
