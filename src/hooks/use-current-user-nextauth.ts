"use client"

import { useSession } from "next-auth/react"
import { getUserPermissions, UserRole } from "@/lib/types/user"
import { toast } from "sonner"

export function useCurrentUserNextAuth() {
  const { data: session, status, update } = useSession()
  
  const user = session?.user ? {
    id: session.user.id || "",
    name: session.user.name || "",
    email: session.user.email || "",
    phone: session.user.phone || "",
    avatar: session.user.image || "",
    role: (session.user.role?.toLowerCase() || "resident") as UserRole,
    status: "active" as const,
    condominiumId: session.user.condominiumId || "",
    createdAt: new Date(),
    updatedAt: new Date()
  } : null

  const permissions = user ? getUserPermissions(user.role) : null
  const loading = status === "loading"

  const updateProfile = async (data: any) => {
    if (!user) return { success: false, error: "No user logged in" }
    
    try {
      // Aqui você pode implementar a lógica de atualização via API
      // Por enquanto vamos apenas simular
      await update(data)
      toast.success("Perfil atualizado com sucesso!")
      return { success: true, data }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Erro ao atualizar perfil")
      return { success: false, error: "Erro interno" }
    }
  }

  const refreshUser = async () => {
    await update()
  }

  return {
    user,
    permissions,
    loading,
    updating: false,
    updateProfile,
    refreshUser,
  }
}
