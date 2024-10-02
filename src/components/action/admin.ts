"use server";
import prisma from "@/lib/prisma";
import { Prisma, PrismaClient, User } from "@prisma/client";

export const getLiveSessionFromUsersName = async (name: string) => {
  return await prisma.liveParticipant.findMany({
    // where: {
    //   User: {
    //     name,
    //   },
    // },
    include: {
      LiveSession: {
        include: {
          LiveParticipant: {
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
