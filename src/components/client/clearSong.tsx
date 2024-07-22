"use client";

import {Button} from "../ui/button";
import {socket} from "@/lib/socket";
import {toast} from "../ui/use-toast";
import {useEffect, useState} from "react";
import {updateCurrentSong} from "@/lib/updateCurrentSong";

export const ClearSongForm = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
  const onClearSong = () => {
    const deleteToast = toast({
      title: "กำลังลบ",
      description: "ระบบกำลังลบเพลง รอสักครู่",
    });

    const updateToast = toast({
      title: "กำลังอัพเดท",
      description: "ระบบกำลังอัพเดทเพลง รอสักครู่",
    });

    fetch(`/api/song`, {
      method: "DELETE",
      body: JSON.stringify({all: true}),
    })
      .then(async (res) => {
        return await res.json();
      })
      .then(async (data) => {
        socket.emit("send-song", data);
      })
      .finally(() => {
        deleteToast.dismiss();
      });

    updateCurrentSong().finally(() => updateToast.dismiss());
  };
  return (
    <>
      <form onSubmit={onClearSong}>
        <Button type="submit">เคลียลิสต์เพลง</Button>
      </form>
    </>
  );
};
