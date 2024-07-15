import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {NextRequest, NextResponse} from "next/server";

export const GET = async () => {
  const song = await prisma.song.findMany();
  return NextResponse.json(song);
};

export const PATCH = async (request: NextRequest) => {
  const body = (await request.json()) as {id: string};

  try {
    const song = await prisma.song.findUnique({
      where: {
        id: body.id,
      },
    });
    await prisma.song.update({
      where: {
        id: body.id,
      },
      data: {
        done: !song?.done,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({message: "Song updated"});
  } catch (err: any) {
    throw new Error(err);
  }
};

export const DELETE = async (request: NextRequest) => {
  const body = (await request.json()) as {id: string};

  try {
    await prisma.song.delete({
      where: {
        id: body.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({message: "Song updated"});
  } catch (err: any) {
    throw new Error(err);
  }
};
