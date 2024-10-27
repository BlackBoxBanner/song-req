"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Remove a participant from a live session and refresh the creator's path
export const removeParticipantFromLiveSession = async (
  userId: string,
  liveSessionId: string
) => {
  if (!userId || !liveSessionId)
    throw new Error("User ID and live session ID are required"); // Check for missing IDs

  const deletedCount = await prisma.liveParticipant.deleteMany({
    where: {
      userId, // Find participants by user ID
      sessions: {
        some: {
          liveSessionId, // Find sessions linked to the live session ID
        },
      },
    },
  });

  if (deletedCount.count === 0) {
    throw new Error(
      "No participant found with the given user ID in the specified live session."
    ); // Check if a participant was deleted
  }

  // Revalidate creator's path to refresh data
  return revalidatePath("/creator/*");
};
