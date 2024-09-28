import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const getUser = async (username: string) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export default {
  callbacks: {
    authorized: async ({ auth, request }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async ({ username, password }) => {
        const user = await getUser(String(username));
        if (!user) {
          throw new Error("No user found with this username.");
        }

        const isValid = await bcrypt.compare(String(password), user.password!);
        if (isValid) return user;

        // Throw a more specific error for incorrect credentials
        throw new Error("Invalid password.");
      },
    }),
  ],
} satisfies NextAuthConfig;
