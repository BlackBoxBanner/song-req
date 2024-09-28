"use client";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { deleteSongs } from "@/components/action/admin";
import { createObject, joinRoom, sendData } from "@/lib/socket";
import { useEffect } from "react";

export const DeleteForm = ({ name }: Pick<User, "name">) => {
  if (!name) return null;
  useEffect(() => {
    joinRoom(name!);
  }, [name]);
  return (
    <Button
      onClick={async () => {
        await deleteSongs(name);
        sendData("send-song", createObject(name,[]));
      }}
    >
      Delete all songs
    </Button>
  );
};
