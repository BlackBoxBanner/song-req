"use server";

import prisma from "@/lib/prisma";
import { LiveSession, Song } from "@prisma/client";
import { cookies } from "next/headers";

export const requestSongAction = async ({
  id,
  title,
  songLimit = 10,
}: {
  id: LiveSession["id"];
  title: Song["title"];
  songLimit: LiveSession["limit"];
}) => {
  const songList = await prisma.song.findMany({
    where: {
      LiveSession: {
        id,
      },
    },
    orderBy: {
      createAt: "asc",
    },
  });

  if (songList.length >= songLimit) {
    throw new Error("Song limit reached");
  }

  const song = await prisma.song.create({
    data: {
      title,
      LiveSession: {
        connect: {
          id,
        },
      },
    },
  });

  const cookieStore = cookies();
  const cookieName = "song-list";
  const requestSongListId = cookieStore.get(cookieName);

  if (!requestSongListId?.value) {
    cookies().set({
      name: cookieName,
      value: JSON.stringify([song.id]),
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
    });
  }

  const parsedSongListId = JSON.parse(requestSongListId?.value!);

  cookies().set({
    name: cookieName,
    value: JSON.stringify([...parsedSongListId, song.id]),
    httpOnly: true,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
  });

  return await prisma.song.findMany({
    where: {
      LiveSession: {
        id,
      },
    },
    orderBy: {
      createAt: "asc",
    },
  });
};
