"use client";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { setLimit as setLimitAction } from "@/components/action/admin";
import { createObject, joinRoom, sendData, useReceiveData } from "@/lib/socket";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export const LimitForm = ({
  name,
  limit: limitDefault,
}: Pick<User, "name" | "limit">) => {
  const songLimit = useReceiveData("receive-limit", limitDefault);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [limit, setLimit] = useState(songLimit);

  const onSubmit = async () => {
    if (!name) return;
    const songs = await setLimitAction({ name, limit });
    sendData("send-limit", createObject(name, limit));
    sendData("send-song", createObject(name, songs?.Song));
    closeRef.current?.click();
  };

  useEffect(() => {
    joinRoom(name!);
  }, [name]);

  return (
    <form
      className="grid grid-cols-subgrid gap-4 col-span-2"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Input
        onChange={(e) => {
          const rawValue = e.target.value;
          if (rawValue === "") return setLimit(0);
          const value = parseInt(rawValue);
          if (isNaN(value)) return;
          setLimit(value);
        }}
        value={limit?.toFixed(0)}
        inputMode="numeric"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button>Set Limit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete all
              songs from list.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button type="button" onClick={onSubmit}>
              Sure
            </Button>
            <DialogClose className="hidden" ref={closeRef} />
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};
