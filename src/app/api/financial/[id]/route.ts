import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateFinancialRecordSchema } from "@/lib/validations/financial"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const record = await prisma.financialRecord.findUnique({
      where: { id: params.id },
      include: { apartment: true, condominium: true }
    })

    if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 })
    return NextResponse.json(record)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch financial record" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateFinancialRecordSchema.parse({ ...body, id: params.id })
    const { id, ...updateData } = validatedData

    const record = await prisma.financialRecord.update({
      where: { id: params.id },
      data: updateData,
      include: { apartment: true }
    })

    return NextResponse.json(record)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    if (error.code === "P2025") return NextResponse.json({ error: "Record not found" }, { status: 404 })
    return NextResponse.json({ error: "Failed to update financial record" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.financialRecord.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Financial record deleted successfully" })
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Record not found" }, { status: 404 })
    return NextResponse.json({ error: "Failed to delete financial record" }, { status: 500 })
  }
}
