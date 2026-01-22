import { getToken } from "next-auth/jwt";

import { NextRequest, NextResponse } from "next/server";
import { ENUM_USER } from "./enums/EnumUser";
const unprotectedRoutes = [
  "/login",
  "/consumer/home",
  "/signup",
  "/consumer/category",
  "/",
];

const managerRoutes = [
  "/table",
  "/customer",
  "/menu-group",
  "/items",
  "/waiter",
  "/raw-material-setup",
  "/consumption",
  "/order",
  "/users",
  "/cancellation",
];

const otherUserRoutes = ["/customer", "/items", "'/consumption", "/order"];
export default async function middleware(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (token && req.nextUrl.pathname === "/login") {
  //   return NextResponse.redirect(req.nextUrl.origin);
  // }

  // // Redirection if the user is not authenticated
  // if (!token && !unprotectedRoutes.includes(req.nextUrl.pathname)) {
  //   return NextResponse.redirect(`${req.nextUrl.origin}/login`);
  // }

  // // blocking navigation to login page if user is authenticated

  // const isTokenExpired =
  //   token && Date.now() >= token?.data?.validity?.refresh_until * 1000;
  // console.log(isTokenExpired);
  // if (isTokenExpired && req.nextUrl.pathname !== "/login") {
  //   console.log("Token expired, redirecting to /login and clearing cookies");
  //   const response = NextResponse.redirect(`${req.nextUrl.origin}/login`);
  //   response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
  //   response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });
  //   return response;
  // }

  // // initial landing redirect
  // if (req.nextUrl.pathname == "/" && token?.data?.user?.role) {
  //   if (token?.data?.user?.role == "viewer") {
  //     return NextResponse.redirect(`${req.nextUrl.origin}`);
  //   }
  //   if (token?.data?.user?.role == ENUM_USER.SUPER_ADMIN) {
  //     return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);
  //   } else {
  //     return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);
  //   }
  // }

  // if (req.nextUrl.pathname == "/") {
  //   return NextResponse.redirect(`${req.nextUrl.origin}`);
  // }

  // //Allowing admin and super admin to access all routes

  // if (
  //   token?.data?.user?.role == ENUM_USER.SUPER_ADMIN ||
  //   token?.data?.user?.role == ENUM_USER.ADMIN
  // ) {
  //   return NextResponse.next();
  // }

  // // Allowing manager to access manager routes
  // if (managerRoutes.includes(req.nextUrl.pathname)) {
  //   if (
  //     token?.data?.user?.role == ENUM_USER.MANAGER ||
  //     token?.data?.user?.role == ENUM_USER.CASHIER ||
  //     token?.data?.user?.role == ENUM_USER.ACCOUNTANT
  //   ) {
  //     return NextResponse.next();
  //   } else {
  //     return NextResponse.redirect(`${req.nextUrl.origin}/unauthorized`);
  //   }
  // }

  // // Allowing user to access other user routes
  // if (otherUserRoutes.includes(req.nextUrl.pathname)) {
  //   if (token?.data?.user?.role !== ENUM_USER.USER) {
  //     return NextResponse.next();
  //   } else {
  //     return NextResponse.redirect(`${req.nextUrl.origin}/unauthorized`);
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|reset-password|unauthorized).*)",
  ],
};
