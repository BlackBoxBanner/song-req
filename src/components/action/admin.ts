"use server";
import prisma from "@/lib/prisma";
import { LiveSession, Prisma, PrismaClient, User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getLiveSessionFromUsersName = async (name: string) => {
  return await prisma.liveParticipant.findMany({
    where: {
      sessions: {
        some: {
          liveParticipant: {
            User: {
              username: name,
            },
          },
        },
      },
    },
    select: {
      id: true,
      sessions: {
        include: {
          liveSession: {
            include: {
              participants: {
                include: {
                  liveParticipant: {
                    include: {
                      User: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

export const getLiveSessionByRoute = async (route: string) => {
  return await prisma.liveSession.findUnique({
    where: {
      route,
    },
    include: {
      Song: {
        orderBy: {
          createAt: "asc",
        },
      },
      participants: {
        include: {
          liveParticipant: {
            include: {
              User: true,
            },
          },
        },
      },
    },
  });
};

export const getLiveSessionById = async (id: string, withSong = false) => {
  return await prisma.liveSession.findUnique({
    where: {
      id,
    },
    include: {
      Song: withSong
        ? {
            orderBy: {
              createAt: "asc",
            },
          }
        : false,
      participants: {
        include: {
          liveParticipant: {
            include: {
              User: true,
            },
          },
        },
      },
    },
  });
};

export const getUserById = async (id: string, select?: Prisma.UserSelect) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select,
  });
};

export const getUserByName = async (
  name: string,
  select?: Prisma.UserSelect
) => {
  return await prisma.user.findUnique({
    where: {
      username: name,
    },
    select,
  });
};

type CreateLiveSessionProps = {
  name: string;
  limit: string;
  route: string;
  createBy: string;
  default?: boolean;
};

export const createLiveSession = async ({
  name,
  route,
  limit,
  createBy,
  default: defaultSession = false,
}: CreateLiveSessionProps) => {
  const newLiveSession = await prisma.liveSession.create({
    data: {
      name,
      route,
      limit: isNaN(parseInt(limit)) ? 10 : parseInt(limit),
      createBy,
      default: defaultSession,
    },
  });

  await prisma.liveParticipant.create({
    data: {
      userId: createBy,
      sessions: {
        create: {
          liveSessionId: newLiveSession.id,
          assignedBy: createBy,
        },
      },
    },
  });

  return revalidatePath("/creator");
};

export const changeLive = async ({
  id,
  live = false,
}: Pick<LiveSession, "id" | "live">) => {
  if (!id) return;

  return await prisma.liveSession.update({
    where: { id },
    data: {
      live: !live,
    },
    select: { live: true },
  });
};

export const changeAllowRequest = async ({
  id,
  allowRequest = false,
}: Pick<LiveSession, "id" | "allowRequest">) => {
  if (!id) return;

  return await prisma.liveSession.update({
    where: { id },
    data: {
      allowRequest: !allowRequest,
    },
    select: { allowRequest: true },
  });
};

export const setLimit = async ({
  id,
  limit,
}: Pick<LiveSession, "id" | "limit">) => {
  if (!id) return;

  return await prisma.liveSession.update({
    where: {
      id,
    },
    data: {
      limit: Math.abs(limit),
    },
    select: {
      limit: true,
      Song: true,
    },
  });
};

export const deleteSongs = async (liveId: string) => {
  await prisma.song.deleteMany({
    where: {
      LiveSession: {
        id: liveId,
      },
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
    select: {
      LiveSession: true,
    },
  });

  const allSongs = await prisma.song.findMany({
    where: {
      liveSessionId: changedSong.LiveSession.id,
    },
    orderBy: {
      createAt: "asc",
    },
  });

  prisma.$disconnect();
  return allSongs;
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });
};

export const addParticipant = async (userId: string, liveId: string) => {
  await prisma.liveParticipant.create({
    data: {
      userId,
      sessions: {
        create: {
          liveSessionId: liveId,
          assignedBy: userId,
        },
      },
    },
  });
  return revalidatePath("/creator/*");
};

export const removeParticipant = async (userId: string, liveId: string) => {
  await prisma.liveParticipant.deleteMany({
    where: {
      userId,
      sessions: {
        some: {
          liveSessionId: liveId,
        },
      },
    },
  });
  return revalidatePath("/creator/*");
};

export const deleteSession = async (id: string) => {
  await prisma.liveParticipant.deleteMany({
    where: {
      sessions: {
        some: {
          liveSessionId: id,
        },
      },
    },
  });
  await prisma.liveSession.delete({
    where: {
      id,
    },
  });
  return revalidatePath("/creator/*");
};
