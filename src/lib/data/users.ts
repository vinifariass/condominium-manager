import { userDb } from "@/lib/db/mock-users"
import { User } from "@/lib/types/user"

export async function getUsers(): Promise<User[]> {
  try {
    return await userDb.findMany()
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await userDb.findById(id)
  } catch (error) {
    console.error("Error fetching user:", error)
    throw new Error("Failed to fetch user")
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    return await userDb.getCurrentUser()
  } catch (error) {
    console.error("Error fetching current user:", error)
    throw new Error("Failed to fetch current user")
  }
}
