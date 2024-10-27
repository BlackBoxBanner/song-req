"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const fetchAllUsers = async () => {
    return await prisma.user.findMany({
      select: {
        id: true, // Select user ID
        username: true, // Select username
      },
    });
  };