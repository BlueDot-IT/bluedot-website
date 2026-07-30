import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This function runs after authentication is verified
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");

    // If user is not authenticated and trying to access protected routes
    if (!isAuth && !isAuthPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If user is authenticated and trying to access login page
    if (isAuth && token?.isAdmin === true && isAuthPage) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuth = !!token;
        const isAdmin = token?.isAdmin === true;
        const isAuthPage = req.nextUrl.pathname.startsWith("/login");
        const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

        // Allow access to login page without authentication
        if (isAuthPage) {
          return true;
        }

        // Require authentication for admin pages
        if (isAdminPage) {
          return isAuth && isAdmin;
        }

        // Allow all other pages
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/login"
  ]
};
