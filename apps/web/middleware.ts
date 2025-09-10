import { NextResponse, type NextRequest } from "next/server";

const AUTH_REQUIRED_PATHS = ["/chat", "/collections", "/integrations", "/chats"];
const NO_AUTH_PATHS = ["/", "/login", "/signup"];

export async function middleware(req: NextRequest) {
  const customToken = req.cookies.get("jwtToken");
  const pathname = req.nextUrl.pathname;

  const isAuthenticated = Boolean(customToken);

  // Redirect logged users
  if (isAuthenticated && NO_AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  // Redirect non-authenticated
  if (!isAuthenticated && AUTH_REQUIRED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect non-authenticated users from any random route
  if (!isAuthenticated && !NO_AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect authenticated users from random routes
  if (isAuthenticated && !AUTH_REQUIRED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|.*\\..*).*)"],
};
