"use client";

import {socket} from "@/lib/socket";
import {FormEvent, useEffect, useRef, useState} from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {toast} from "../ui/use-toast";

const RequestSongInputForm = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [songName, setSongName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      toast({
        title: "เชื่อมต่อสำเร็จ",
        description: "คุณเชื่อมต่อกับเซิร์ฟเวอร์แล้ว",
        duration: 1000,
      });
    };

    const onDisconnect = () => {
      setIsConnected(false);
      toast({
        title: "การเชื่อมต่อขาดหาย",
        description: "ระบบไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        variant: "destructive",
        duration: 1000,
      });
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConnected) return;

    if (!songName.trim()) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกชื่อเพลง",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }

    try {
      const res = await fetch("/api/song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: songName.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("การขอเพลงล้มเหลว");
      }

      const data = await res.json();
      socket.emit("send-song", data);
      setSongName("");
      inputRef.current?.focus();

      toast({
        title: "ขอเพลงสำเร็จ",
        description: "เพลงของคุณถูกขอเรียบร้อยแล้ว",
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "บางอย่างผิดพลาด",
        variant: "destructive",
        duration: 1000,
      });
    } finally {
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full">
      <Input
        ref={inputRef}
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
        placeholder="ชื่อเพลง ..."
      />
      <Button type="submit" disabled={!isConnected || !songName.trim()}>
        ขอเพลง
      </Button>
    </form>
  );
};

export default RequestSongInputForm;
