"use server";

import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

const activateSessionAction = async (_formData: FormData) => {
  try {
    await prisma.session.create({
      data: {},
    });

    revalidatePath("/admin");
  } catch (err: any) {
    throw new Error(err);
  }
};

export default activateSessionAction;
