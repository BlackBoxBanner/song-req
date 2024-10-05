"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReceiveData } from "@/lib/socket";
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
      <Table className="col-span-2">
        <TableHeader>
          <TableRow className="sticky top-0 z-10 bg-background">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs?.map((song, index) => (
            <TableRow
              key={song.id || index} // Assuming 'song.id' is unique. Fall back to index if missing
              className={cn(
                "relative",
                song.done && "text-gray-500 bg-neutral-100"
              )}
            >
              <TableCell className="font-medium">
                <div className={cn("absolute h-[1px] -translate-y-1/2 top-1/2 left-0 w-full bg-gray-500",!song.done && "hidden")} />
                {index + 1}
              </TableCell>
              <TableCell>{song.title}</TableCell>
              <TableCell className="text-right">
                {format(new Date(song.createAt), "HH:mm:ss:SS")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UserSongTable;
