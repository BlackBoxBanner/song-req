"use server";

import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

const deactivateSessionAction = async (_formData: FormData) => {
  const session = (await prisma.session.findMany())[0];

  try {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    revalidatePath("/admin");
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deactivateSessionAction;
