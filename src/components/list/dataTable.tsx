"use client";

import {cn} from "@/lib/utils";
import {Song} from "@prisma/client";
import {Cross2Icon} from "@radix-ui/react-icons";
import {format, toZonedTime} from "date-fns-tz";
import React, {ComponentProps} from "react";
import {socket} from "@/lib/socket";
import {toast} from "@/components/ui/use-toast";

type DataTableProps = {
  songs: Song[];
  admin?: boolean;
};

const Header = ({className, ...props}: ComponentProps<"p">) => (
  <p
    className={cn("bg-popover p-2 border-b font-semibold", className)}
    {...props}
  />
);

const Cell = ({
  className,
  deleted = false,
  last = false,
  ...props
}: ComponentProps<"p"> & {deleted?: boolean; last?: boolean}) => (
  <div
    className={cn(
      "h-full",
      !last && "border-b",
      deleted && "bg-muted text-muted-foreground"
    )}>
    <p
      className={cn("p-2 my-auto h-full", deleted && "line-through", className)}
      {...props}
    />
  </div>
);

const CellButton = ({
  className,
  last = false,
  show = false,
  ...props
}: ComponentProps<"button"> & {last?: boolean; show?: boolean}) => (
  <div
    className={cn(
      "h-full",
      !last && "border-b",
      show && "bg-muted text-muted-foreground"
    )}>
    <button
      type="button"
      className={cn("my-auto h-full px-4", show && "hidden", className)}
      {...props}
    />
  </div>
);

const DataTable = ({songs, admin = false}: DataTableProps) => {
  const timeZone = "Asia/Bangkok";

  const onDelete = ({id}: {id: string}) => {
    const deleteSongToast = toast({
      title: "กำลังลบเพลง",
      description: "รอสักครู่...",
      duration: 10000,
    });

    fetch(`/api/song`, {
      method: "DELETE",
      body: JSON.stringify({id}),
    })
      .then(async (res) => await res.json())
      .then((data) => {
        socket.emit("send-song", data);
        deleteSongToast.update({
          ...deleteSongToast,
          title: "สำเร็จ!",
          description: "ลบเพลงเรียบร้อยแล้ว",
        });
      })
      .catch(() => {
        deleteSongToast.update({
          title: "โอ๊ะ!",
          ...deleteSongToast,
          description: "ลบเพลงไม่ได้ มีปัญหานิดหน่อย",
          variant: "destructive",
        });
      })
      .finally(() => {
        deleteSongToast.update({
          ...deleteSongToast,
          duration: 1000,
        });
      });
  };

  return (
    <div
      className={cn(
        "grid border rounded-lg overflow-hidden",
        !admin ? "grid-cols-[auto,1fr,auto]" : "grid-cols-[auto,1fr,auto,auto]"
      )}>
      <Header />
      <Header>ชื่อเพลง</Header>
      <Header>ขอเมื่อ</Header>
      {admin && <Header />}
      {songs.map((song, index) => (
        <React.Fragment key={song.id}>
          <Cell last={songs.length - 1 === index} deleted={song.delete}>
            {(index + 1).toString()}.
          </Cell>
          <a
            href={
              song.delete
                ? undefined
                : `https://www.dochord.com/search/?q=${song.title}`
            }
            rel="noopener noreferrer"
            target={song.delete ? undefined : "_blank"}
            className={cn(
              "w-full",
              song.delete &&
                "pointer-events-none cursor-default text-muted-foreground"
            )}
            onClick={song.delete ? (e) => e.preventDefault() : undefined}>
            <Cell last={songs.length - 1 === index} deleted={song.delete}>
              {song.title}
            </Cell>
          </a>
          <Cell last={songs.length - 1 === index} deleted={song.delete}>
            {format(toZonedTime(new Date(song.createAt), timeZone), "HH:mm:ss")}
          </Cell>
          {admin && (
            <CellButton
              last={songs.length - 1 === index}
              onClick={() => onDelete({id: song.id})}
              show={song.delete}>
              <Cross2Icon />
            </CellButton>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default DataTable;
