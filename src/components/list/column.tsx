"use client";

import {Song} from "@prisma/client";
import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "../ui/checkbox";
import {Button} from "../ui/button";
import {Cross2Icon} from "@radix-ui/react-icons";

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
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({row}) => {
      const onDelete = () => {
        const id = row.getValue("id");

        fetch(`/api/song`, {
          method: "DELETE",
          body: JSON.stringify({id}),
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
