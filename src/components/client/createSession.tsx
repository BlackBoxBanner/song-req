"use client";

import {Button} from "../ui/button";
import {socket} from "@/lib/socket";
import {toast} from "../ui/use-toast";
import {FormEvent, useEffect, useState} from "react";
import {updateCurrentSong} from "@/lib/updateCurrentSong";
import {delay} from "../basic/delay";

export const CreateSessionForm = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
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

    const toastContent = toast({
      duration: 10000,
      title: "กำลังดำเนินการ",
      description: "โปรดรอ...",
    });

    try {
      setState(true);
      const res = await fetch(`/api/session`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to create session");
      }

      const data = await res.json();
      socket.emit("send-session", data);

      toastContent.update({
        ...toastContent,
        title: "สร้างเซสชันเรียบร้อย",
        description: "เซสชันถูกสร้างเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error clearing songs:", error);
      toastContent.update({
        ...toastContent,
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างเซสชันได้",
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
        title: "อัพเดทสำเร็จ",
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
      <Button type="submit" disabled={!isConnected || state}>
        เปิดเซสชัน
      </Button>
    </form>
  );
};

export default CreateSessionForm;
