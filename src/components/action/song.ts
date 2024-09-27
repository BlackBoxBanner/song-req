"use server";

import prisma from "@/lib/prisma";

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

  await prisma.song.create({
    data: {
      title: songName,
      User: {
        connect: {
          username: name,
        },
      },
    },
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
