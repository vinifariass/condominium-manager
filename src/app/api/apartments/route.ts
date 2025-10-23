import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { apartmentSchema } from "@/lib/validations/apartment"

// GET /api/apartments - List all apartments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const condominiumId = searchParams.get("condominiumId")
    const status = searchParams.get("status")

    const where: any = {}
    if (condominiumId) where.condominiumId = condominiumId
    if (status) where.status = status

    const apartments = await prisma.apartment.findMany({
      where,
      include: {
        block: true,
        residents: true,
        condominium: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        number: "asc"
      }
    })

    return NextResponse.json(apartments)
  } catch (error) {
    console.error("Error fetching apartments:", error)
    return NextResponse.json(
      { error: "Failed to fetch apartments" },
      { status: 500 }
    )
  }
}

// POST /api/apartments - Create new apartment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = apartmentSchema.parse(body)

    const apartment = await prisma.apartment.create({
      data: validatedData,
      include: {
        block: true,
        residents: true,
      }
    })

    return NextResponse.json(apartment, { status: 201 })
  } catch (error: any) {
    console.error("Error creating apartment:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create apartment" },
      { status: 500 }
    )
  }
}
