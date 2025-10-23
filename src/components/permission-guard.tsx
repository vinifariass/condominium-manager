"use client"

import { ReactNode } from "react"
import { useCurrentUserNextAuth } from "@/hooks/use-current-user-nextauth"
import { UserRole } from "@/lib/types/user"

interface PermissionGuardProps {
  children: ReactNode
  roles?: UserRole[]
  permissions?: string[]
  fallback?: ReactNode
}

export function PermissionGuard({ 
  children, 
  roles, 
  permissions, 
  fallback = null 
}: PermissionGuardProps) {
  const { user, permissions: userPermissions, loading } = useCurrentUserNextAuth()

  if (loading) {
    return <div className="animate-pulse">Carregando...</div>
  }

  if (!user) {
    return fallback
  }

  // Verificar roles se especificado
  if (roles && !roles.includes(user.role)) {
    return fallback
  }

  // Verificar permissões específicas se especificado
  if (permissions && userPermissions) {
    const hasPermission = permissions.some(permission => {
      switch (permission) {
        case "canManageCondominiums":
          return userPermissions.canManageCondominiums
        case "canManageUsers":
          return userPermissions.canManageUsers
        case "canManageFinancials":
          return userPermissions.canManageFinancials
        case "canManageReservations":
          return userPermissions.canManageReservations
        case "canManageTickets":
          return userPermissions.canManageTickets
        case "canManageApartments":
          return userPermissions.canManageApartments
        case "canManageResidents":
          return userPermissions.canManageResidents
        case "canManageEmployees":
          return userPermissions.canManageEmployees
        case "canViewReports":
          return userPermissions.canViewReports
        case "canViewDashboard":
          return userPermissions.canViewDashboard
        default:
          return false
      }
    })

    if (!hasPermission) {
      return fallback
    }
  }

  return <>{children}</>
}

// Componente de alta ordem para facilitar o uso
export function withPermissions(
  Component: React.ComponentType,
  roles?: UserRole[],
  permissions?: string[]
) {
  return function ProtectedComponent(props: any) {
    return (
      <PermissionGuard 
        roles={roles} 
        permissions={permissions}
        fallback={
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar esta área.
            </p>
          </div>
        }
      >
        <Component {...props} />
      </PermissionGuard>
    )
  }
}
