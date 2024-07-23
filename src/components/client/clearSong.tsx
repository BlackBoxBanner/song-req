"use client";

import {Button} from "../ui/button";
import {socket} from "@/lib/socket";
import {toast} from "../ui/use-toast";
import {FormEvent, useEffect, useState} from "react";
import {updateCurrentSong} from "@/lib/updateCurrentSong";
import {delay} from "../basic/delay";

export const ClearSongForm = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const onClearSong = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const toastContent = toast({
      duration: 10000,
    });

    try {
      toastContent.update({
        ...toastContent,
        title: "กำลังลบ",
        description: "ระบบกำลังลบเพลง รอสักครู่",
      });
      const res = await fetch(`/api/song`, {
        method: "DELETE",
        body: JSON.stringify({all: true}),
      });

      const data = await res.json();
      socket.emit("send-song", data);
    } catch (error) {
      console.error("Error clearing songs:", error);
      toastContent.dismiss();
    }

    try {
      toastContent.update({
        ...toastContent,
        title: "กำลังอัพเดท",
        description: "ระบบกำลังอัพเดทเพลง รอสักครู่",
      });
      await updateCurrentSong();
    } catch (error) {
      console.error("Error updating current song:", error);
    } finally {
      delay(750).then(() => {
        toastContent.dismiss();
      });
    }
  };

  return (
    <form onSubmit={onClearSong} className="flex flex-col gap-2 w-full">
      <Button type="submit" disabled={!isConnected}>
        เคลียลิสต์เพลง
      </Button>
    </form>
  );
};

export default ClearSongForm;
