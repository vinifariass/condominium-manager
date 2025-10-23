"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { User, UserPermissions, getUserPermissions } from "@/lib/types/user"
import { getCurrentUser } from "@/lib/data/users"
import { toast } from "sonner"

interface UserContextType {
  user: User | null
  permissions: UserPermissions | null
  loading: boolean
  refreshUser: () => Promise<void>
  forceRefresh: () => void
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  const isPublicRoute = ['/login', '/register', '/forgot-password'].includes(pathname)

  const loadUser = async () => {
    try {
      setLoading(true)
      console.log("UserContext: Loading user...")
      const currentUser = await getCurrentUser()
      console.log("UserContext: User loaded:", currentUser)
      
      if (currentUser) {
        setUser(currentUser)
        setPermissions(getUserPermissions(currentUser.role))
        console.log("UserContext: Permissions set:", getUserPermissions(currentUser.role))
      } else {
        console.log("UserContext: No user found")
        setUser(null)
        setPermissions(null)
        
        // Se não for uma rota pública e não conseguir carregar usuário, redirecionar para login
        if (!isPublicRoute) {
          console.log("UserContext: No user found, redirecting to login")
          router.push("/login")
        }
      }
    } catch (error) {
      console.error("UserContext: Error loading current user:", error)
      setUser(null)
      setPermissions(null)
      
      // Se não for uma rota pública e não conseguir carregar usuário, redirecionar para login
      if (!isPublicRoute) {
        console.log("UserContext: Error loading user, redirecting to login")
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const logout = async () => {
    try {
      console.log("UserContext: Logging out user...")
      setLoading(true)
      setUser(null)
      setPermissions(null)
      
      // Limpar localStorage
      localStorage.removeItem('rememberedUser')
      
      console.log("UserContext: User logged out successfully")
      toast.success("Logout realizado com sucesso!")
    } catch (error) {
      console.error("UserContext: Error during logout:", error)
      toast.error("Erro ao fazer logout")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [refreshKey])

  // Escutar eventos customizados para atualizar o usuário
  useEffect(() => {
    const handleUserChange = () => {
      console.log("UserContext: User change event received")
      forceRefresh()
    }

    window.addEventListener('user-changed', handleUserChange)
    return () => window.removeEventListener('user-changed', handleUserChange)
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        permissions,
        loading,
        refreshUser: loadUser,
        forceRefresh,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}
