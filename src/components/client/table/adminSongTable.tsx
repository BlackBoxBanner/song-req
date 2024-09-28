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

const AdminSongTable = ({ songs: initialSongs, name }: AdminSongTableProps) => {
  // Using socket to receive updated songs list
  const songs = useReceiveData<Song[]>("receive-song", initialSongs);

  // Handle song completion status change
  const handleCheckChange = async (song: Song, checked: boolean) => {
    try {
      // Edit the song status and get the updated song list
      const newSongList = await editSong({ id: song.id, done: checked });
      // Send the updated song list via socket
      sendData("send-song", createObject(name, newSongList));
    } catch (error) {
      console.error("Error updating song status:", error);
    }
  };

  // Join room on mount and leave on unmount
  useEffect(() => {
    if (name) {
      joinRoom(name);

      return () => {
        leaveRoom(name); // Clean up the socket room
      };
    }
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
              key={song.id} // Use the song's unique id as the key
              className={cn(song.done && "bg-neutral-100")}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{song.title}</TableCell>
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