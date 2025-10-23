import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { residentSchema } from "@/lib/validations/resident"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const condominiumId = searchParams.get("condominiumId")
    const apartmentId = searchParams.get("apartmentId")
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    const where: any = {}
    if (condominiumId) where.condominiumId = condominiumId
    if (apartmentId) where.apartmentId = apartmentId
    if (type) where.type = type
    if (status) where.status = status

    const residents = await prisma.resident.findMany({
      where,
      include: {
        apartment: {
          select: {
            number: true,
            block: {
              select: {
                name: true,
              }
            }
          }
        },
        vehicles: true,
        pets: true,
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(residents)
  } catch (error) {
    console.error("Error fetching residents:", error)
    return NextResponse.json({ error: "Failed to fetch residents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = residentSchema.parse(body)

    const resident = await prisma.resident.create({
      data: validatedData,
      include: {
        apartment: true,
        vehicles: true,
        pets: true,
      }
    })

    return NextResponse.json(resident, { status: 201 })
  } catch (error: any) {
    console.error("Error creating resident:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create resident" }, { status: 500 })
  }
}
