export interface Condominium {
  id: number
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  description?: string
  totalUnits: number
  totalBlocks: number
  manager?: string
  managerId?: number
  phone?: string
  email?: string
  cnpj?: string
  status: "active" | "inactive" | "maintenance"
  createdAt: Date
  updatedAt: Date
}

export interface CreateCondominiumInput {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  description?: string
  totalUnits: number
  totalBlocks: number
  manager?: string
  managerId?: number
  phone?: string
  email?: string
  cnpj?: string
  status: "active" | "inactive" | "maintenance"
}

export interface UpdateCondominiumInput extends Partial<CreateCondominiumInput> {
  id: number
}
