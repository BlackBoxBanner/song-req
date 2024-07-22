"use client";

import {Song} from "@prisma/client";
import {useEffect, useState} from "react";
import {columns, columnsAdmin} from "./column";
import {DataTable} from "./data-table";

import {socket} from "@/lib/socket";
import {SymbolIcon} from "@radix-ui/react-icons";
import {useToast} from "../ui/use-toast";

type SongListProps = {
  type?: "admin" | "user";
  initialCountDownTime?: number;
  initData?: Song[];
};

const SongList = ({type: userType = "user", initData = []}: SongListProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [songs, setSongs] = useState<Song[]>(initData);

  const {toast} = useToast();

  useEffect(() => {
    const initSocketToast = toast({
      title: "กำลังเชื่อมต่อ",
      description: "ระบบกำลังเชื่อมต่อกับเซิร์ฟเวอร์ รอสักครู่",
    });

    const onConnect = () => {
      setIsConnected(true);
      initSocketToast.dismiss();
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onReceiveSong = (data: Song[]) => {
      setSongs(data);
    };

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-song", onReceiveSong);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive-song", onReceiveSong);
    };
  }, []);

  const column = userType === "admin" ? columnsAdmin : columns;

  return (
    <section className="grid grid-rows-[auto,1fr] w-full h-full gap-4 relative">
      <DataTable columns={column} data={songs} />
    </section>
  );
};

export default SongList;
