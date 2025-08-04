"use server"

import { userDb } from "@/lib/db/mock-users"
import { CreateUserInput, UpdateUserInput } from "@/lib/types/user"

export async function createUser(data: CreateUserInput) {
  try {
    const user = await userDb.create(data)
    return { success: true, data: user }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(id: string, data: UpdateUserInput) {
  try {
    const user = await userDb.update(id, data)
    if (!user) {
      return { success: false, error: "User not found" }
    }
    return { success: true, data: user }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    const success = await userDb.delete(id)
    if (!success) {
      return { success: false, error: "User not found" }
    }
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

export async function setCurrentUser(userId: string) {
  try {
    const user = await userDb.setCurrentUser(userId)
    if (!user) {
      return { success: false, error: "User not found" }
    }
    return { success: true, data: user }
  } catch (error) {
    console.error("Error setting current user:", error)
    return { success: false, error: "Failed to set current user" }
  }
}
