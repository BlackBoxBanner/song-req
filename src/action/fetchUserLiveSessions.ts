"use server";

import prisma from "@/lib/prisma";

export const fetchUserLiveSessions = async (username: string) => {
  return await prisma.liveParticipant.findMany({
    where: {
      sessions: {
        some: {
          liveParticipant: {
            User: {
              username, // Filter live participants by username
            },
          },
        },
      },
    },
    select: {
      id: true, // Select participant ID
      sessions: {
        include: {
          liveSession: {
            include: {
              participants: {
                include: {
                  liveParticipant: {
                    include: {
                      User: true, // Include full user information for participants
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
