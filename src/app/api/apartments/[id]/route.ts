import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateApartmentSchema } from "@/lib/validations/apartment"

// GET /api/apartments/[id] - Get single apartment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apartment = await prisma.apartment.findUnique({
      where: { id: params.id },
      include: {
        block: true,
        residents: true,
        vehicles: true,
        financialRecords: {
          orderBy: {
            createdAt: "desc"
          },
          take: 10
        },
        condominium: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    if (!apartment) {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(apartment)
  } catch (error) {
    console.error("Error fetching apartment:", error)
    return NextResponse.json(
      { error: "Failed to fetch apartment" },
      { status: 500 }
    )
  }
}

// PATCH /api/apartments/[id] - Update apartment
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateApartmentSchema.parse({ ...body, id: params.id })

    const { id, ...updateData } = validatedData

    const apartment = await prisma.apartment.update({
      where: { id: params.id },
      data: updateData,
      include: {
        block: true,
        residents: true,
      }
    })

    return NextResponse.json(apartment)
  } catch (error: any) {
    console.error("Error updating apartment:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update apartment" },
      { status: 500 }
    )
  }
}

// DELETE /api/apartments/[id] - Delete apartment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.apartment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Apartment deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting apartment:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Failed to delete apartment" },
      { status: 500 }
    )
  }
}
