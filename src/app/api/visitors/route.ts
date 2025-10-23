import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { visitorSchema } from "@/lib/validations/visitor"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const condominiumId = searchParams.get("condominiumId")
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    const where: any = {}
    if (condominiumId) where.condominiumId = condominiumId
    if (status) where.status = status
    if (type) where.type = type

    const visitors = await prisma.visitor.findMany({
      where,
      include: {
        visitingResident: { select: { name: true, phone: true, apartment: { select: { number: true, block: { select: { name: true } } } } } }
      },
      orderBy: { arrivalTime: "desc" }
    })

    return NextResponse.json(visitors)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch visitors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = visitorSchema.parse(body)

    const visitor = await prisma.visitor.create({
      data: validatedData,
      include: { visitingResident: true }
    })

    return NextResponse.json(visitor, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create visitor" }, { status: 500 })
  }
}
