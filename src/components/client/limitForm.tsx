"use client";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { setLimit as setLimitAction } from "@/components/action/admin";
import {
  createObject,
  joinRoom,
  sendData,
  useReceiveData,
  leaveRoom,
} from "@/lib/socket";
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

interface LimitFormProps {
  name: User["name"];
  limit: User["limit"];
}

export const LimitForm = ({ name, limit: limitDefault }: LimitFormProps) => {
  const songLimit = useReceiveData("receive-limit", limitDefault);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [limit, setLimit] = useState(songLimit);

  // Update the limit state whenever songLimit changes
  useEffect(() => {
    if (songLimit !== limit) {
      setLimit(songLimit);
    }
  }, [songLimit]);

  const onSubmit = async () => {
    if (!name) return;
    try {
      const songs = await setLimitAction({ name, limit });
      sendData("send-limit", createObject(name, limit));
      sendData("send-song", createObject(name, songs?.Song || []));
      closeRef.current?.click(); // Close dialog on successful submission
    } catch (error) {
      console.error("Error setting limit or sending data:", error);
    }
  };

  useEffect(() => {
    if (name) {
      joinRoom(name); // Join room when component mounts
    }

    return () => {
      if (name) {
        leaveRoom(name); // Clean up by leaving room when component unmounts
      }
    };
  }, [name]);

  return (
    <form
      className="grid grid-cols-subgrid gap-4 col-span-2"
      onSubmit={(e) => e.preventDefault()} // Prevent form's default behavior
    >
      <Input
        onChange={(e) => {
          const rawValue = e.target.value;
          if (rawValue === "") {
            return setLimit(0); // Set limit to 0 if input is empty
          }
          const value = parseInt(rawValue, 10);
          if (!isNaN(value)) {
            setLimit(value); // Set limit only if the parsed value is a valid number
          }
        }}
        value={limit?.toFixed(0)} // Ensure the input value is an integer string
        inputMode="numeric" // Set input mode for numeric inputs
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
              songs from the list.
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
