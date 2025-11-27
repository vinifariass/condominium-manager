import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Auth.ts - Tentativa de login:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Auth.ts - Credenciais incompletas")
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          console.log("👤 Auth.ts - Usuário encontrado no banco:", user ? `${user.name} (${user.email}) - Role: ${user.role}` : "Nenhum")

          if (!user) {
            console.log("❌ Auth.ts - Usuário não encontrado no banco")
            return null
          }

          // Verificar senha
          if (!user.password) {
            console.log("❌ Auth.ts - Usuário sem senha cadastrada")
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log("🔑 Auth.ts - Senha válida:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("❌ Auth.ts - Senha incorreta")
            return null
          }

          console.log("✅ Auth.ts - Login autorizado para:", user.name)

          const authUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role.toLowerCase(),
            condominiumId: user.condominiumId,
          }

          console.log("📤 Auth.ts - Retornando user:", authUser)
          return authUser

        } catch (error) {
          console.error("❌ Auth.ts - Erro no banco:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔄 Auth.ts - JWT Callback - User:", user, "Token antes:", token)
      if (user) {
        token.role = user.role
        token.condominiumId = user.condominiumId || undefined
      }
      console.log("🔄 Auth.ts - JWT Callback - Token depois:", token)
      return token
    },
    async session({ session, token }) {
      console.log("📋 Auth.ts - Session Callback - Token:", token, "Session antes:", session)
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.condominiumId = token.condominiumId || null
      }
      console.log("📋 Auth.ts - Session Callback - Session depois:", session)
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log("🔄 Auth.ts - Redirect Callback - URL:", url, "BaseURL:", baseUrl)
      // Sempre redirecionar para o dashboard após login bem-sucedido
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
