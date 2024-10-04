"use client";

import { LiveSession, User } from "@prisma/client";
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
import { forwardRef, useEffect, useRef, useState } from "react";
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
  id: LiveSession["id"];
  limit: LiveSession["limit"];
}

export const LimitForm = forwardRef<HTMLButtonElement, LimitFormProps>(
  ({ id, limit: limitDefault }, ref) => {
    const songLimit = useReceiveData("receive-limit", limitDefault);
    const closeRef = useRef<HTMLButtonElement>(null);
    const [limit, setLimit] = useState(songLimit);

    const onSubmit = async () => {
      if (!id) return;
      try {
        const songs = await setLimitAction({ id, limit });
        sendData("send-limit", createObject(id, limit));
        sendData("send-song", createObject(id, songs?.Song || []));
        closeRef.current?.click(); // Close dialog on successful submission
      } catch (error) {
        console.error("Error setting limit or sending data:", error);
      }
    };

    useEffect(() => {
      if (id) {
        joinRoom(id); // Join room when component mounts
      }

      return () => {
        if (id) {
          leaveRoom(id); // Clean up by leaving room when component unmounts
        }
      };
    }, [id]);

    return (
      <form
        className="hidden"
        onSubmit={(e) => e.preventDefault()} // Prevent form's default behavior
      >
        <Dialog>
          <DialogTrigger ref={ref} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set limit</DialogTitle>
              <DialogDescription>
                This will set the limit for the number of songs a user can
                request.
              </DialogDescription>
            </DialogHeader>
            <Input
              aria-labelledby="limit-input"
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
            <Button type="button" onClick={onSubmit}>
              Sure
            </Button>
            <DialogClose className="hidden" ref={closeRef} />
          </DialogContent>
        </Dialog>
      </form>
    );
  }
);

LimitForm.displayName = "LimitForm";
