"use client";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { deleteSongs } from "@/components/action/admin";
import { sendData } from "@/lib/socket";

export const DeleteForm = ({ name }: Pick<User, "name">) => {
  if (!name) return null;
  return (
    <Button
      onClick={async () => {
        await deleteSongs(name);
        sendData("send-song", []);
      }}
    >
      Delete all songs
    </Button>
  );
};
