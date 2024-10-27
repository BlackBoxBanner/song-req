"use server";

import prisma from "@/lib/prisma";
import { LiveSession } from "@prisma/client";

// Update the limit for a live session, with an option to clear songs
export const updateSessionLimit = async ({
  id,
  limit,
  willClear = false,
}: Pick<LiveSession, "id" | "limit"> & { willClear: boolean }) => {
  if (!id) throw new Error("Session ID is required"); // Error if ID is missing

  return await prisma.liveSession.update({
    where: { id },
    data: {
      limit: Math.abs(limit), // Ensure the limit is a non-negative number
      allowRequest: false, // Disable song requests
      Song: willClear
        ? {
            updateMany: {
              where: { liveSessionId: id },
              data: { deleted: true }, // Mark songs as deleted if clearing is requested
            },
          }
        : {}, // Do not update songs if not clearing
    },
    select: {
      limit: true,
      allowRequest: true,
      Song: {
        where: { deleted: false }, // Return only non-deleted songs
        orderBy: { createAt: "asc" }, // Order songs by creation date
      },
    }, // Return updated limit and ordered songs
  });
};
