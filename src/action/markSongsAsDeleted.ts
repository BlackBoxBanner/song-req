"use server";

import prisma from "@/lib/prisma";

// Mark all songs as deleted for a given live session
export const markSongsAsDeleted = async (liveSessionId: string) => {
  if (!liveSessionId) throw new Error("Live session ID is required"); // Error if ID is missing

  // Update songs linked to the session, marking them as deleted
  await prisma.song.updateMany({
    where: { LiveSession: { id: liveSessionId } },
    data: { deleted: true }, // Set songs as deleted
  });
};
