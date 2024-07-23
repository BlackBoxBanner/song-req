"use client";

import {Song} from "@prisma/client";
import {useEffect, useState} from "react";
import {columns, columnsAdmin} from "./column";
import {DataTable} from "./data-table";
import {socket} from "@/lib/socket";

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

  const columnsToUse = userType === "admin" ? columnsAdmin : columns;

  return (
    <section className="w-full h-full p-4">
      <DataTable columns={columnsToUse} data={songs} />
    </section>
  );
};

export default SongList;
