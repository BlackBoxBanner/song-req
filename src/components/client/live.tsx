"use client";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { changeLive } from "@/components/action/admin";
import {
  createObject,
  joinRoom,
  sendData,
  useReceiveData,
  leaveRoom,
} from "@/lib/socket"; // Added leaveRoom for cleanup
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ChangeLiveFormProps {
  live: User["live"];
  name: User["name"];
}

const ChangeLiveForm = (props: ChangeLiveFormProps) => {
  // Use liveStatus here before defining it
  const liveStatus = useReceiveData("receive-session", props.live);

  const onChangeLive = async () => {
    try {
      const data = await changeLive({ name: props.name, live: liveStatus });
      if (!data) return;
      sendData("send-session", createObject(props.name!, data.live)); // Removed the non-null assertion (!)
    } catch (error) {
      console.error("Error changing live status:", error);
    }
  };

  useEffect(() => {
    if (props.name) {
      joinRoom(props.name); // Safely join the room using props.name
    }

    return () => {
      if (props.name) {
        leaveRoom(props.name); // Leave room on component unmount
      }
    };
  }, [props.name]);

  return (
    <Button
      onClick={onChangeLive}
      variant={liveStatus ? "default" : "secondary"}
    >
      {liveStatus ? "Live Online" : "Live Offline"}
    </Button>
  );
};

interface LiveStatusProps {
  live: User["live"];
  name: User["name"];
  prefix?: string;
}

const LiveStatus = ({ prefix = "", ...props }: LiveStatusProps) => {
  const liveStatus = useReceiveData("receive-session", props.live);

  useEffect(() => {
    if (props.name) {
      joinRoom(props.name); // Join room when component mounts
    }

    return () => {
      if (props.name) {
        leaveRoom(props.name); // Clean up by leaving the room on unmount
      }
    };
  }, [props.name]);

  return (
    <p
      className={cn(
        "w-full p-2 rounded text-center col-span-2 shadow",
        liveStatus
          ? "bg-green-400 text-primary"
          : "bg-red-600 text-primary-foreground"
      )}
    >
      {`${prefix} ${liveStatus ? "Live" : "Offline"}`}
    </p>
  );
};

export { ChangeLiveForm, LiveStatus };
