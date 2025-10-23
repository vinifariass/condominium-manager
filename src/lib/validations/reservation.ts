import { z } from "zod"

export const reservationSchema = z.object({
  commonAreaId: z.string().min(1, "Área comum é obrigatória"),
  residentId: z.string().min(1, "Morador é obrigatório"),
  condominiumId: z.string().min(1, "Condomínio é obrigatório"),
  date: z.string().datetime().or(z.date()),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  guests: z.number().int().min(0, "Número de convidados inválido"),
  amount: z.number().min(0, "Valor inválido"),
  observation: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "OVERDUE", "REFUNDED", "CANCELLED"]).optional(),
})

export const updateReservationSchema = reservationSchema.partial().extend({
  id: z.string().min(1, "ID é obrigatório"),
})

export type ReservationInput = z.infer<typeof reservationSchema>
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>
