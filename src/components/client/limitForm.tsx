"use client";

import { LiveSession } from "@prisma/client";
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
import { useToast } from "@/components/ui/use-toast";

interface LimitFormProps {
  id: LiveSession["id"];
  limit: LiveSession["limit"];
  config: {
    isClearAfterLimitChange: LiveSession["clearOnChangeLimit"];
  }
}

export const LimitForm = forwardRef<HTMLButtonElement, LimitFormProps>(
  ({ id, limit: limitDefault, config }, ref) => {
    const songLimit = useReceiveData("receive-limit", limitDefault);
    const sessionConfig = useReceiveData("receive-session-config", config);
    const closeRef = useRef<HTMLButtonElement>(null);
    const [limit, setLimit] = useState(songLimit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    // Handle form submission
    const onSubmit = async () => {
      if (!id || isSubmitting) return;
      setIsSubmitting(true);

      try {
        // Update song limit via admin action
        const songs = await setLimitAction({ id, limit, willClear: sessionConfig.isClearAfterLimitChange });

        // Send updated limit and song list through socket
        sendData("send-limit", createObject(id, limit));
        sendData("send-song", createObject(id, songs?.Song || []));
        sendData("send-allowRequest", createObject(id, songs?.allowRequest)); // Removed the non-null assertion (!)

        // Close the dialog on successful submission
        closeRef.current?.click();

        // Show success toast
        toast({
          title: "Success",
          description: "Song limit updated successfully",
        });
      } catch (error) {
        console.error("Error setting limit or sending data:", error);

        // Show error toast
        toast({
          title: "Error",
          description: "Failed to update song limit",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false); // Re-enable submit button after completion
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
        onSubmit={(e) => e.preventDefault()} // Prevent form submission behavior
      >
        <Dialog>
          <DialogTrigger ref={ref} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Song Request Limit</DialogTitle>
              <DialogDescription>
                Set the maximum number of songs a user can request in this live
                session.
              </DialogDescription>
            </DialogHeader>
            <Input
              aria-labelledby="limit-input"
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                // Ensure the value is a valid number and not negative
                if (!isNaN(value) && value >= 0) {
                  setLimit(value);
                }
              }}
              value={limit?.toFixed(0)} // Ensure the input value is an integer string
              inputMode="numeric" // Input mode restricted to numeric values
            />
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting} // Disable button when submitting
            >
              {isSubmitting ? "Submitting..." : "Set Limit"}
            </Button>
            <DialogClose className="hidden" ref={closeRef} />
          </DialogContent>
        </Dialog>
      </form>
    );
  }
);

LimitForm.displayName = "LimitForm";
