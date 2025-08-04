"use client"

import { useState, useEffect } from "react"
import { User, UserPermissions, getUserPermissions } from "@/lib/types/user"
import { getCurrentUser } from "@/lib/data/users"
import { updateUser } from "@/lib/actions/user-actions"
import { toast } from "sonner"

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const loadUser = async () => {
    try {
      setLoading(true)
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setPermissions(getUserPermissions(currentUser.role))
    } catch (error) {
      console.error("Error loading current user:", error)
      toast.error("Erro ao carregar dados do usuário")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return { success: false, error: "No user logged in" }
    
    try {
      setUpdating(true)
      const result = await updateUser(user.id, data)
      
      if (result.success && result.data) {
        setUser(result.data)
        setPermissions(getUserPermissions(result.data.role))
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
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  return {
    user,
    permissions,
    loading,
    updating,
    updateProfile,
    refreshUser: loadUser,
  }
}
