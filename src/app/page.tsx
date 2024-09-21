import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

export default async function Home() {
  const users = await prisma.user.findMany();
  const mockUser: User[] = [
    {
      id: "1",
      name: "John Doe",
      password: "password",
      emailVerified: null,
      email: null,
      image: null,
      username: "johndoe",
    },
    {
      id: "2",
      name: "John Doe 2",
      password: "password",
      emailVerified: null,
      email: null,
      image: null,
      username: "johndoe2",
    },
  ];
  return (
    <main className="h-dvh bg-background flex justify-center items-center">

    </main>
  );
}
