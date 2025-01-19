import { NextRequest } from "next/server";
import { auth } from "./auth";
import { NextResponse } from "next/server";

// Middleware configuration
export default auth(async function middleware(req: NextRequest) {
  const session = await auth();

  const pathname = req.nextUrl.pathname;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/", 
    "/login", 
    "/register", 
    "/api/auth",
    // Allow public access to creator profiles
    /^\/creator\/[\w-]+$/  // Matches /creator/username pattern
  ];

  // Check if the current path matches any public routes
  const isPublicRoute = publicRoutes.some(route => 
    typeof route === 'string' 
      ? pathname === route 
      : route.test(pathname)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for protected API routes
  if (pathname.startsWith("/api/")) {
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Handle home access
  if (pathname.startsWith("/home")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Allow access to home for all authenticated users
    // Role-specific sections can be handled in the page component
    return NextResponse.next();
  }

  // For any other protected pages
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

// Configure protected routes
export const config = {
  matcher: [
    // Protected routes
    "/home/:path*",
    "/profile/:path*",
    "/api/((?!auth).*)/:path*", // Protects all API routes except /api/auth/*
    
    // Include creator routes in matcher, middleware will handle public access
    "/creator/:path*",
    
    // Exclude authentication routes and static files
    "/((?!api/auth|login|register|_next/static|_next/image).*)",
  ],
};
