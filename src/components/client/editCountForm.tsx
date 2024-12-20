"use client";

import { LiveSession } from "@prisma/client";
import { Button } from "@/components/ui/button";
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
import { updateEditCount } from "@/action/updateEditCount";

interface LimitFormProps {
  id: LiveSession["id"];
  editCount: LiveSession["editCountDefault"];
}

export const EditCountForm = forwardRef<HTMLButtonElement, LimitFormProps>(
  ({ id, editCount }, ref) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [limit, setLimit] = useState(editCount)

    // Handle form submission
    const onSubmit = async () => {
      if (!id || isSubmitting) return;
      setIsSubmitting(true);

      try {

        updateEditCount({ id, editCountDefault: limit });

        closeRef.current?.click();

        // Show success toast
        toast({
          title: "Success",
          description: "Edit count limit updated successfully",
        });
      } catch (error) {
        console.error("Error setting Edit count limit or sending data:", error);

        // Show error toast
        toast({
          title: "Error",
          description: "Failed to update edit count limit",
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
              <DialogTitle>Set Edit Count Limit</DialogTitle>
              <DialogDescription>
                Set the maximum number of times a song can be edited
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
              {isSubmitting ? "Submitting..." : "Edit Count Limit"}
            </Button>
            <DialogClose className="hidden" ref={closeRef} />
          </DialogContent>
        </Dialog>
      </form>
    );
  }
);

EditCountForm.displayName = "LimitForm";
