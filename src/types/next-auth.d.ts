import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      phone?: string | null
      condominiumId?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    phone?: string | null
    condominiumId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    phone?: string
    condominiumId?: string
  }
}
