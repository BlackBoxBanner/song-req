"use server";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export const getSongs = async (name: string) => {
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

export const deleteSongs = async (name: string) => {
  await prisma.song.deleteMany({
    where: {
      User: {
        username: name,
      },
    },
  });
};

export const getUser = async (name: string, withSong: boolean = false) => {
  return await prisma.user.findUnique({
    where: {
      username: name,
    },
    select: {
      name: true,
      limit: true,
      live: true,
      Song: {
        orderBy: {
          createAt: "asc",
        },
      },
    },
  });
};

export const changeLive = async ({ name }: Pick<User, "name">) => {
  if (!name) return;
  const user = await getUser(name);

  if (!user) return;

  if (!user.live) {
    await deleteSongs(name);
  }

  return await prisma.user.update({
    where: {
      username: name,
    },
    data: {
      live: !user.live,
      Song: {
        deleteMany: {},
      },
    },
    select: {
      live: true,
    },
  });
};

export const setLimit = async ({
  name,
  limit,
}: Pick<User, "name" | "limit">) => {
  console.log(name, limit);

  if (!name) return;
  await deleteSongs(name);
  return await prisma.user.update({
    where: {
      username: name,
    },
    data: {
      limit: Math.abs(limit),
    },
    select: {
      limit: true,
    },
  });
};

export const editSong = async (song: { id: string; done: boolean }) => {
  const changedSong = await prisma.song.update({
    where: {
      id: song.id,
    },
    data: {
      done: song.done,
    },
  });
  const allSongs = await prisma.song.findMany({
    where: {
      userId: changedSong.userId,
    },
    orderBy: {
      createAt: "asc",
    },
  });

  prisma.$disconnect();
  return allSongs;
};
