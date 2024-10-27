"use server";

import prisma from "@/lib/prisma";

export const fetchAllUniqueRoutes = async () => {
    return await prisma.liveSession.findMany({
      select: { route: true }, // Select routes
    });
  };