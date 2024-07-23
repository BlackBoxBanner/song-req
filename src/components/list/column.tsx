"use client";

import {Song} from "@prisma/client";
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "../ui/button";
import {Cross2Icon} from "@radix-ui/react-icons";
import {socket} from "@/lib/socket";
import {toast} from "../ui/use-toast";
import Link from "next/link";
import {format, toZonedTime} from "date-fns-tz";

export const columns: ColumnDef<Song>[] = [
  {
    accessorKey: "title",
    header: "ชื่อเพลง",
  },
  {
    accessorKey: "createAt",
    header: () => {
      return <p className="text-end">ขอเมื่อ</p>;
    },
    cell: ({getValue}) => {
      const value = getValue() as string;

      if (value) {
        const timeZone = "Asia/Bangkok";
        const zonedDate = toZonedTime(new Date(value), timeZone);
        return <p className="text-end">{format(zonedDate, "HH:mm:ss")}</p>;
      }

      return "เวลาผิดพลาด";
    },
  },
];

export const columnsAdmin: ColumnDef<Song>[] = [
  {
    accessorKey: "title",
    header: "ชื่อเพลง",
    cell: ({getValue}) => {
      const value = getValue();
      return (
        <Link
          href={`https://www.dochord.com/search/?q=${value}`}
          rel="noopener noreferrer"
          target="_blank"
          passHref
          className="w-full"
          legacyBehavior>
          {value as string}
        </Link>
      );
    },
  },
  {
    accessorKey: "createAt",
    header: "ขอเมื่อ",
    cell: ({getValue}) => {
      const value = getValue() as string;

      if (value) {
        const timeZone = "Asia/Bangkok";
        const zonedDate = toZonedTime(new Date(value), timeZone);
        return <>{format(zonedDate, "HH:mm:ss")}</>;
      }

      return "เวลาผิดพลาด";
    },
  },
  {
    accessorKey: "id",
    header: "",
    size: 200,
    minSize: 50,
    maxSize: 200,
    enableResizing: false,
    cell: ({row, getValue}) => {
      const onDelete = () => {
        const deleteSongToast = toast({
          title: "เซิร์ฟเวอร์",
          description: "กำลังลบเพลง",
          duration: 1000,
        });

        const id = getValue();
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
            deleteSongToast.dismiss();
          })
          .catch(() => {
            deleteSongToast.dismiss();
            toast({
              title: "โอ๊ะ!",
              description: "ลบเพลงไม่ได้ มีปัญหานิดหน่อย",
              variant: "destructive",
              duration: 1000,
            });
          });
      };
      return (
        <div className="flex justify-end">
          <Button variant={"ghost"} size={"sm"} onClick={onDelete}>
            <Cross2Icon />
          </Button>
        </div>
      );
    },
  },
];
