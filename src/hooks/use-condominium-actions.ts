"use client"

import { useState, useTransition } from "react"
import { createCondominium, updateCondominium, deleteCondominium } from "@/lib/actions/condominiums"
import { CreateCondominiumInput, UpdateCondominiumInput, Condominium } from "@/lib/types/condominium"
import { showToast } from "@/lib/toast"

export function useCondominiumActions() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleCreateCondominium = async (data: CreateCondominiumInput) => {
    setIsLoading(true)
    
    try {
      const result = await createCondominium(data)
      
      if (result.success) {
        showToast("success", result.message || "Condomínio criado com sucesso!")
        return { success: true, data: result.data }
      } else {
        showToast("error", "Erro ao criar condomínio", result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      showToast("error", "Erro inesperado", "Ocorreu um erro ao criar o condomínio")
      return { success: false, error: "Erro inesperado" }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCondominium = async (data: UpdateCondominiumInput) => {
    setIsLoading(true)
    
    try {
      const result = await updateCondominium(data)
      
      if (result.success) {
        showToast("success", result.message || "Condomínio atualizado com sucesso!")
        return { success: true, data: result.data }
      } else {
        showToast("error", "Erro ao atualizar condomínio", result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      showToast("error", "Erro inesperado", "Ocorreu um erro ao atualizar o condomínio")
      return { success: false, error: "Erro inesperado" }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCondominium = async (id: number) => {
    setIsLoading(true)
    
    try {
      const result = await deleteCondominium(id)
      
      if (result.success) {
        showToast("success", result.message || "Condomínio excluído com sucesso!")
        return { success: true }
      } else {
        showToast("error", "Erro ao excluir condomínio", result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      showToast("error", "Erro inesperado", "Ocorreu um erro ao excluir o condomínio")
      return { success: false, error: "Erro inesperado" }
    } finally {
      setIsLoading(false)
    }
  }

  const loading = isLoading || isPending

  return {
    handleCreateCondominium,
    handleUpdateCondominium,
    handleDeleteCondominium,
    loading
  }
}
