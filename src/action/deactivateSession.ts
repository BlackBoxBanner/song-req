"use server";

import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

const deactivateSessionAction = async (_formData: FormData) => {
  try {
    await prisma.session.deleteMany();

    revalidatePath("/admin");
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deactivateSessionAction;
