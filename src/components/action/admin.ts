"use server";
import prisma from "@/lib/prisma";
import { LiveSession, Prisma, PrismaClient, User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getLiveSessionFromUsersName = async (name: string) => {
  return await prisma.liveParticipant.findMany({
    where: {
      sessions: {
        every: {
          liveSession: {
            User: {
              name,
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
};

export const createLiveSession = async ({
  name,
  route,
  limit,
  createBy,
}: CreateLiveSessionProps) => {
  const newLiveSession = await prisma.liveSession.create({
    data: {
      name,
      route,
      limit: isNaN(parseInt(limit)) ? 10 : parseInt(limit),
      createBy,
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

// export const getSongs = async (name: string) => {
//   return prisma.song.findMany({
//     where: {
//       User: {
//         username: name,
//       },
//     },
//     orderBy: {
//       createAt: "asc",
//     },
//   });
// };

// export const deleteSongs = async (name: string) => {
//   await prisma.song.deleteMany({
//     where: {
//       User: {
//         username: name,
//       },
//     },
//   });
// };

// export const getUser = async (name: string, withSong: boolean = false) => {
//   return await prisma.user.findUnique({
//     where: {
//       username: name,
//     },
//     select: {
//       name: true,
//       limit: true,
//       live: true,
//       Song: {
//         orderBy: {
//           createAt: "asc",
//         },
//       },
//     },
//   });
// };

// export const changeLive = async ({
//   name,
//   live = false,
// }: Pick<User, "name" | "live">) => {
//   if (!name) return;
//   return await prisma.user.update({
//     where: { username: name },
//     data: {
//       live: !live,
//       Song: {
//         deleteMany: [],
//       },
//     },
//     select: { live: true },
//   });
// };

// export const setLimit = async ({
//   name,
//   limit,
// }: Pick<User, "name" | "limit">) => {
//   if (!name) return;
//   return await prisma.user.update({
//     where: {
//       username: name,
//     },
//     data: {
//       limit: Math.abs(limit),
//       Song: {
//         deleteMany: {},
//       },
//     },
//     select: {
//       limit: true,
//       Song: {
//         orderBy: {
//           createAt: "asc",
//         },
//       },
//     },
//   });
// };

// export const editSong = async (song: { id: string; done: boolean }) => {
//   const changedSong = await prisma.song.update({
//     where: {
//       id: song.id,
//     },
//     data: {
//       done: song.done,
//     },
//   });
//   const allSongs = await prisma.song.findMany({
//     where: {
//       userId: changedSong.userId,
//     },
//     orderBy: {
//       createAt: "asc",
//     },
//   });

//   prisma.$disconnect();
//   return allSongs;
// };
