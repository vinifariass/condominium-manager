"use client"

import { useUserContext } from "@/contexts/user-context"
import { updateUser } from "@/lib/actions/user-actions"
import { toast } from "sonner"
import { User } from "@/lib/types/user"

export function useCurrentUser() {
  const { user, permissions, loading, refreshUser, forceRefresh } = useUserContext()

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return { success: false, error: "No user logged in" }
    
    try {
      const result = await updateUser(user.id, data)
      
      if (result.success && result.data) {
        // Forçar refresh do contexto após atualização
        forceRefresh()
        toast.success("Perfil atualizado com sucesso!")
        return { success: true, data: result.data }
      } else {
        toast.error(result.error || "Erro ao atualizar perfil")
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Erro ao atualizar perfil")
      return { success: false, error: "Erro interno" }
    }
  }

  return {
    user,
    permissions,
    loading,
    updating: false, // Simplificando por enquanto
    updateProfile,
    refreshUser: forceRefresh, // Usar forceRefresh para garantir atualização
  }
}
