import { z } from "zod"

export const residentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().min(1, "Telefone é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  rg: z.string().optional(),
  birthDate: z.string().datetime().or(z.date()).optional(),
  type: z.enum(["OWNER", "TENANT", "DEPENDENT"]),
  apartmentId: z.string().min(1, "Apartamento é obrigatório"),
  condominiumId: z.string().min(1, "Condomínio é obrigatório"),
  isOwner: z.boolean().default(false),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
})

export const updateResidentSchema = residentSchema.partial().extend({
  id: z.string().min(1, "ID é obrigatório"),
})

export type ResidentInput = z.infer<typeof residentSchema>
export type UpdateResidentInput = z.infer<typeof updateResidentSchema>
