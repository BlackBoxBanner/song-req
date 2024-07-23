"use client";

import {socket} from "@/lib/socket";
import {FormEvent, useEffect, useRef, useState} from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {useToast} from "../ui/use-toast";
import {useSocketInit} from "../context/socketContext";
import {delay} from "../basic/delay";

const RequestSongInputForm = () => {
  const {socketInit} = useSocketInit();
  const [songName, setSongName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {toast} = useToast();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socketInit) return;

    const toastContent = toast({
      duration: 100000,
    });

    toastContent.update({
      ...toastContent,
      title: "กำลังดำเนินการ",
      description: "กำลังส่งชื่อเพลง",
      variant: "default",
    });

    if (!songName.trim()) {
      toastContent.update({
        ...toastContent,
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกชื่อเพลง",
        variant: "destructive",
        duration: 1000,
      });

      return;
    }

    try {
      setIsSubmitting(true);
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
        toastContent.update({
          ...toastContent,
          title: "ข้อผิดพลาด",
          description: "การขอเพลงล้มเหลว",
          variant: "default",
          duration: 3000,
        });
      }

      const data = await res.json();
      socket.emit("send-song", data);
      setSongName("");
      inputRef.current?.focus();

      toastContent.update({
        ...toastContent,
        title: "ขอเพลงสำเร็จ",
        description: "เพลงของคุณถูกขอเรียบร้อยแล้ว",
        variant: "default",
        duration: 1000,
      });
    } catch (error) {
      toastContent.update({
        ...toastContent,
        title: "เกิดข้อผิดพลาด",
        description: "บางอย่างผิดพลาด",
        variant: "destructive",
        duration: 1000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full">
      <Input
        ref={inputRef}
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
        placeholder="ชื่อเพลง..."
      />
      <Button
        type="submit"
        disabled={!socketInit || !songName.trim() || isSubmitting}>
        ขอเพลง
      </Button>
    </form>
  );
};

export default RequestSongInputForm;
