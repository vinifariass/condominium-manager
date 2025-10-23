import { z } from "zod"

export const visitorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().optional(),
  document: z.string().min(1, "Documento é obrigatório"),
  visitingResidentId: z.string().min(1, "Morador visitado é obrigatório"),
  condominiumId: z.string().min(1, "Condomínio é obrigatório"),
  vehiclePlate: z.string().optional(),
  company: z.string().optional(),
  purpose: z.string().min(1, "Motivo da visita é obrigatório"),
  type: z.enum(["VISITOR", "DELIVERY", "SERVICE", "CONTRACTOR"]).optional(),
  status: z.enum(["WAITING", "AUTHORIZED", "DENIED", "ENTERED", "LEFT"]).optional(),
})

export const updateVisitorSchema = visitorSchema.partial().extend({
  id: z.string().min(1, "ID é obrigatório"),
})

export type VisitorInput = z.infer<typeof visitorSchema>
export type UpdateVisitorInput = z.infer<typeof updateVisitorSchema>
