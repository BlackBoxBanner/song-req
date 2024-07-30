import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {NextRequest, NextResponse} from "next/server";

const revalidateAllPaths = () => {
  revalidatePath("/");
  revalidatePath("/admin");
};

export const GET = async () => {
  try {
    const songs = await prisma.song.findMany({
      orderBy: {
        createAt: "asc",
      },
    });
    return NextResponse.json(songs);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as {title: string};

    await prisma.song.create({
      data: {
        title: body.title,
      },
    });

    revalidateAllPaths();

    const allSongs = await prisma.song.findMany({
      orderBy: {
        createAt: "asc",
      },
    });
    return NextResponse.json(allSongs);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as {id: string};

    const song = await prisma.song.findUnique({
      where: {id: body.id},
    });

    if (song) {
      await prisma.song.update({
        where: {id: body.id},
        data: {done: !song.done},
      });

      revalidateAllPaths();

      const allSongs = await prisma.song.findMany({
        orderBy: {
          createAt: "asc",
        },
      });
      return NextResponse.json(allSongs);
    } else {
      throw new Error("Song not found");
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const {id, all = false} = (await request.json()) as {
      id: string;
      all: boolean;
    };

    if (all) {
      await prisma.song.deleteMany();
      revalidateAllPaths();
    } else {
      await prisma.song.update({
        where: {id},
        data: {
          delete: true,
        },
      });
    }

    revalidateAllPaths();

    const allSongs = await prisma.song.findMany({
      orderBy: {
        createAt: "asc",
      },
    });
    return NextResponse.json(allSongs);
  } catch (err: any) {
    throw new Error(err);
  }
};
