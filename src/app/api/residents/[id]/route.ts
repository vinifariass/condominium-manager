import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateResidentSchema } from "@/lib/validations/resident"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resident = await prisma.resident.findUnique({
      where: { id: params.id },
      include: {
        apartment: true,
        vehicles: true,
        pets: true,
        reservations: { take: 5, orderBy: { createdAt: "desc" } },
        tickets: { take: 5, orderBy: { createdAt: "desc" } },
      }
    })

    if (!resident) {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 })
    }

    return NextResponse.json(resident)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resident" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateResidentSchema.parse({ ...body, id: params.id })
    const { id, ...updateData } = validatedData

    const resident = await prisma.resident.update({
      where: { id: params.id },
      data: updateData,
      include: { apartment: true, vehicles: true, pets: true }
    })

    return NextResponse.json(resident)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to update resident" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.resident.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Resident deleted successfully" })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to delete resident" }, { status: 500 })
  }
}
