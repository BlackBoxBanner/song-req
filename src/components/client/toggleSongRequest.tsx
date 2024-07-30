"use client";

import {Button} from "../ui/button";
import {socket} from "@/lib/socket";
import {toast} from "../ui/use-toast";
import {FormEvent, useEffect, useState} from "react";
import {updateCurrentSong} from "@/lib/updateCurrentSong";
import {delay} from "../basic/delay";
import {Session} from "@prisma/client";
import {useSessionInit} from "../context/sessionContext";
import {CheckIcon, Cross1Icon} from "@radix-ui/react-icons";

export const ToggleSongRequestForm = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const {sessionInit} = useSessionInit();
  const [state, setState] = useState(false);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const onCreateSession = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sessionInit) {
      toast({
        title: "ไม่มีเซสชัน",
        description: "ไม่พบเซสชันเริ่มต้น กรุณาลองใหม่อีกครั้ง",
        duration: 5000,
      });
      return;
    }

    const toastContent = toast({
      duration: 10000,
      title: "กำลังดำเนินการ",
      description: "ระบบกำลังเตรียมเพลง...",
    });

    setState(true);
    try {
      const res = await fetch(`/api/session`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: sessionInit.id,
          request: !sessionInit.request,
        } as Session),
      });

      if (!res.ok) {
        throw new Error("Failed to update session");
      }

      const data = await res.json();
      socket.emit("send-session", data);

      toastContent.update({
        ...toastContent,
        title: "เซสชันอัพเดท",
        description: "เซสชันถูกอัพเดทเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error clearing songs:", error);
      toastContent.update({
        ...toastContent,
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทเซสชันได้",
      });
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
      toastContent.update({
        ...toastContent,
        title: "เพลงอัพเดท",
        description: "เพลงถูกอัพเดทเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error updating current song:", error);
      toastContent.update({
        ...toastContent,
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทเพลงได้",
      });
    } finally {
      await delay(750);
      toastContent.dismiss();
    }
  };

  return (
    <form onSubmit={onCreateSession} className="flex flex-col gap-2 w-full">
      <Button
        className="gap-2 flex "
        type="submit"
        disabled={!isConnected || !sessionInit || state}>
        {sessionInit?.request ? (
          <>
            <p>เปิดขอเพลง</p>
            <CheckIcon />
          </>
        ) : (
          <>
            <p>ปิดขอเพลง</p>
            <Cross1Icon />
          </>
        )}
      </Button>
    </form>
  );
};

export default ToggleSongRequestForm;
