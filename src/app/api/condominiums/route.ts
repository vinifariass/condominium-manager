import { NextRequest, NextResponse } from "next/server"
import { getCondominiums, getCondominiumById } from "@/lib/data/condominiums"
import { createCondominium, updateCondominium, deleteCondominium } from "@/lib/actions/condominiums"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      // Get single condominium
      const condominium = await getCondominiumById(parseInt(id))
      if (!condominium) {
        return NextResponse.json(
          { error: "Condomínio não encontrado" },
          { status: 404 }
        )
      }
      return NextResponse.json({ data: condominium })
    } else {
      // Get all condominiums
      const condominiums = await getCondominiums()
      return NextResponse.json({ data: condominiums })
    }
  } catch (error) {
    console.error("Error in GET /api/condominiums:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createCondominium(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: result.data,
      message: result.message
    }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/condominiums:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await updateCondominium(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: result.data,
      message: result.message
    })
  } catch (error) {
    console.error("Error in PUT /api/condominiums:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "ID do condomínio é obrigatório" },
        { status: 400 }
      )
    }

    const result = await deleteCondominium(parseInt(id))

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: result.message
    })
  } catch (error) {
    console.error("Error in DELETE /api/condominiums:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
