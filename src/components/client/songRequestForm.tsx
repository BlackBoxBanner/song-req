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

type SongRequestFormProps = {
  live: boolean;
  name: string;
  limit: number;
};

const SongRequestForm = ({
  live = false,
  name,
  limit,
}: SongRequestFormProps) => {
  const liveStatus = useReceiveData("receive-session", live);
  const songLimit = useReceiveData("receive-limit", limit);

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
        name,
        songName: song,
        songLimit,
      });

      // Send updated song list through socket
      sendData("send-song", createObject(name, songList));

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

  // Effect to handle live session status
  useEffect(() => {
    if (!liveStatus) {
      toast({
        title: "Error",
        description: "Live session is not available",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Live session is available",
      });
    }
  }, [liveStatus, toast]);

  // Join socket room on component mount and leave on unmount
  useEffect(() => {
    if (name) {
      joinRoom(name); // Join the room for the session

      return () => {
        leaveRoom(name); // Leave room when component unmounts
      };
    }
  }, [name]);

  return (
    <form className="flex gap-2 pt-2" onSubmit={handleSubmit(submitHandler)}>
      <Input
        placeholder={
          !liveStatus ? "Live session is not available" : "Song name"
        }
        {...register("song")}
        disabled={!liveStatus} // Disable input if live session is not available
      />
      <Button type="submit" disabled={!liveStatus}>
        Request
      </Button>
    </form>
  );
};

export default SongRequestForm;
