"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Constants for default session settings
const DEFAULT_LIMIT = 10; // Default participant limit for live sessions
const DEFAULT_SESSION_STATUS = false; // Default session status

// Create a new live session and add the creator as a participant
export const createNewLiveSession = async ({
  name,
  route,
  limit,
  createdBy,
  default: isDefault = DEFAULT_SESSION_STATUS,
}: {
  name: string; // Name of the session
  route: string; // Route for the session
  limit: string; // Participant limit for the session
  createdBy: string; // User ID of the session creator
  default?: boolean; // Default status for the session (optional)
}) => {
  // Parse and validate the limit, falling back to default if invalid
  const newLimit = isNaN(parseInt(limit)) ? DEFAULT_LIMIT : parseInt(limit);

  // Create the new live session with the specified data
  const newLiveSession = await prisma.liveSession.create({
    data: {
      name,
      route,
      limit: newLimit,
      createBy: createdBy,
      default: isDefault,
    },
  });

  // Add the creator as a participant in the newly created session
  await prisma.liveParticipant.create({
    data: {
      userId: createdBy,
      sessions: {
        create: {
          liveSessionId: newLiveSession.id,
          assignedBy: createdBy,
        },
      },
    },
  });

  // Revalidate the creator's path to refresh the session list
  return revalidatePath("/creator");
};
