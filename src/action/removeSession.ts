"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Delete a live session and all its associated participants
export const removeSession = async (id: string) => {
  if (!id) throw new Error("Session ID is required"); // Error if ID is missing

  // Delete participants associated with the session
  await prisma.liveParticipant.deleteMany({
    where: {
      sessions: {
        some: {
          liveSessionId: id, // Find participants linked to the session
        },
      },
    },
  });

  // Delete the live session
  await prisma.liveSession.delete({
    where: { id }, // Delete session by ID
  });

  // Revalidate the creator's path to refresh data
  return revalidatePath("/creator/*");
};
