"use server";

import prisma from "@/lib/prisma";
import { LiveSession } from "@prisma/client";

// Update the limit for a live session, with an option to clear songs
export const updateEditCount = async ({
  id,
  editCountDefault,
}: Pick<LiveSession, "id" | "editCountDefault">) => {
  if (!id) throw new Error("Session ID is required"); // Error if ID is missing

  return await prisma.liveSession.update({
    where: { id },
    data: { editCountDefault },
  });
};
