import { NextRequest, NextResponse } from "next/server"
import { userDb } from "@/lib/db/mock-users"

// GET /api/users - Listar usuários
export async function GET() {
  try {
    const users = await userDb.findMany()
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// POST /api/users - Criar usuário
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const user = await userDb.create(data)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
