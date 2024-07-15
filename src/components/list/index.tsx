"use client";

import {Song} from "@prisma/client";
import {useEffect, useState} from "react";
import {columns, columnsAdmin} from "./column";
import {DataTable} from "./data-table";

type SongListProps = {
  type?: "admin" | "user";
};

const SongList = ({type: userType = "user"}: SongListProps) => {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("/api/song")
        .then((res) => res.json())
        .then((data) => {
          setSongs(data);
        });
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const column = userType === "admin" ? columnsAdmin : columns;
  return (
    <>
      <section className="grid grid-rows-[auto,1fr] w-full h-full gap-4">
        <p>ตรางเพลงจะรีทุก ๆ 5 วินาที</p>
        <DataTable columns={column} data={songs} />
      </section>
    </>
  );
};

export default SongList;
