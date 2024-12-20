"use client";

import {Button} from "@/components/ui/button";
import {socket} from "@/lib/socket";
import {toast} from "@/components/ui/use-toast";
import {FormEvent, useEffect, useState} from "react";
import {updateCurrentSong} from "@/lib/updateCurrentSong";
import {delay} from "@/components/basic/delay";
import {useSessionInit} from "@/components/context/sessionContext";

export const ClearSongForm = () => {
  const [isConnected, setIsConnected] = useState(false);
  const {sessionInit} = useSessionInit();
  const [state, setState] = useState(false);

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
      setState(true);
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
    } finally {
      setState(false);
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
      <Button type="submit" disabled={!isConnected || !sessionInit || state}>
        เคลียลิสต์เพลง
      </Button>
    </form>
  );
};

export default ClearSongForm;
