import { User, CreateUserInput, UpdateUserInput } from "@/lib/types/user"

// Mock database para usuários
let users: User[] = [
  {
    id: "1",
    name: "Administrador Sistema",
    email: "admin@sistema.com",
    phone: "(11) 99999-9999",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98888-8888",
    role: "manager",
    status: "active",
    condominiumId: "1",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 97777-7777",
    role: "employee",
    status: "active",
    condominiumId: "1",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "4",
    name: "Carlos Morador",
    email: "carlos.morador@email.com",
    phone: "(11) 96666-6666",
    role: "resident",
    status: "active",
    condominiumId: "1",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
  },
]

// Simular usuário logado (inicialmente null - ninguém logado)
let currentUser: User | null = null

export const userDb = {
  // Buscar todos os usuários
  findMany: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 100)) // Simular delay
    return [...users]
  },

  // Buscar usuário por ID
  findById: async (id: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return users.find(user => user.id === id) || null
  },

  // Buscar usuário por email
  findByEmail: async (email: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return users.find(user => user.email === email) || null
  },

  // Criar novo usuário
  create: async (data: CreateUserInput): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const newUser: User = {
      id: (users.length + 1).toString(),
      ...data,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    users.push(newUser)
    return newUser
  },

  // Atualizar usuário
  update: async (id: string, data: UpdateUserInput): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return null
    
    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updatedAt: new Date(),
    }
    
    // Se estamos atualizando o usuário atual, atualizar também
    if (currentUser.id === id) {
      currentUser = users[userIndex]
    }
    
    return users[userIndex]
  },

  // Deletar usuário
  delete: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return false
    
    users.splice(userIndex, 1)
    return true
  },

  // Obter usuário atual
  getCurrentUser: async (): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 50))
    console.log("MockDB: getCurrentUser called, currentUser:", currentUser)
    return currentUser ? { ...currentUser } : null
  },

  // Definir usuário atual (para simulação de login)
  setCurrentUser: async (userId: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log("MockDB: setCurrentUser called with userId:", userId)
    console.log("MockDB: Available users:", users.map(u => ({id: u.id, name: u.name, role: u.role})))
    
    const user = users.find(u => u.id === userId)
    if (user) {
      currentUser = user
      console.log("MockDB: setCurrentUser success, new currentUser:", currentUser)
      return { ...user }
    }
    console.log("MockDB: setCurrentUser failed, user not found for id:", userId)
    return null
  },
}
