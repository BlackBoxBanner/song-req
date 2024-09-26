"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requestSongAction } from "@/components/action/song";
import { sendData, useReceiveData } from "@/lib/socket";
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
  const songSchema = z.object({
    song: z.string().min(1, "Song name is required"),
  });

  type SongSchemaType = z.infer<typeof songSchema>;

  const { register, handleSubmit, reset } = useForm<SongSchemaType>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      song: "",
    },
  });

  const { toast } = useToast();

  const submitHandler = async ({ song }: SongSchemaType) => {
    try {
      const songList = await requestSongAction({
        name,
        songName: song,
        songLimit,
      });
      sendData("send-song", songList);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
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
    reset();
  };

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
  }, [liveStatus]);

  return (
    <form className="flex gap-2 pt-2" onSubmit={handleSubmit(submitHandler)}>
      <Input
        placeholder={
          !liveStatus ? "Live session is not available" : "Song name"
        }
        {...register("song")}
        disabled={!liveStatus}
      />
      <Button type="submit" disabled={!liveStatus}>
        Request
      </Button>
    </form>
  );
};

export default SongRequestForm;
