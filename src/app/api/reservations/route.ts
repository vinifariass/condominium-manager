import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { reservationSchema } from "@/lib/validations/reservation"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const condominiumId = searchParams.get("condominiumId")
    const status = searchParams.get("status")

    const where: any = {}
    if (condominiumId) where.condominiumId = condominiumId
    if (status) where.status = status

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        commonArea: true,
        resident: { select: { name: true, phone: true, apartment: { select: { number: true } } } },
      },
      orderBy: { date: "desc" }
    })

    return NextResponse.json(reservations)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = reservationSchema.parse(body)

    const reservation = await prisma.reservation.create({
      data: validatedData,
      include: { commonArea: true, resident: true }
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}
