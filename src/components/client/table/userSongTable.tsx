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
import { Pencil1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChangeSongNameForm } from "@/components/client/changeSongNameForm";
import { useEffect, useState, useCallback, use } from "react";
import React from "react";
import { getSongListCookie } from "@/action/getSongListCookie";
import { fetchLiveSessionByRoute } from "@/action/fetchLiveSessionByRoute";
import { notFound } from "next/navigation";

type UserSongTableProps = {
  LiveSessionPromise: ReturnType<typeof fetchLiveSessionByRoute>;
};

const UserSongTable = React.memo(({ LiveSessionPromise }: UserSongTableProps) => {
  const liveSession = use(LiveSessionPromise);
  if (!liveSession) return notFound();
  const songs = useReceiveData<Song[]>("receive-song", liveSession.Song);
  const [cookieContent, setCookieContent] = useState<string[]>([]);

  const fetchSongListCookie = useCallback(async () => {
    const res = await getSongListCookie();
    setCookieContent(res);
  }, []);

  useEffect(() => {
    fetchSongListCookie();
  }, [fetchSongListCookie, songs]);

  return (
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
            key={song.id || index} // Ensure song.id is unique, index as fallback
            className={cn(
              "relative",
              song.done && "text-gray-500 bg-neutral-100 line-through"
            )}
          >
            <TableCell className="font-medium">
              {index + 1}
            </TableCell>
            <TableCell>{song.title} <span className="text-muted-foreground ml-2">{!song.editCount && "(edited)"}</span></TableCell>
            <TableCell className="text-right">
              {format(new Date(song.createAt), "HH:mm:ss:SS")}
            </TableCell>
            <TableCell className="text-right w-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className={cn("h-full flex justify-center items-center",
                      !cookieContent.includes(song.id) && "opacity-0")}
                    disabled={song.done || !cookieContent.includes(song.id) || !song.editCount}
                  >
                    <Pencil1Icon className={cn((song.done || !song.editCount) && "opacity-50 fill-muted", !cookieContent.includes(song.id) && "opacity-0")} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <ChangeSongNameForm song={song} liveId={liveSession.id} />
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

UserSongTable.displayName = "UserSongTable";

export default UserSongTable;