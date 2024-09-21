import authConfig from "@/config/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const isOnCreator = req.nextUrl.pathname.startsWith("/creator");
  const isOnAuth = req.nextUrl.pathname.startsWith("/auth");

  if (isOnCreator) {
    if (isLoggedIn) return NextResponse.next();
    return NextResponse.rewrite(new URL("/auth", req.nextUrl));
  }

  if (isOnAuth) {
    if (isLoggedIn)
      return NextResponse.redirect(new URL("/creator", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
