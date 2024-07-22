"use server";

import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import * as crypto from "node:crypto";

const activateSessionAction = async (_formData: FormData) => {
  try {
    await prisma.session.create({
      data: {
        socket: crypto.randomBytes(20).toString("hex"),
      },
    });

    revalidatePath("/admin");
  } catch (err: any) {
    throw new Error(err);
  }
};

export default activateSessionAction;
