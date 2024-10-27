"use server";

import prisma from "@/lib/prisma";
import { LiveSession } from "@prisma/client";

// Toggle the permission for song requests in a live session
export const toggleSessionRequestPermission = async ({
  id,
  allowRequest = false,
}: Pick<LiveSession, "id" | "allowRequest">) => {
  if (!id) throw new Error("Session ID is required"); // Error if ID is missing

  return await prisma.liveSession.update({
    where: { id },
    data: {
      allowRequest: !allowRequest, // Toggle current request permission
    },
    select: { allowRequest: true }, // Return the updated request permission status
  });
};
