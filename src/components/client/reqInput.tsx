"use client";

import {socket} from "@/lib/socket";
import {Session} from "@prisma/client";
import {FormEvent, useEffect, useRef, useState} from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {toast} from "../ui/use-toast";

type RequestSongInputFormProps = {
  session: Session;
};

const RequestSongInputForm = ({session}: RequestSongInputFormProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [songName, setSongName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConnected || !songName) return;

    const requestSongToast = toast({
      title: "กำลังดำเนินการ",
      description: "กำลังขอเพลง รอสักครู่",
    });

    fetch("/api/song", {
      method: "POST",
      body: JSON.stringify({
        title: songName,
        sessionId: session.id,
      }),
    })
      .then(async (res) => {
        return await res.json();
      })
      .then(async (data) => {
        socket.emit("send-song", data);
        setSongName("");
        inputRef.current?.focus();
      })
      .then(() => {
        requestSongToast.dismiss();
      });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full">
      <Input
        ref={inputRef}
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
        placeholder={"ชื่อเพลง ..."}
      />
      <Button type="submit">ขอเพลง</Button>
    </form>
  );
};

export default RequestSongInputForm;
