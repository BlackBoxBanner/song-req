import { signOut } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await signOut();
  const cookieStore = cookies();
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  return NextResponse.json({ message: "Session cleared" });
};
