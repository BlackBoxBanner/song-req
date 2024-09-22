import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      username: name,
    },
    select: {
      live: true,
      limit: true,
      Song: true,
    },
  });

  return NextResponse.json(user);
};
