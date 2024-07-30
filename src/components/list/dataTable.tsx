"use client";

import {cn} from "@/lib/utils";
import {Song} from "@prisma/client";
import {Cross2Icon} from "@radix-ui/react-icons";
import {format, toZonedTime} from "date-fns-tz";
import {ComponentProps} from "react";
import {Button} from "../ui/button";
import {socket} from "@/lib/socket";
import {toast} from "../ui/use-toast";
import Link from "next/link";

type DataTableProps = {
  songs: Song[];
  admin?: boolean;
};

const DataTable = ({songs, admin = false}: DataTableProps) => {
  const timeZone = "Asia/Bangkok";

  const onDelete = ({id}: {id: string}) => {
    const deleteSongToast = toast({
      title: "กำลังลบเพลง",
      description: "รอสักครู่...",
      duration: 10000,
    });

    const fetchDelete = () => {
      return fetch(`/api/song`, {
        method: "DELETE",
        body: JSON.stringify({id}),
      })
        .then(async (res) => {
          return await res.json();
        })
        .then(async (data) => {
          socket.emit("send-song", data);
        });
    };

    fetchDelete()
      .then(() => {
        deleteSongToast.update({
          ...deleteSongToast,
          title: "สำเร็จ!",
          description: "ลบเพลงเรียบร้อยแล้ว",
        });
      })
      .catch(() => {
        deleteSongToast.update({
          ...deleteSongToast,
          title: "โอ๊ะ!",
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
      <Header></Header>
      <Header>ชื่อเพลง</Header>
      <Header>ขอเมื่อ</Header>
      {admin ? (
        <>
          <Header></Header>
        </>
      ) : (
        ""
      )}
      {songs.map((song, index) => {
        return (
          <>
            <Cell key={`song num q ${index}`} last={songs.length - 1 == index}>
              {(index + 1).toString()}.
            </Cell>
            <a
              href={`https://www.dochord.com/search/?q=${song.title}`}
              rel="noopener noreferrer"
              target="_blank"
              key={`song title ${song.title} ${index}`}
              className="w-full">
              <Cell last={songs.length - 1 == index} deleted={song.delete}>
                {song.title}
              </Cell>
            </a>
            <Cell
              key={`song create at ${index}`}
              last={songs.length - 1 == index}>
              {format(
                toZonedTime(new Date(song.createAt), timeZone),
                "HH:mm:ss"
              )}
            </Cell>
            {admin ? (
              <>
                <div>
                  <CellButton
                    key={`song delete ${song.title} ${index}`}
                    last={songs.length - 1 == index}
                    onClick={() => onDelete({id: song.id})}
                    className={cn(song.delete && "hidden")}
                    show={song.delete}>
                    <Cross2Icon />
                  </CellButton>
                </div>
              </>
            ) : (
              ""
            )}
          </>
        );
      })}
    </div>
  );
};

export default DataTable;

const Header = ({className, ...props}: ComponentProps<"p">) => {
  return (
    <p
      className={cn("bg-primary/5 p-2 border-b font-semibold", className)}
      {...props}
    />
  );
};

const Cell = ({
  className,
  deleted = false,
  last = false,
  show = false,
  ...props
}: ComponentProps<"p"> & {
  deleted?: boolean;
  last?: boolean;
  show?: boolean;
}) => {
  return (
    <div className={cn("h-full", !last && "border-b")}>
      {` `}
      <p
        className={cn(
          "p-2 my-auto h-full",
          deleted && "line-through",
          show && "hidden",
          className
        )}
        {...props}
      />
    </div>
  );
};

const CellButton = ({
  className,
  type,
  last = false,
  show = false,
  ...props
}: ComponentProps<"button"> & {
  deleted?: boolean;
  last?: boolean;
  show?: boolean;
}) => {
  return (
    <div className={cn("h-full", !last && "border-b")}>
      {` `}
      <button
        type="button"
        className={cn("my-auto h-full px-4", show && "hidden", className)}
        {...props}
      />
    </div>
  );
};
