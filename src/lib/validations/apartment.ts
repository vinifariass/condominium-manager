import { z } from "zod"

export const apartmentSchema = z.object({
  number: z.string().min(1, "Número é obrigatório"),
  floor: z.number().int().positive("Andar deve ser positivo"),
  area: z.number().positive("Área deve ser positiva"),
  bedrooms: z.number().int().min(0, "Número de quartos inválido"),
  bathrooms: z.number().int().min(0, "Número de banheiros inválido"),
  parkingSpots: z.number().int().min(0, "Número de vagas inválido"),
  monthlyFee: z.number().positive("Taxa mensal deve ser positiva"),
  blockId: z.string().optional(),
  condominiumId: z.string().min(1, "Condomínio é obrigatório"),
  status: z.enum(["OCCUPIED", "VACANT", "MAINTENANCE", "DEFAULTER"]).optional(),
})

export const updateApartmentSchema = apartmentSchema.partial().extend({
  id: z.string().min(1, "ID é obrigatório"),
})

export type ApartmentInput = z.infer<typeof apartmentSchema>
export type UpdateApartmentInput = z.infer<typeof updateApartmentSchema>
