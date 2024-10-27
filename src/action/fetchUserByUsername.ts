"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const fetchUserByUsername = async (
  username: string,
  select?: Prisma.UserSelect
) => {
  return await prisma.user.findUnique({
    where: { username }, // Find user by username
    select, // Optional fields to select
  });
};
