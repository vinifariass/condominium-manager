import { useState, useEffect } from "react"

export interface Apartment {
  id: string
  number: string
  floor: number
  area: number
  bedrooms: number
  bathrooms: number
  parkingSpots: number
  monthlyFee: number
  status: string
  balance: number
  lastPaymentDate?: string
  block?: { name: string }
  residents?: any[]
  condominium?: { id: string; name: string }
}

export function useApartments(condominiumId?: string) {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApartments()
  }, [condominiumId])

  const fetchApartments = async () => {
    try {
      setLoading(true)
      const url = condominiumId
        ? `/api/apartments?condominiumId=${condominiumId}`
        : `/api/apartments`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch apartments")

      const data = await response.json()
      setApartments(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { apartments, loading, error, refetch: fetchApartments }
}
