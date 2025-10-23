import { z } from "zod"

export const financialRecordSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Categoria é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().positive("Valor deve ser positivo"),
  dueDate: z.string().datetime().or(z.date()).optional(),
  paymentDate: z.string().datetime().or(z.date()).optional(),
  paymentMethod: z.string().optional(),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "REFUNDED", "CANCELLED"]).optional(),
  apartmentId: z.string().optional(),
  condominiumId: z.string().min(1, "Condomínio é obrigatório"),
})

export const updateFinancialRecordSchema = financialRecordSchema.partial().extend({
  id: z.string().min(1, "ID é obrigatório"),
})

export type FinancialRecordInput = z.infer<typeof financialRecordSchema>
export type UpdateFinancialRecordInput = z.infer<typeof updateFinancialRecordSchema>
