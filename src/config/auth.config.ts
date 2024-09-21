import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const getUser = async (username: string) => {
  return prisma.user.findFirst({
    where: {
      username,
    },
  });
};

export default {
  callbacks: {
    authorized: async ({ auth }) => {
      
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
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
        if (!user || !user.password) throw new Error("No user found");

        const isValid = await bcrypt.compare(String(password), user.password);
        if (isValid) return user;

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
