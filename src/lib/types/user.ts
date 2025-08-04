export type UserRole = "admin" | "manager" | "resident" | "employee"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: UserRole
  status: "active" | "inactive"
  condominiumId?: string // Para usuários que pertencem a um condomínio específico
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  name: string
  email: string
  phone?: string
  avatar?: string
  role: UserRole
  condominiumId?: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  phone?: string
  avatar?: string
  role?: UserRole
  status?: "active" | "inactive"
  condominiumId?: string
}

export interface UserPermissions {
  canViewDashboard: boolean
  canManageCondominiums: boolean
  canManageUsers: boolean
  canManageFinancials: boolean
  canManageReservations: boolean
  canManageTickets: boolean
  canManageApartments: boolean
  canManageResidents: boolean
  canManageEmployees: boolean
  canViewReports: boolean
}

export const getUserPermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case "admin":
      return {
        canViewDashboard: true,
        canManageCondominiums: true,
        canManageUsers: true,
        canManageFinancials: true,
        canManageReservations: true,
        canManageTickets: true,
        canManageApartments: true,
        canManageResidents: true,
        canManageEmployees: true,
        canViewReports: true,
      }
    case "manager":
      return {
        canViewDashboard: true,
        canManageCondominiums: false,
        canManageUsers: false,
        canManageFinancials: true,
        canManageReservations: true,
        canManageTickets: true,
        canManageApartments: true,
        canManageResidents: true,
        canManageEmployees: true,
        canViewReports: true,
      }
    case "employee":
      return {
        canViewDashboard: true,
        canManageCondominiums: false,
        canManageUsers: false,
        canManageFinancials: false,
        canManageReservations: true,
        canManageTickets: true,
        canManageApartments: false,
        canManageResidents: false,
        canManageEmployees: false,
        canViewReports: false,
      }
    case "resident":
      return {
        canViewDashboard: false,
        canManageCondominiums: false,
        canManageUsers: false,
        canManageFinancials: false,
        canManageReservations: true,
        canManageTickets: true,
        canManageApartments: false,
        canManageResidents: false,
        canManageEmployees: false,
        canViewReports: false,
      }
    default:
      return {
        canViewDashboard: false,
        canManageCondominiums: false,
        canManageUsers: false,
        canManageFinancials: false,
        canManageReservations: false,
        canManageTickets: false,
        canManageApartments: false,
        canManageResidents: false,
        canManageEmployees: false,
        canViewReports: false,
      }
  }
}

export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "Administrador"
    case "manager":
      return "Síndico"
    case "employee":
      return "Funcionário"
    case "resident":
      return "Morador"
    default:
      return role
  }
}
