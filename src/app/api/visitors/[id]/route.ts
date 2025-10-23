import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateVisitorSchema } from "@/lib/validations/visitor"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const visitor = await prisma.visitor.findUnique({
      where: { id: params.id },
      include: { visitingResident: { include: { apartment: true } } }
    })

    if (!visitor) return NextResponse.json({ error: "Visitor not found" }, { status: 404 })
    return NextResponse.json(visitor)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch visitor" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateVisitorSchema.parse({ ...body, id: params.id })
    const { id, ...updateData } = validatedData

    const visitor = await prisma.visitor.update({
      where: { id: params.id },
      data: updateData,
      include: { visitingResident: true }
    })

    return NextResponse.json(visitor)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    if (error.code === "P2025") return NextResponse.json({ error: "Visitor not found" }, { status: 404 })
    return NextResponse.json({ error: "Failed to update visitor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.visitor.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Visitor deleted successfully" })
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Visitor not found" }, { status: 404 })
    return NextResponse.json({ error: "Failed to delete visitor" }, { status: 500 })
  }
}
