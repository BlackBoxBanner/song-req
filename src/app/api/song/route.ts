import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {NextRequest, NextResponse} from "next/server";

const revalidateAllPaths = () => {
  revalidatePath("/");
  revalidatePath("/admin");
};

const fetchAllSongs = async () => {
  return await prisma.song.findMany({orderBy: {createAt: "asc"}});
};

export const GET = async () => {
  try {
    const songs = await fetchAllSongs();
    return NextResponse.json(songs);
  } catch (err) {
    console.error("Error fetching songs:", err);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const {title} = (await request.json()) as {title: string};

    await prisma.song.create({data: {title}});
    revalidateAllPaths();

    const allSongs = await fetchAllSongs();
    return NextResponse.json(allSongs);
  } catch (err) {
    console.error("Error creating song:", err);
    return NextResponse.json({error: "Failed to create song"}, {status: 500});
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const {id} = (await request.json()) as {id: string};

    const song = await prisma.song.findUnique({where: {id}});
    if (!song) {
      return NextResponse.json({error: "Song not found"}, {status: 404});
    }

    await prisma.song.update({where: {id}, data: {done: !song.done}});
    revalidateAllPaths();

    const allSongs = await fetchAllSongs();
    return NextResponse.json(allSongs);
  } catch (err) {
    console.error("Error updating song:", err);
    return NextResponse.json({error: "Failed to update song"}, {status: 500});
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
    } else {
      await prisma.song.update({where: {id}, data: {delete: true}});
    }
    revalidateAllPaths();

    const allSongs = await fetchAllSongs();
    return NextResponse.json(allSongs);
  } catch (err) {
    console.error("Error deleting song:", err);
    return NextResponse.json(
      {error: "Failed to delete song(s)"},
      {status: 500}
    );
  }
};
