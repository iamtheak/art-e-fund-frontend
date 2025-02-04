import {NextResponse} from "next/server"
import {auth} from "./auth"
import type {NextRequest} from "next/server"
import {AUTHENTICATED_ROUTES, CREATOR_ROUTES} from "@/config/routes";
import {getUserFromSession} from "@/global/helper";

export default auth(async function middleware(req: NextRequest) {

    const user = await getUserFromSession();
    const pathname = req.nextUrl.pathname

    // Define authentication pages
    const authPages = ["/login", "/register"]
    const isProtectedRoute = AUTHENTICATED_ROUTES.some((route) => route === pathname)
    const isCreatorRoute = CREATOR_ROUTES.some((route) => route === pathname)
    // Check if the current path is an auth page
    const isAuthPage = authPages.includes(pathname)

    if (!user && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redirect authenticated users away from auth pages
    if (user && isAuthPage) {
        return NextResponse.redirect(new URL("/home", req.url))
    }

    // Allow access to public routes and asset images
    if (user) {
        const {role} = user;
        if (isCreatorRoute && role !== "creator") {
            return NextResponse.redirect(new URL("/home", req.url));
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        // Include all routes
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
}

