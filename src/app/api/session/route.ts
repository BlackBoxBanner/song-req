import prisma from "@/lib/prisma";
import {Session} from "@prisma/client";
import {revalidatePath} from "next/cache";
import {NextRequest, NextResponse} from "next/server";

const revalidateAllPaths = () => {
  revalidatePath("/");
  revalidatePath("/admin");
};

export const GET = async () => {
  try {
    const session = await prisma.session.findMany();

    return NextResponse.json(session);
  } catch (err) {
    return NextResponse.json(
      {error: err || "Internal Server Error"},
      {status: 500}
    );
  }
};

export const POST = async (_request: NextRequest) => {
  try {
    // Provide valid data for session creation
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

export const PATCH = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as Pick<Session, "id" | "request">;

    // Ensure the request body has necessary data
    if (!body.id || body.request === undefined) {
      return NextResponse.json({error: "Invalid request data"}, {status: 400});
    }

    const updatedSession = await prisma.session.update({
      where: {id: body.id},
      data: {request: body.request},
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

export const DELETE = async (_request: NextRequest) => {
  try {
    await prisma.session.deleteMany(); // Perform deletion
    await prisma.song.deleteMany(); // Perform deletion
    revalidateAllPaths(); // Trigger revalidation of all paths

    return NextResponse.json(null);
  } catch (err: any) {
    console.error("Failed to delete sessions:", err);
    return NextResponse.json(
      {error: "Failed to delete sessions."},
      {status: 500}
    );
  }
};
