import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que precisam de autenticação
const protectedRoutes = [
  '/dashboard',
  '/apartments',
  '/residents',
  '/employees',
  '/financials',
  '/reservations',
  '/tickets',
  '/settings',
  '/users',
  '/condominiums',
  '/help',
  '/notifications',
  '/posts',
  '/categories',
  '/cards',
  '/tags',
  '/visitor-control',
  '/common-areas',
  '/pricing',
  '/account',
  '/switch-user'
]

// Rotas públicas (não precisam de autenticação)
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Se for a raiz, redirecionar para dashboard (que vai para login se não estiver logado)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Se for rota protegida, verificar se tem usuário logado
  if (isProtectedRoute) {
    // Em um app real, verificaríamos um token JWT ou session
    // Por ora, como estamos usando mock, vamos deixar passar
    // e deixar a verificação para o lado cliente
    return NextResponse.next()
  }

  // Para rotas públicas, continuar normalmente
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Para outras rotas, continuar normalmente
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
