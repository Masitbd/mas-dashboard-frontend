import { getToken } from "next-auth/jwt";

import { NextRequest, NextResponse } from "next/server";
import { ENUM_USER } from "./enums/EnumUser";

const managerRoutes = ["/dashboard"];
const protectedRoutes = ["/profile"];
export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(req.nextUrl.origin);
  }
  // // Redirection if the user is not authenticated
  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(`${req.nextUrl.origin}/login`);
  }

  // // blocking navigation to login page if user is authenticated

  const isTokenExpired =
    token && Date.now() >= token?.data?.validity?.refresh_until * 1000;
  console.log(isTokenExpired);
  if (isTokenExpired && req.nextUrl.pathname !== "/login") {
    console.log("Token expired, redirecting to /login and clearing cookies");
    const response = NextResponse.redirect(`${req.nextUrl.origin}/login`);
    response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
    response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });
    return response;
  }

  if (req.nextUrl.pathname == "/") {
    return NextResponse.next();
  }

  // //Allowing admin and super admin to access all routes

  if (
    token?.data?.user?.role == ENUM_USER.SUPER_ADMIN ||
    token?.data?.user?.role == ENUM_USER.ADMIN
  ) {
    return NextResponse.next();
  }

  // // Allowing manager to access manager routes
  if (managerRoutes.includes(req.nextUrl.pathname)) {
    if (
      token?.data?.user?.role == ENUM_USER.ADMIN ||
      token?.data?.user?.role == ENUM_USER.SUPER_ADMIN
    ) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(`${req.nextUrl.origin}/unauthorized`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|reset-password|unauthorized|posts|about|authors|categories|contact|faq|privacy|search|tags|terms|write-on).*)",
  ],
};
