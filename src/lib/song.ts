"use client";

import { getSongs } from "@/components/action/admin";
import { sendData } from "@/lib/socket";

export const resyncSong = (name: string) => {
  getSongs(name).then((songs) => {
    sendData("send-song", songs);
  });
};
