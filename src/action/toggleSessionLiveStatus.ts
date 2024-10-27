"use server";

import prisma from "@/lib/prisma";
import { LiveSession } from "@prisma/client";

// Toggle the live status of a session and optionally delete associated songs
export const toggleSessionLiveStatus = async ({
    id,
    live = false,
  }: Pick<LiveSession, "id" | "live">) => {
    if (!id) throw new Error("Session ID is required"); // Error if ID is missing
  
    return await prisma.liveSession.update({
      where: { id },
      data: {
        live: !live, // Toggle the current live status
        allowRequest: false, // Disable song requests when toggling status
        Song: {
          updateMany: {
            where: { liveSessionId: id },
            data: { deleted: true }, // Mark all associated songs as deleted
          },
        },
      },
      select: {
        live: true,
        Song: {
          where: { deleted: false }, // Return only non-deleted songs
          orderBy: { createAt: "asc" }, // Order songs by creation date
        },
      },
    });
  };