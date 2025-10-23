import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { financialRecordSchema } from "@/lib/validations/financial"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const condominiumId = searchParams.get("condominiumId")
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    const where: any = {}
    if (condominiumId) where.condominiumId = condominiumId
    if (type) where.type = type
    if (status) where.status = status

    const records = await prisma.financialRecord.findMany({
      where,
      include: {
        apartment: { select: { number: true, block: { select: { name: true } } } }
      },
      orderBy: { dueDate: "desc" }
    })

    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch financial records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = financialRecordSchema.parse(body)

    const record = await prisma.financialRecord.create({
      data: validatedData,
      include: { apartment: true }
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create financial record" }, { status: 500 })
  }
}
