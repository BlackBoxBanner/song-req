"use server";

import prisma from "@/lib/prisma";
import { LiveSession } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateSessionLimitConfig = async ({
  id,
  clearOnChangeLimit,
}: Pick<LiveSession, "id" | "clearOnChangeLimit">) => {
  if (!id) throw new Error("Session ID is required"); // Error if ID is missing

  const config = await prisma.liveSession.update({
    where: { id },
    data: { clearOnChangeLimit }, // Update the clearOnChangeLimit setting
    select: { clearOnChangeLimit: true }, // Return the updated configuration
  });

  // Revalidate creator path to refresh data
  revalidatePath("/creator/*");

  return config.clearOnChangeLimit;
};
