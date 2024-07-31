import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {NextRequest, NextResponse} from "next/server";
import {Session} from "@prisma/client";

const revalidateAllPaths = () => {
  revalidatePath("/");
  revalidatePath("/admin");
};

// GET: Fetch all sessions
export const GET = async () => {
  try {
    const sessions = await prisma.session.findMany();
    return NextResponse.json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
};

// POST: Create a new session
export const POST = async (_request: NextRequest) => {
  try {
    const newSession = await prisma.session.create({
      data: {
        // Define necessary fields here, e.g., someField: someValue
      },
    });

    revalidateAllPaths();
    return NextResponse.json(newSession);
  } catch (err) {
    console.error("Error creating session:", err);
    return NextResponse.json(
      {error: "Failed to create session"},
      {status: 500}
    );
  }
};

// PATCH: Update an existing session
export const PATCH = async (request: NextRequest) => {
  try {
    const {id, request: requestField} =
      (await request.json()) as Partial<Session>;

    if (!id || requestField === undefined) {
      return NextResponse.json({error: "Invalid request data"}, {status: 400});
    }

    const updatedSession = await prisma.session.update({
      where: {id},
      data: {request: requestField},
    });

    revalidateAllPaths();
    return NextResponse.json(updatedSession);
  } catch (err) {
    console.error("Error updating session:", err);
    return NextResponse.json(
      {error: "Failed to update session"},
      {status: 500}
    );
  }
};

// DELETE: Delete all sessions and songs
export const DELETE = async (_request: NextRequest) => {
  try {
    await prisma.session.deleteMany();
    await prisma.song.deleteMany();

    revalidateAllPaths();
    return NextResponse.json(null);
  } catch (err) {
    console.error("Failed to delete sessions and songs:", err);
    return NextResponse.json(
      {error: "Failed to delete sessions and songs."},
      {status: 500}
    );
  }
};
