"use server";

import { signIn, signOut } from "@/lib/auth";
import { SignInFormValues } from "@/components/client/signinForm";
import { AuthError } from "next-auth";
import { RegisterFormValues } from "@/components/client/registerForm";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export const signOutAction = async () => {
  await signOut();
};

export const authenticate = async (
  values: SignInFormValues
): Promise<ActionResponse> => {
  try {
    // Sign in without redirecting
    const res = await signIn("credentials", { ...values, redirect: false });

    if (res?.error) {
      return handleAuthError(res.error);
    }

    // If sign-in is successful
    return { success: true };
  } catch (error) {
    return handleAuthError(error);
  }
};

const handleAuthError = (error: unknown): ActionResponse => {
  if (error instanceof AuthError) {
    switch (error.type) {
      case "CredentialsSignin":
        return { success: false, message: "Invalid credentials." };
      default:
        return { success: false, message: "Something went wrong." };
    }
  }
  console.error(error);
  return { success: false, message: "An unexpected error occurred." };
};

export const registerAction = async ({
  username,
  password,
}: RegisterFormValues): Promise<ActionResponse> => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return { success: false, message: "User already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: username,
        username,
        password: hashedPassword,
        LiveSession: {
          create: {
            name: "default",
            route: username,
            default: true,
          },
        },
        LiveParticipant: {
          create: {},
        },
      },
      select: {
        id: true,
        LiveSession: {
          select: { id: true },
        },
        LiveParticipant: {
          select: { id: true },
        },
      },
    });

    // Associate the new participant with the session
    await prisma.liveParticipantOnSessions.create({
      data: {
        assignedBy: newUser.id,
        liveParticipantId: newUser.LiveParticipant[0].id,
        liveSessionId: newUser.LiveSession[0].id,
      },
    });

    return { success: true };
  } catch (error: unknown) {
    return handleRegisterError(error);
  }
};

const handleRegisterError = (error: unknown): ActionResponse => {
  if (error instanceof Error) {
    return { success: false, message: error.message };
  }
  console.error(error);
  return { success: false, message: "An unexpected error occurred." };
};
