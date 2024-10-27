"use server";

import prisma from "@/lib/prisma";

export const fetchLiveSessionByRoute = async (route: string) => {
  const result = await prisma.liveSession.findUnique({
    where: { route }, // Find live session by route
    include: {
      Song: { where: { deleted: false }, orderBy: { createAt: "asc" } }, // Include songs ordered by creation date
      participants: {
        include: {
          liveParticipant: { include: { User: true } }, // Include participants and their user info
        },
      },
    },
  });

  return result;
};