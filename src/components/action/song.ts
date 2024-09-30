"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const requestSongAction = async ({
  name,
  songName,
  songLimit = 10,
}: {
  name: string;
  songName: string;
  songLimit: number;
}) => {
  const songList = await prisma.song.findMany({
    where: {
      User: {
        username: name,
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
      title: songName,
      User: {
        connect: {
          username: name,
        },
      },
    },
  });

  const cookieStore = cookies();
  const cookieName = "song-list";
  const requestSongListId = cookieStore.get(cookieName)

  console.log("requestSongListId", requestSongListId);
  

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
      User: {
        username: name,
      },
    },
    orderBy: {
      createAt: "asc",
    },
  });
};
