"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import Link from "next/link";
import { sendData, useReceiveData, joinRoom, leaveRoom } from "@/lib/socket";
import { editSong } from "@/components/action/admin";
import { Song } from "@prisma/client";
import { cn } from "@/lib/utils";

type AdminSongTableProps = {
  songs: Song[];
  id: string;
};

const AdminSongTable = ({ songs: initialSongs, id }: AdminSongTableProps) => {
  const songs = useReceiveData<Song[]>("receive-song", initialSongs);

  const handleCheckChange = async (song: Song, checked: boolean) => {
    try {
      const updatedSongs = await editSong({ id: song.id, done: checked });
      sendData("send-song", { id, updatedSongs });
    } catch (error) {
      console.error("Failed to update song status:", error);
    }
  };

  useEffect(() => {
    if (id) joinRoom(id);
    return () => leaveRoom(id);
  }, [id]);

  return (
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
            key={song.id}
            className={cn(
              "relative",
              song.done && "line-through text-gray-500 bg-neutral-100",
            )}
          >
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Link
                href={`https://www.dochord.com/search/?q=${song.title}`}
                target="_blank"
              >
                {song.title}{" "}
                {song.editCount ? (
                  ""
                ) : (
                  <span className="ml-2 text-muted-foreground">(edited)</span>
                )}
              </Link>
            </TableCell>
            <TableCell className="text-right">
              {format(new Date(song.createAt), "HH:mm:ss:SS")}
            </TableCell>
            <TableCell>
              <Checkbox
                checked={song.done}
                onCheckedChange={(checked) =>
                  handleCheckChange(song, !!checked)
                }
                aria-label={`Mark ${song.title} as ${song.done ? "incomplete" : "complete"}`}
                disabled={song.done}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminSongTable;
