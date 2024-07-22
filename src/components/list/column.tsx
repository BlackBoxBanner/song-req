"use client";

import {Song} from "@prisma/client";
import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "../ui/checkbox";
import {Button} from "../ui/button";
import {Cross2Icon} from "@radix-ui/react-icons";
import {socket} from "@/lib/socket";
import {toast} from "../ui/use-toast";
import Link from "next/link";

export const columns: ColumnDef<Song>[] = [
  {
    accessorKey: "title",
    header: "ชื่อเพลง",
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
          legacyBehavior>
          <Button
            variant={"ghost"}
            className="w-full px-2 text-start justify-start">
            {value as string}
          </Button>
        </Link>
      );
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
            });
          });
      };
      return (
        <div className="flex justify-end">
          <Button variant={"link"} size={"icon"} onClick={onDelete}>
            <Cross2Icon />
          </Button>
        </div>
      );
    },
  },
];
