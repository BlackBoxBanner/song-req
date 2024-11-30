"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const addCtfWinner = async ({
  contact,
  position,
}: {
  contact: string;
  position: number;
}) => {
  const positions = await prisma.ctf.findMany({
    where: {
      position: {
        in: ["FIRST", "SECOND", "THIRD", "FOURTH"],
      },
    },
  });

  const first = positions.find((p) => p.position === "FIRST");
  const second = positions.find((p) => p.position === "SECOND");
  const third = positions.find((p) => p.position === "THIRD");
  const fourth = positions.find((p) => p.position === "FOURTH");

  const playerPosition =
    !first && position === 1
      ? "FIRST"
      : !second && position === 2
      ? "SECOND"
      : !third && position === 3
      ? "THIRD"
      : !fourth && position === 4
      ? "FOURTH"
      : null;

  if (!playerPosition) {
    throw new Error("มีผู้เล่นอื่นได้รับรางวัลไปแล้ว");
  }

  const ctf = await prisma.ctf.create({
    data: {
      contact,
      position: playerPosition,
    },
  });

  revalidatePath("/ctf");

  return;
};
