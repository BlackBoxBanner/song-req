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
import { editSong } from "@/components/action/admin";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import Link from "next/link";

type AdminSongTableProps = {
  songs: Song[];
  id: LiveSession["id"];
};

const AdminSongTable = ({ songs: initialSongs, id }: AdminSongTableProps) => {
  // Using socket to receive updated songs list
  const songs = useReceiveData<Song[]>("receive-song", initialSongs);

  // Handle song completion status change
  const handleCheckChange = async (song: Song, checked: boolean) => {
    try {
      // Edit the song status and get the updated song list
      const newSongList = await editSong({ id: song.id, done: checked });
      // Send the updated song list via socket
      sendData("send-song", createObject(id, newSongList));
    } catch (error) {
      console.error("Error updating song status:", error);
    }
  };

  // Join room on mount and leave on unmount
  useEffect(() => {
    if (id) {
      joinRoom(id);

      return () => {
        leaveRoom(id); // Clean up the socket room
      };
    }
  }, [id]);

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
              key={song.id} // Use the song's unique id as the key
              className={cn("relative", song.done && "text-gray-500 bg-neutral-100")}
            >
              <TableCell className="font-medium">
                <div
                  className={cn(
                    "absolute h-[1px] -translate-y-1/2 top-1/2 left-0 w-full bg-gray-500",
                    !song.done && "hidden"
                  )}
                />
                {index + 1}
              </TableCell>
              <TableCell>
                <Link
                  href={`https://www.dochord.com/search/?q=${song.title}`}
                  target="_blank"
                >
                  {song.title} <span className="text-xs text-muted-foreground">{!song.editCount && "(edited)"}</span>
                </Link>
              </TableCell>
              <TableCell className="text-right">
                {format(new Date(song.createAt), "HH:mm:ss:SS")}{" "}
                {/* Ensure date is formatted properly */}
              </TableCell>
              <TableCell className="flex justify-start items-center">
                <Checkbox
                  aria-labelledby={`song-check-${song.id}`}
                  className="flex justify-center items-center"
                  checked={song.done}
                  onCheckedChange={async (checked) => {
                    await handleCheckChange(song, !!checked); // Handle checkbox state change
                  }}
                  disabled={song.done} // Disable checkbox if song is marked done
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
