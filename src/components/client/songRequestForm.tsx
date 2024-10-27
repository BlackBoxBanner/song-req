"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createObject,
  joinRoom,
  sendData,
  useReceiveData,
  leaveRoom,
} from "@/lib/socket";
import { useToast } from "@/components/ui/use-toast";
import { use, useEffect, useState } from "react";;
import { requestSongAction } from "@/action/requestSongAction";
import { fetchLiveSessionByRoute } from "@/action/fetchLiveSessionByRoute";
import { notFound } from "next/navigation";

type SongRequestFormProps = {
  LiveSessionPromise: ReturnType<typeof fetchLiveSessionByRoute>;
};

const SongRequestForm = ({
  LiveSessionPromise
}: SongRequestFormProps) => {
  const liveSession = use(LiveSessionPromise);
  if (!liveSession) return notFound();
  const { id, live, limit, allowRequest } = liveSession;
  const isLive = useReceiveData("receive-session", live);
  const songLimit = useReceiveData("receive-limit", limit);
  const isAllowRequest = useReceiveData("receive-allowRequest", allowRequest);

  // Zod schema for form validation
  const songSchema = z.object({
    song: z.string().min(1, "Song name is required"),
  });

  type SongSchemaType = z.infer<typeof songSchema>;

  // React Hook Form setup with Zod validation
  const { register, handleSubmit, reset } = useForm<SongSchemaType>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      song: "",
    },
  });

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Track countdown in seconds

  // Utility function to handle errors and show toast messages
  const showErrorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  // Handle form submission
  const submitHandler = async ({ song }: SongSchemaType) => {
    if (!song.trim()) return;

    setIsSubmitting(true);
    setCooldown(5); // Set cooldown for 5 seconds

    try {
      // Request the song
      const songList = await requestSongAction({
        id,
        title: song.trim(),
      });

      // Send the updated song list through the socket
      sendData("send-song", createObject(id, songList));

      // Reset the form on successful submission
      reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      showErrorToast(errorMessage);
    } finally {
      // Start countdown for cooldown
      const countdownInterval = setInterval(() => {
        setCooldown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setIsSubmitting(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Join the socket room on mount and leave on unmount
  useEffect(() => {
    if (id) {
      joinRoom(id);

      return () => {
        leaveRoom(id);
      };
    }
  }, [id]);

  const isInputDisabled =
    !isLive || !isAllowRequest || isSubmitting || songLimit <= 0;

  return (
    <form className="flex gap-2 pt-2 items-center" onSubmit={handleSubmit(submitHandler)}>
      <Input
        placeholder={
          !isLive
            ? "Live session is not available"
            : !isAllowRequest
              ? "Song request is not allowed at the moment"
              : songLimit <= 0
                ? "Song limit reached"
                : "Enter song name"
        }
        {...register("song")}
        disabled={isInputDisabled} // Input disabled based on conditions
      />
      <Button type="submit" disabled={isInputDisabled}>
        {isSubmitting ? `Wait ${cooldown}s` : "Request"}
      </Button>
    </form>
  );
};

export default SongRequestForm;
