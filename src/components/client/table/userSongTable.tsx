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
import { sendData, useReceiveData } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { Song } from "@prisma/client";
import { format } from "date-fns";

type UserSongTableProps = {
  songs: Song[];
};
const UserSongTable = ({ songs: initialSong }: UserSongTableProps) => {
  const songs = useReceiveData<Song[]>("receive-song", initialSong);
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="sticky top-0 bg-background">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[0px]"></TableHead>
            <TableHead className="text-right">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs?.map((song, index) => (
            <TableRow
              key={song.title + index}
              className={cn("relative", song.done && "bg-neutral-100")}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{song.title}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-primary w-full rounded opacity-0",
                    song.done && "opacity-100"
                  )}
                />
              </TableCell>
              <TableCell className="text-right">
                {format(song.createAt, "HH:mm:ss")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UserSongTable;
