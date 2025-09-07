// import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
const AUTH_REQUIRED_PATHS = ["/chat", "/collections", "/integrations", "/chats"];
const NO_AUTH_PATHS = ["/", "/login", "/signup"];

export async function middleware(req: NextRequest) {
//   const tokenData = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const customToken = req.cookies.get("jwtToken");
  const pathname = req.nextUrl.pathname;

//   const isAuthenticated = Boolean(tokenData && customToken);
  const isAuthenticated = Boolean(customToken);

  // Redirect when logged in
  if (isAuthenticated && NO_AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  // Redirect when not logged in
  if (!isAuthenticated && AUTH_REQUIRED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect when no logged in and trying to access some other random route
  if (!isAuthenticated && !NO_AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect when logged in and trying to access some other random route
  if (isAuthenticated && !AUTH_REQUIRED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|.*\\..*).*)"],
};
