"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const fetchUserById = async (id: string, select?: Prisma.UserSelect) => {
  return await prisma.user.findUnique({
    where: { id }, // Find user by ID
    select, // Optional fields to select
  });
};
