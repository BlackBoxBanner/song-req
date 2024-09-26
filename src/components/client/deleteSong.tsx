"use client";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { deleteSongs } from "@/components/action/admin";
import { resyncSong } from "@/lib/song";

export const DeleteForm = ({ name }: Pick<User, "name">) => {
  if (!name) return null;
  return (
    <Button
      onClick={async () => {
        await deleteSongs(name);
        resyncSong(name);
      }}
    >
      Delete all songs
    </Button>
  );
};
