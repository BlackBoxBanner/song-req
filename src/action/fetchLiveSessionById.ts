"use server";

import prisma from "@/lib/prisma";

export const fetchLiveSessionById = async (id: string, includeSongs = false) => {
    return await prisma.liveSession.findUnique({
      where: { id }, // Find live session by ID
      include: {
        Song: includeSongs
          ? { where: { deleted: false }, orderBy: { createAt: "asc" } }
          : false, // Include songs if specified
        participants: {
          include: {
            liveParticipant: { include: { User: true } }, // Include participants and their user info
          },
        },
      },
    });
  };