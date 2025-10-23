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
    console.log('🔄 [updateCondominium] Iniciando atualização com dados:', data);
    
    // Validate required fields
    if (!data.id) {
      console.log('❌ [updateCondominium] ID do condomínio é obrigatório');
      return {
        success: false,
        error: "ID do condomínio é obrigatório"
      }
    }

    console.log('✅ [updateCondominium] Validação de ID passou');

    // Check if CNPJ is being changed and if it conflicts with another condominium
    if (data.cnpj) {
      console.log('🔍 [updateCondominium] Verificando conflito de CNPJ...');
      const allCondominiums = await getCondominiums()
      const cnpjExists = allCondominiums.some(c => 
        c.cnpj === data.cnpj && c.id !== data.id
      )

      if (cnpjExists) {
        console.log('❌ [updateCondominium] CNPJ já existe em outro condomínio');
        return {
          success: false,
          error: "Já existe um condomínio com este CNPJ"
        }
      }
      console.log('✅ [updateCondominium] Verificação de CNPJ passou');
    }

    // Update the condominium
    console.log('📝 [updateCondominium] Preparando dados para atualização...');
    const { id, ...updateData } = data
    console.log('📝 [updateCondominium] ID:', id);
    console.log('📝 [updateCondominium] Dados de atualização:', updateData);
    
    console.log('💾 [updateCondominium] Chamando updateCondominiumData...');
    const condominium = await updateCondominiumData(id, updateData)
    console.log('✅ [updateCondominium] Condomínio atualizado:', condominium);

    // Revalidate the condominiums page
    console.log('🔄 [updateCondominium] Revalidando cache...');
    revalidatePath("/condominiums")
    console.log('✅ [updateCondominium] Cache revalidado');

    return {
      success: true,
      data: condominium,
      message: "Condomínio atualizado com sucesso!"
    }
  } catch (error) {
    console.error('❌ [updateCondominium] Erro durante atualização:', error)
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
