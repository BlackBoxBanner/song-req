"use client";

import {Song} from "@prisma/client";
import {useEffect, useState} from "react";
import {columns, columnsAdmin} from "./column";
import {DataTable} from "./data-table";
import {socket} from "@/lib/socket";
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
      duration: 1000,
    });

    const onConnect = () => {
      setIsConnected(true);
      toast({
        title: "เชื่อมต่อสำเร็จ",
        description: "คุณเชื่อมต่อกับเซิร์ฟเวอร์แล้ว",
        duration: 1000,
      });
      initSocketToast.dismiss();
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
  }, [toast]);

  const columnsToUse = userType === "admin" ? columnsAdmin : columns;

  return (
    <section className="w-full h-full p-4">
      <DataTable columns={columnsToUse} data={songs} />
    </section>
  );
};

export default SongList;
