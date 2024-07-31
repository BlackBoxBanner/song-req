"use client";

import {Song} from "@prisma/client";
import {useEffect, useState} from "react";
import {socket} from "@/lib/socket";
import DataTable from "@/components/list/dataTable";

type SongListProps = {
  type?: "admin" | "user";
  initialCountDownTime?: number;
  initData?: Song[];
};

const SongList = ({type: userType = "user", initData = []}: SongListProps) => {
  const [songs, setSongs] = useState<Song[]>(initData);

  useEffect(() => {
    const onReceiveSong = (data: Song[]) => {
      setSongs(data);
    };

    socket.on("receive-song", onReceiveSong);

    return () => {
      socket.off("receive-song", onReceiveSong);
    };
  }, []);

  return (
    <section className="w-full h-full p-4">
      <DataTable songs={songs} admin={userType == "admin"} />
    </section>
  );
};

export default SongList;
