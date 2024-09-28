"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createObject, joinRoom, sendData, useReceiveData } from "@/lib/socket";
import { Song } from "@prisma/client";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { editSong } from "@/components/action/admin";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type AdminSongTableProps = {
  songs: Song[];
  name: string;
};
const AdminSongTable = ({ songs: initialSong, name }: AdminSongTableProps) => {
  const songs = useReceiveData<Song[]>("receive-song", initialSong);

  const handleCheckChange = async (song: Song, checked: boolean) => {
    const newSongList = await editSong({ id: song.id, done: checked });
    sendData("send-song", createObject(name, newSongList));
  };

  useEffect(() => {
    joinRoom(name!);
  }, [name]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Timestamp</TableHead>
            <TableHead className="w-[30px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs?.map((song, index) => (
            <TableRow
              key={song.title + index}
              className={cn(song.done && "bg-neutral-100 ")}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{song.title}</TableCell>
              <TableCell className="text-right">
                {format(song.createAt, "HH:mm:ss:SS")}
              </TableCell>
              <TableCell className="flex justify-start items-center">
                <Checkbox
                  className="flex justify-center items-center"
                  checked={song.done}
                  onCheckedChange={async (checked) => {
                    await handleCheckChange(song, !!checked);
                  }}
                  disabled={song.done}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AdminSongTable;
