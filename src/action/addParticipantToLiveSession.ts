"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Add a participant to a live session and refresh the creator's path
export const addParticipantToLiveSession = async (
  userId: string,
  liveSessionId: string
) => {
  if (!userId || !liveSessionId)
    throw new Error("User ID and live session ID are required"); // Check for missing IDs

  await prisma.liveParticipant.create({
    data: {
      userId, // User ID of the participant
      sessions: {
        create: {
          liveSessionId, // Link to the live session
          assignedBy: userId, // Assigned by the participant
        },
      },
    },
  });

  // Revalidate creator's path to refresh data
  return revalidatePath("/creator/*");
};
