import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/login-new'
    }
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/apartments/:path*", 
    "/residents/:path*",
    "/financials/:path*",
    "/tickets/:path*",
    "/reservations/:path*",
    "/settings/:path*",
    "/account/:path*",
    "/(demo)/:path*",
    "/api/protected/:path*"
  ]
}
