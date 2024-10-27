"use server";

import { signIn, signOut } from "@/lib/auth";
import { SignInFormValues } from "@/components/client/signinForm";
import { AuthError } from "next-auth";
import { RegisterFormValues } from "@/components/client/registerForm";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

// Sign out action
export const signOutAction = async () => {
  await signOut();
};

// Authenticate user with provided credentials
export const authenticate = async (
  values: SignInFormValues
): Promise<ActionResponse> => {
  try {
    const res = await signIn("credentials", { ...values, redirect: false });

    if (res?.error) {
      return handleAuthError(res.error);
    }

    return { success: true }; // Sign-in successful
  } catch (error) {
    return handleAuthError(error);
  }
};

// Handle authentication errors
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

// Register a new user
export const registerAction = async ({
  username,
  password,
}: RegisterFormValues): Promise<ActionResponse> => {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return { success: false, message: "User already exists." };
    }

    // Hash the user's password
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

    return { success: true }; // Registration successful
  } catch (error: unknown) {
    return handleRegisterError(error);
  }
};

// Handle registration errors
const handleRegisterError = (error: unknown): ActionResponse => {
  if (error instanceof Error) {
    return { success: false, message: error.message };
  }
  console.error(error);
  return { success: false, message: "An unexpected error occurred." };
};
