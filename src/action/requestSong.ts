"use server";

import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

const requestSongAction = async (formData: FormData) => {
  try {
    const session = (await prisma.session.findMany())[0];

    const songName = formData.get("song-name") as string;

    if (!session) {
      return;
    }

    await prisma.song.create({
      data: {
        title: songName,
        sessionId: session.id,
      },
    });

    return revalidatePath("/");
  } catch (err: any) {
    throw new Error(err);
  }
};

export default requestSongAction;
