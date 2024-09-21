"use server";

import { signIn } from "@/lib/auth";
import { SignInFormValues } from "@/components/client/signinForm";
import { AuthError } from "next-auth";
import { RegisterFormValues } from "@/components/client/registerForm";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { permanentRedirect } from "next/navigation";

export const authenticate = async (
  values: SignInFormValues,
): Promise<ActionResponse> => {
  try {
    // Sign in without redirecting
    const res = await signIn("credentials", { ...values, redirect: false });

    if (res?.error) {
      // Handle invalid credentials or other errors
      if (res.error === "CredentialsSignin") {
        return { success: false, message: "Invalid credentials." };
      }
      return { success: false, message: "Something went wrong." };
    }

    // If sign-in is successful
    return { success: true };
  } catch (error) {
    console.log(error);

    // Check if it's an AuthError
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid credentials." };
        default:
          return { success: false, message: "Something went wrong." };
      }
    }
    throw error;
  }
};

export const registerAction = async ({
  username,
  password,
}: RegisterFormValues): Promise<ActionResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      throw new Error("User already exists");
    }

    await prisma.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, 10),
      },
    });
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    throw error;
  }
};
