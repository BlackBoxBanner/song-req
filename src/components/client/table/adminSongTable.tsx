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
import {
  createObject,
  joinRoom,
  sendData,
  useReceiveData,
  leaveRoom,
} from "@/lib/socket"; // Added leaveRoom for cleanup
import { LiveSession, Song } from "@prisma/client";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState, useCallback, memo } from "react";
import Link from "next/link";
import { updateSongStatus } from "@/action/updateSongStatus";

type AdminSongTableProps = {
  songs: Song[];
  id: LiveSession["id"];
};

const AdminSongTable = memo(({ songs: initialSongs, id }: AdminSongTableProps) => {
  const [error, setError] = useState<string | null>(null);
  const songs = useReceiveData<Song[]>("receive-song", initialSongs);

  const memoizedSongs = useMemo(() => songs, [songs]);

  const handleCheckChange = useCallback(async (song: Song, checked: boolean) => {
    try {
      const newSongList = await updateSongStatus({ id: song.id, done: checked });
      sendData("send-song", createObject(id, newSongList));
    } catch (error) {
      console.error("Error updating song status:", error);
      setError("Failed to update song status. Please try again.");
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      joinRoom(id);

      return () => {
        leaveRoom(id);
      };
    }
  }, [id]);

  const tableRowClass = "relative";
  const tableCellClass = "font-medium";
  const checkboxClass = "flex justify-center items-center";

  return (
    <>
      {error && <div className="error-message">{error}</div>}
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
          {memoizedSongs?.map((song, index) => (
            <TableRow
              key={song.id}
              className={cn(tableRowClass, song.done && "text-gray-500 bg-neutral-100 line-through")}
            >
              <TableCell className={tableCellClass}>
                {index + 1}
              </TableCell>
              <TableCell>
                <Link
                  href={`https://www.dochord.com/search/?q=${song.title}`}
                  target="_blank"
                >
                  {song.title} <span className="text-muted-foreground ml-2">{!song.editCount && "(edited)"}</span>
                </Link>
              </TableCell>
              <TableCell className="text-right">
                {format(new Date(song.createAt), "HH:mm:ss:SS")}
              </TableCell>
              <TableCell className="flex justify-start items-center">
                <Checkbox
                  aria-labelledby={`song-check-${song.id}`}
                  className={checkboxClass}
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
});

export default AdminSongTable;