import { NextResponse } from "next/server"
import { userDb } from "@/lib/db/mock-users"

// GET /api/users/current - Obter usuário atual
export async function GET() {
  try {
    const user = await userDb.getCurrentUser()
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json(
      { error: "Failed to fetch current user" },
      { status: 500 }
    )
  }
}
