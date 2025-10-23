import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateReservationSchema } from "@/lib/validations/reservation"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: { commonArea: true, resident: { include: { apartment: true } } }
    })

    if (!reservation) return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    return NextResponse.json(reservation)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reservation" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateReservationSchema.parse({ ...body, id: params.id })
    const { id, ...updateData } = validatedData

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: updateData,
      include: { commonArea: true, resident: true }
    })

    return NextResponse.json(reservation)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    if (error.code === "P2025") return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.reservation.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Reservation deleted successfully" })
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 })
  }
}
