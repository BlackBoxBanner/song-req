"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requestSongAction } from "@/components/action/song";
import {
  createObject,
  joinRoom,
  sendData,
  useReceiveData,
  leaveRoom,
} from "@/lib/socket"; // Added leaveRoom for cleanup
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { LiveSession } from "@prisma/client";

type SongRequestFormProps = {
  live: LiveSession["live"];
  id: LiveSession["id"];
  limit: LiveSession["limit"];
  allowRequest: LiveSession["allowRequest"];
};

const SongRequestForm = ({
  live = false,
  id,
  limit,
  allowRequest,
}: SongRequestFormProps) => {
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

  // Handle form submission
  const submitHandler = async ({ song }: SongSchemaType) => {
    if (!song || song.trim() === "") return;
    try {
      // Perform the song request action
      const songList = await requestSongAction({
        id,
        title: song.trim(),
        songLimit,
      });

      // Send updated song list through socket
      sendData("send-song", createObject(id, songList));

      // Reset the form on successful submission
      reset();
    } catch (error) {
      // Handle error with toast notification
      if (error instanceof Error) {
        console.error("Error requesting song:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  // Join socket room on component mount and leave on unmount
  useEffect(() => {
    if (id) {
      joinRoom(id); // Join the room for the session

      return () => {
        leaveRoom(id); // Leave room when component unmounts
      };
    }
  }, [id]);

  return (
    <form className="flex gap-2 pt-2" onSubmit={handleSubmit(submitHandler)}>
      <Input
        placeholder={!isLive ? "Live session is not available" : !isAllowRequest ? "Song request is not allowed at the moment" : "Song name"}
        {...register("song")}
        disabled={!isLive || !isAllowRequest} // Disable input if live session is not available or song request is not allowed
      />
      <Button type="submit" disabled={!isLive}>
        Request
      </Button>
    </form>
  );
};

export default SongRequestForm;
